const Joi = require('joi');
const { validationError } = require('./errorHandler');

// Validation middleware factory
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true
    });
    
    if (error) {
      const errorMessage = error.details
        .map(detail => detail.message)
        .join(', ');
      return next(validationError(errorMessage, 400));
    }
    
    // Replace the property with validated and sanitized value
    req[property] = value;
    next();
  };
};

// Common validation schemas
const schemas = {
  // User registration
  userRegistration: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      }),
    password: Joi.string()
      .min(6)
      .max(128)
      .required()
      .messages({
        'string.min': 'Password must be at least 6 characters long',
        'string.max': 'Password cannot exceed 128 characters',
        'any.required': 'Password is required'
      }),
    firstName: Joi.string()
      .trim()
      .min(1)
      .max(50)
      .required()
      .messages({
        'string.min': 'First name is required',
        'string.max': 'First name cannot exceed 50 characters',
        'any.required': 'First name is required'
      }),
    lastName: Joi.string()
      .trim()
      .min(1)
      .max(50)
      .required()
      .messages({
        'string.min': 'Last name is required',
        'string.max': 'Last name cannot exceed 50 characters',
        'any.required': 'Last name is required'
      })
  }),
  
  // User login with OTP
  userLogin: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      }),
    password: Joi.string()
      .required()
      .messages({
        'any.required': 'Password is required'
      }),
    otp: Joi.string()
      .length(6)
      .pattern(/^[0-9]+$/)
      .required()
      .messages({
        'string.length': 'OTP must be 6 digits',
        'string.pattern.base': 'OTP must contain only numbers',
        'any.required': 'OTP is required'
      })
  }),
  
  // Request OTP
  requestOTP: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      })
  }),
  
  // Resend OTP
  resendOTP: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      }),
    forLogin: Joi.boolean().default(false)
  }),
  
  // Verify email with OTP
  verifyEmailOTP: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      }),
    otp: Joi.string()
      .length(6)
      .pattern(/^[0-9]+$/)
      .required()
      .messages({
        'string.length': 'OTP must be 6 digits',
        'string.pattern.base': 'OTP must contain only numbers',
        'any.required': 'OTP is required'
      })
  }),
  
  // Password change
  passwordChange: Joi.object({
    currentPassword: Joi.string()
      .required()
      .messages({
        'any.required': 'Current password is required'
      }),
    newPassword: Joi.string()
      .min(6)
      .max(128)
      .required()
      .messages({
        'string.min': 'New password must be at least 6 characters long',
        'string.max': 'New password cannot exceed 128 characters',
        'any.required': 'New password is required'
      })
  }),
  
  // Profile update
  profileUpdate: Joi.object({
    firstName: Joi.string()
      .trim()
      .min(1)
      .max(50)
      .optional(),
    lastName: Joi.string()
      .trim()
      .min(1)
      .max(50)
      .optional(),
    preferences: Joi.object({
      notifications: Joi.boolean().optional(),
      theme: Joi.string().valid('light', 'dark').optional()
    }).optional()
  }),
  
  // Try-on request
  tryOnRequest: Joi.object({
    mode: Joi.string()
      .valid('single', 'combo')
      .default('single')
      .messages({
        'any.only': 'Mode must be either "single" or "combo"'
      }),
    clothType: Joi.string()
      .valid('upper', 'lower', 'full_set', 'combo')
      .required()
      .messages({
        'any.only': 'Cloth type must be one of: upper, lower, full_set, combo',
        'any.required': 'Cloth type is required'
      }),
    hdMode: Joi.boolean()
      .default(false),
    modelAssetId: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.pattern.base': 'Invalid model asset ID format',
        'any.required': 'Model asset ID is required'
      }),
    clothAssetIds: Joi.array()
      .items(
        Joi.string()
          .pattern(/^[0-9a-fA-F]{24}$/)
          .messages({
            'string.pattern.base': 'Invalid cloth asset ID format'
          })
      )
      .min(1)
      .max(2)
      .required()
      .messages({
        'array.min': 'At least one cloth asset ID is required',
        'array.max': 'Maximum 2 cloth asset IDs allowed',
        'any.required': 'Cloth asset IDs are required'
      })
  }),
  
  // Asset metadata
  assetMetadata: Joi.object({
    sku: Joi.string()
      .trim()
      .max(100)
      .optional(),
    tags: Joi.array()
      .items(Joi.string().trim().max(50))
      .max(10)
      .optional(),
    brand: Joi.string()
      .trim()
      .max(100)
      .optional(),
    category: Joi.string()
      .trim()
      .max(100)
      .optional(),
    season: Joi.string()
      .valid('spring', 'summer', 'autumn', 'winter', 'all-season')
      .optional(),
    price: Joi.number()
      .min(0)
      .optional(),
    currency: Joi.string()
      .length(3)
      .uppercase()
      .default('USD')
      .optional()
  }),
  
  // Pagination
  pagination: Joi.object({
    page: Joi.number()
      .integer()
      .min(1)
      .default(1)
      .optional(),
    limit: Joi.number()
      .integer()
      .min(1)
      .max(100)
      .default(20)
      .optional(),
    sort: Joi.string()
      .valid('createdAt', '-createdAt', 'updatedAt', '-updatedAt', 'fileName', '-fileName')
      .default('-createdAt')
      .optional()
  }),
  
  // Asset filters
  assetFilters: Joi.object({
    type: Joi.string()
      .valid('model', 'cloth', 'result')
      .optional(),
    clothType: Joi.string()
      .valid('upper', 'lower', 'full_set', 'combo')
      .optional(),
    sku: Joi.string()
      .trim()
      .optional(),
    brand: Joi.string()
      .trim()
      .optional(),
    category: Joi.string()
      .trim()
      .optional(),
    dateFrom: Joi.date()
      .optional(),
    dateTo: Joi.date()
      .optional()
  }),
  
  // MongoDB ObjectId
  objectId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.pattern.base': 'Invalid ID format'
    }),
  
  // Task status update
  taskStatusUpdate: Joi.object({
    status: Joi.string()
      .valid('CREATED', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED')
      .required(),
    progress: Joi.number()
      .min(0)
      .max(100)
      .optional(),
    resultData: Joi.object({
      downloadSignedUrl: Joi.string().uri().optional(),
      resultImageUrl: Joi.string().uri().optional(),
      processingTime: Joi.number().min(0).optional(),
      qualityScore: Joi.number().min(0).max(100).optional()
    }).optional(),
    errorDetails: Joi.object({
      code: Joi.string().optional(),
      message: Joi.string().optional(),
      details: Joi.any().optional()
    }).optional()
  })
};

