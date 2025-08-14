const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const { AppError } = require('./errorHandler');

// Ensure upload directory exists
const ensureUploadDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath;
    
    // Determine upload path based on file type
    if (file.fieldname === 'model') {
      uploadPath = path.join(process.env.UPLOAD_PATH || './uploads', 'models');
    } else if (file.fieldname === 'cloth' || file.fieldname === 'clothes') {
      uploadPath = path.join(process.env.UPLOAD_PATH || './uploads', 'clothes');
    } else {
      uploadPath = path.join(process.env.UPLOAD_PATH || './uploads', 'misc');
    }
    
    ensureUploadDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    const name = file.fieldname + '-' + uniqueSuffix + ext;
    cb(null, name);
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Check file type
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new AppError('Only image files (JPEG, JPG, PNG, WebP) are allowed', 400), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
    files: 5 // Maximum 5 files
  },
  fileFilter: fileFilter
});

// Memory storage for processing
const memoryStorage = multer.memoryStorage();

const uploadMemory = multer({
  storage: memoryStorage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024,
    files: 5
  },
  fileFilter: fileFilter
});

// Image processing middleware
const processImage = async (req, res, next) => {
  try {
    if (!req.files && !req.file) {
      return next();
    }
    
    const files = req.files || [req.file];
    const processedFiles = [];
    
    for (const file of files) {
      if (!file) continue;
      
      // Get image metadata
      const metadata = await sharp(file.path || file.buffer).metadata();
      
      // Validate image dimensions
      if (file.fieldname === 'model') {
        if (metadata.width < 512 || metadata.height < 512) {
          throw new AppError('Model image must be at least 512x512 pixels', 400);
        }
      } else if (file.fieldname === 'cloth' || file.fieldname === 'clothes') {
        if (metadata.width < 256 || metadata.height < 256) {
          throw new AppError('Cloth image must be at least 256x256 pixels', 400);
        }
      }
      
      // Add metadata to file object
      file.metadata = {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        size: metadata.size,
        hasAlpha: metadata.hasAlpha,
        channels: metadata.channels
      };
      
      processedFiles.push(file);
    }
    
    // Update req.files with processed files
    if (req.files) {
      req.files = processedFiles;
    } else {
      req.file = processedFiles[0];
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

// Resize image middleware
const resizeImage = (options = {}) => {
  return async (req, res, next) => {
    try {
      if (!req.files && !req.file) {
        return next();
      }
      
      const files = req.files || [req.file];
      
      for (const file of files) {
        if (!file || !file.path) continue;
        
        const { width, height, quality = 90 } = options;
        
        // Create resized version if dimensions specified
        if (width || height) {
          const resizedPath = file.path.replace(
            path.extname(file.path),
            `_resized${path.extname(file.path)}`
          );
          
          await sharp(file.path)
            .resize(width, height, {
              fit: 'inside',
              withoutEnlargement: true
            })
            .jpeg({ quality })
            .toFile(resizedPath);
          
          // Update file path to resized version
          file.resizedPath = resizedPath;
        }
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};

// Clean up uploaded files on error
const cleanupFiles = (req, res, next) => {
  const originalSend = res.send;
  
  res.send = function(data) {
    // Clean up files if response is an error
    if (res.statusCode >= 400) {
      const files = req.files || (req.file ? [req.file] : []);
      
      files.forEach(file => {
        if (file && file.path && fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
        if (file && file.resizedPath && fs.existsSync(file.resizedPath)) {
          fs.unlinkSync(file.resizedPath);
        }
      });
    }
    
    originalSend.call(this, data);
  };
  
  next();
};

// Validate file requirements
const validateFiles = (requirements) => {
  return (req, res, next) => {
    try {
      const { required = [], optional = [], maxFiles = 5 } = requirements;
      
      if (!req.files && !req.file) {
        if (required.length > 0) {
          throw new AppError(`Required files missing: ${required.join(', ')}`, 400);
        }
        return next();
      }
      
      const files = req.files || { [req.file.fieldname]: [req.file] };
      const fileFields = Object.keys(files);
      
      // Check required files
      for (const field of required) {
        if (!files[field] || files[field].length === 0) {
          throw new AppError(`Required file '${field}' is missing`, 400);
        }
      }
      
      // Check for unexpected files
      const allowedFields = [...required, ...optional];
      for (const field of fileFields) {
        if (!allowedFields.includes(field)) {
          throw new AppError(`Unexpected file field '${field}'`, 400);
        }
      }
      
      // Check total file count
      const totalFiles = Object.values(files).reduce((sum, arr) => sum + arr.length, 0);
      if (totalFiles > maxFiles) {
        throw new AppError(`Too many files. Maximum ${maxFiles} files allowed`, 400);
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};

// Upload configurations for different endpoints
const uploadConfigs = {
  // Single model image
  singleModel: upload.single('model'),
  
  // Single cloth image
  singleCloth: upload.single('cloth'),
  
  // Multiple cloth images (for combo mode)
  multipleClothes: upload.array('clothes', 2),
  
  // Model + cloth(es) for try-on
  tryOnFiles: upload.fields([
    { name: 'model', maxCount: 1 },
    { name: 'clothes', maxCount: 2 }
  ]),
  
  // Memory storage versions
  singleModelMemory: uploadMemory.single('model'),
  singleClothMemory: uploadMemory.single('cloth'),
  multipleClothesMemory: uploadMemory.array('clothes', 2)
};

module.exports = {
  upload,
  uploadMemory,
  uploadConfigs,
  processImage,
  resizeImage,
  cleanupFiles,
  validateFiles,
  ensureUploadDir,
  // Aliases for route compatibility
  uploadModels: upload,
  uploadClothes: upload,
  validateImageUpload: validateFiles,
  processImages: processImage
};