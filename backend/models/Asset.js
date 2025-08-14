const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  type: {
    type: String,
    enum: ['model', 'cloth', 'result'],
    required: [true, 'Asset type is required']
  },
  fileName: {
    type: String,
    required: [true, 'File name is required'],
    trim: true
  },
  originalName: {
    type: String,
    required: [true, 'Original file name is required'],
    trim: true
  },
  fileUrl: {
    type: String,
    required: [true, 'File URL is required']
  },
  fileSize: {
    type: Number,
    required: [true, 'File size is required']
  },
  mimeType: {
    type: String,
    required: [true, 'MIME type is required']
  },
  meta: {
    clothType: {
      type: String,
      enum: ['upper', 'lower', 'full_set', 'combo'],
      required: function() {
        return this.type === 'cloth' || this.type === 'result';
      }
    },
    sku: {
      type: String,
      trim: true
    },
    width: {
      type: Number,
      required: [true, 'Image width is required']
    },
    height: {
      type: Number,
      required: [true, 'Image height is required']
    },
    aspectRatio: {
      type: Number
    },
    colorPalette: [{
      color: String,
      percentage: Number
    }],
    tags: [{
      type: String,
      trim: true
    }],
    brand: {
      type: String,
      trim: true
    },
    category: {
      type: String,
      trim: true
    },
    season: {
      type: String,
      enum: ['spring', 'summer', 'autumn', 'winter', 'all-season']
    },
    price: {
      type: Number,
      min: 0
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  validation: {
    isValid: {
      type: Boolean,
      default: false
    },
    validationScore: {
      type: Number,
      min: 0,
      max: 100
    },
    warnings: [{
      type: {
        type: String
      },
      message: {
        type: String
      },
      severity: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
      }
    }],
    validatedAt: {
      type: Date
    }
  },
  storage: {
    provider: {
      type: String,
      enum: ['local', 's3', 'cloudinary', 'gridfs'],
      default: 'local'
    },
    bucket: {
      type: String
    },
    key: {
      type: String
    },
    region: {
      type: String
    }
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;
      if (ret.isDeleted) {
        delete ret.fileUrl;
      }
      return ret;
    }
  }
});

// Indexes for better query performance
assetSchema.index({ userId: 1, type: 1 });
assetSchema.index({ userId: 1, createdAt: -1 });
assetSchema.index({ type: 1, 'meta.clothType': 1 });
assetSchema.index({ 'meta.sku': 1 });
assetSchema.index({ isDeleted: 1 });
assetSchema.index({ createdAt: -1 });

// Pre-save middleware to calculate aspect ratio
assetSchema.pre('save', function(next) {
  if (this.meta && this.meta.width && this.meta.height) {
    this.meta.aspectRatio = this.meta.width / this.meta.height;
  }
  next();
});

// Method to soft delete
assetSchema.methods.softDelete = function() {
  this.isDeleted = true;
  this.deletedAt = new Date();
  return this.save();
};

// Method to restore
assetSchema.methods.restore = function() {
  this.isDeleted = false;
  this.deletedAt = undefined;
  return this.save();
};

// Method to increment download count
assetSchema.methods.incrementDownload = function() {
  this.downloadCount += 1;
  this.lastAccessed = new Date();
  return this.save();
};

// Static method to find by user and type
assetSchema.statics.findByUserAndType = function(userId, type) {
  return this.find({ 
    userId, 
    type, 
    isDeleted: false 
  }).sort({ createdAt: -1 });
};

// Static method to find recent assets
assetSchema.statics.findRecent = function(limit = 10) {
  return this.find({ isDeleted: false })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('userId', 'firstName lastName email');
};

// Virtual for file size in human readable format
assetSchema.virtual('fileSizeFormatted').get(function() {
  const bytes = this.fileSize;
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
});

module.exports = mongoose.model('Asset', assetSchema);