// Specific validation middleware functions
const validateRegistration = validate(schemas.userRegistration);
const validateLogin = validate(schemas.userLogin);
const validatePasswordChange = validate(schemas.passwordChange);
const validateProfileUpdate = validate(schemas.profileUpdate);
const validateTryOnRequest = validate(schemas.tryOnRequest);
const validateAssetMetadata = validate(schemas.assetMetadata);
const validatePagination = validate(schemas.pagination, 'query');
const validateAssetFilters = validate(schemas.assetFilters, 'query');
const validateObjectId = (field = 'id') => validate(schemas.objectId, 'params');
const validateTaskStatusUpdate = validate(schemas.taskStatusUpdate);

// Custom validation functions
const validateFileUpload = (req, res, next) => {
  if (!req.file && !req.files) {
    return next(validationError('No file uploaded', 400));
  }
  
  const files = req.files || [req.file];
  
  for (const file of files) {
    if (!file) continue;
    
    // Validate file size
    const maxSize = parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return next(validationError(`File size exceeds ${maxSize / (1024 * 1024)}MB limit`, 400));
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      return next(validationError('Only JPEG, PNG, and WebP images are allowed', 400));
    }
  }
  
  next();
};

const validateDateRange = (req, res, next) => {
  const { dateFrom, dateTo } = req.query;
  
  if (dateFrom && dateTo) {
    const from = new Date(dateFrom);
    const to = new Date(dateTo);
    
    if (from > to) {
      return next(validationError('dateFrom cannot be later than dateTo', 400));
    }
    
    // Limit date range to 1 year
    const oneYear = 365 * 24 * 60 * 60 * 1000;
    if (to - from > oneYear) {
      return next(validationError('Date range cannot exceed 1 year', 400));
    }
  }
  
  next();
};

module.exports = {
  validate,
  schemas,
  validateRegistration,
  validateLogin,
  validateRequestOTP: validate(schemas.requestOTP),
  validateResendOTP: validate(schemas.resendOTP),
  validateVerifyEmailOTP: validate(schemas.verifyEmailOTP),
  validatePasswordChange,
  validateProfileUpdate,
  validateTryOnRequest,
  validateAssetMetadata,
  validatePagination,
  validateAssetFilters,
  validateObjectId,
  validateTaskStatusUpdate,
  validateFileUpload,
  validateDateRange
};