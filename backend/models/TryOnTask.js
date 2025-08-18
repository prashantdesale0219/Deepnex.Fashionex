const mongoose = require('mongoose');

const tryOnTaskSchema = new mongoose.Schema({
  taskId: {
    type: String,
    required: [true, 'FitRoom Task ID is required'],
    unique: true,
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  mode: {
    type: String,
    enum: ['single', 'combo'],
    required: [true, 'Mode is required'],
    default: 'single'
  },
  clothType: {
    type: String,
    enum: ['upper', 'lower', 'full_set', 'combo'],
    required: [true, 'Cloth type is required']
  },
  status: {
    type: String,
    enum: ['CREATED', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED'],
    default: 'CREATED'
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  hdMode: {
    type: Boolean,
    default: false
  },
  inputs: {
    modelAssetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Asset',
      required: [true, 'Model asset ID is required']
    },
    clothAssetIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Asset',
      required: true
    }],
    modelImageUrl: {
      type: String,
      required: [true, 'Model image URL is required']
    },
    clothImageUrls: [{
      type: String,
      required: true
    }]
  },
  result: {
    resultAssetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Asset'
    },
    downloadSignedUrl: {
      type: String
    },
    resultImageUrl: {
      type: String
    },
    processingTime: {
      type: Number // in seconds
    },
    qualityScore: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  fitroomResponse: {
    originalResponse: {
      type: mongoose.Schema.Types.Mixed
    },
    errorDetails: {
      code: String,
      message: String,
      details: mongoose.Schema.Types.Mixed
    },
    warnings: [{
      code: String,
      message: String,
      severity: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
      }
    }]
  },
  timing: {
    submittedAt: {
      type: Date,
      default: Date.now
    },
    startedAt: {
      type: Date
    },
    completedAt: {
      type: Date
    },
    lastPolledAt: {
      type: Date
    },
    pollCount: {
      type: Number,
      default: 0
    }
  },
  metadata: {
    userAgent: String,
    ipAddress: String,
    sessionId: String,
    requestSource: {
      type: String,
      enum: ['web', 'mobile', 'api'],
      default: 'web'
    },
    retryCount: {
      type: Number,
      default: 0
    },
    priority: {
      type: String,
      enum: ['low', 'normal', 'high'],
      default: 'normal'
    }
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes for better query performance
// Note: taskId is already unique, so no need for additional index
tryOnTaskSchema.index({ userId: 1, createdAt: -1 });
tryOnTaskSchema.index({ status: 1 });
tryOnTaskSchema.index({ userId: 1, status: 1 });
tryOnTaskSchema.index({ 'timing.submittedAt': -1 });
tryOnTaskSchema.index({ isDeleted: 1 });
// Compound index for common queries
tryOnTaskSchema.index({ userId: 1, isDeleted: 1, status: 1 });

// Pre-save middleware to update timing
tryOnTaskSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    const now = new Date();
    
    switch (this.status) {
      case 'PROCESSING':
        if (!this.timing.startedAt) {
          this.timing.startedAt = now;
        }
        break;
      case 'COMPLETED':
      case 'FAILED':
      case 'CANCELLED':
        if (!this.timing.completedAt) {
          this.timing.completedAt = now;
          
          // Calculate processing time
          if (this.timing.startedAt) {
            this.result.processingTime = Math.round(
              (now - this.timing.startedAt) / 1000
            );
          }
        }
        break;
    }
  }
  next();
});

// Method to update progress
tryOnTaskSchema.methods.updateProgress = function(progress, status) {
  this.progress = progress;
  if (status) {
    this.status = status;
  }
  this.timing.lastPolledAt = new Date();
  this.timing.pollCount += 1;
  return this.save();
};

// Method to mark as completed
tryOnTaskSchema.methods.markCompleted = function(resultData) {
  this.status = 'COMPLETED';
  this.progress = 100;
  if (resultData) {
    Object.assign(this.result, resultData);
  }
  return this.save();
};

// Method to mark as failed
tryOnTaskSchema.methods.markFailed = function(errorDetails) {
  this.status = 'FAILED';
  if (errorDetails) {
    this.fitroomResponse.errorDetails = errorDetails;
  }
  return this.save();
};

// Method to soft delete
tryOnTaskSchema.methods.softDelete = function() {
  this.isDeleted = true;
  this.deletedAt = new Date();
  return this.save();
};

// Static method to find active tasks
tryOnTaskSchema.statics.findActiveTasks = function() {
  return this.find({
    status: { $in: ['CREATED', 'PROCESSING'] },
    isDeleted: false
  });
};

// Static method to find user tasks
tryOnTaskSchema.statics.findUserTasks = function(userId, limit = 20) {
  return this.find({ 
    userId, 
    isDeleted: false 
  })
  .sort({ createdAt: -1 })
  .limit(limit)
  .populate('inputs.modelAssetId inputs.clothAssetIds result.resultAssetId');
};

// Static method to find tasks by status
tryOnTaskSchema.statics.findByStatus = function(status) {
  return this.find({ 
    status, 
    isDeleted: false 
  }).sort({ createdAt: -1 });
};

// Virtual for total processing time
tryOnTaskSchema.virtual('totalProcessingTime').get(function() {
  if (this.timing.completedAt && this.timing.submittedAt) {
    return Math.round((this.timing.completedAt - this.timing.submittedAt) / 1000);
  }
  return null;
});

// Virtual for status display
tryOnTaskSchema.virtual('statusDisplay').get(function() {
  const statusMap = {
    'CREATED': 'Created',
    'PROCESSING': 'Processing',
    'COMPLETED': 'Completed',
    'FAILED': 'Failed',
    'CANCELLED': 'Cancelled'
  };
  return statusMap[this.status] || this.status;
});

module.exports = mongoose.model('TryOnTask', tryOnTaskSchema);