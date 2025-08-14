const User = require('../models/User');
const Asset = require('../models/Asset');
const TryOnTask = require('../models/TryOnTask');
const { asyncHandler, AppError } = require('../middleware/errorHandler');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  const { period = '30d' } = req.query;
  
  // Calculate date range
  const now = new Date();
  let startDate;
  
  switch (period) {
    case '7d':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case '90d':
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }
  
  // Get user statistics
  const [totalUsers, activeUsers, newUsers] = await Promise.all([
    User.countDocuments({ isActive: true }),
    User.countDocuments({ 
      isActive: true, 
      lastLogin: { $gte: startDate } 
    }),
    User.countDocuments({ 
      isActive: true,
      createdAt: { $gte: startDate } 
    })
  ]);
  
  // Get asset statistics
  const [totalAssets, newAssets, assetsByType] = await Promise.all([
    Asset.countDocuments({ isDeleted: false }),
    Asset.countDocuments({ 
      isDeleted: false,
      createdAt: { $gte: startDate } 
    }),
    Asset.aggregate([
      {
        $match: {
          isDeleted: false,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalSize: { $sum: '$fileSize' }
        }
      }
    ])
  ]);
  
  // Get try-on task statistics
  const [totalTasks, completedTasks, failedTasks, tasksByStatus] = await Promise.all([
    TryOnTask.countDocuments({ 
      isDeleted: false,
      createdAt: { $gte: startDate } 
    }),
    TryOnTask.countDocuments({ 
      isDeleted: false,
      status: 'COMPLETED',
      createdAt: { $gte: startDate } 
    }),
    TryOnTask.countDocuments({ 
      isDeleted: false,
      status: 'FAILED',
      createdAt: { $gte: startDate } 
    }),
    TryOnTask.aggregate([
      {
        $match: {
          isDeleted: false,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ])
  ]);
  
  // Get API usage statistics
  const apiUsageStats = await User.aggregate([
    {
      $match: {
        isActive: true,
        'apiUsage.totalRequests': { $gt: 0 }
      }
    },
    {
      $group: {
        _id: null,
        totalRequests: { $sum: '$apiUsage.totalRequests' },
        totalUsers: { $sum: 1 },
        avgRequestsPerUser: { $avg: '$apiUsage.totalRequests' }
      }
    }
  ]);
  
  // Get daily activity for charts
  const dailyActivity = await TryOnTask.aggregate([
    {
      $match: {
        isDeleted: false,
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: '$createdAt'
          }
        },
        tasks: { $sum: 1 },
        completed: {
          $sum: {
            $cond: [{ $eq: ['$status', 'COMPLETED'] }, 1, 0]
          }
        },
        failed: {
          $sum: {
            $cond: [{ $eq: ['$status', 'FAILED'] }, 1, 0]
          }
        }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);
  
  res.status(200).json({
    success: true,
    data: {
      period,
      users: {
        total: totalUsers,
        active: activeUsers,
        new: newUsers,
        activeRate: totalUsers > 0 ? (activeUsers / totalUsers * 100).toFixed(2) : 0
      },
      assets: {
        total: totalAssets,
        new: newAssets,
        byType: assetsByType.reduce((acc, item) => {
          acc[item._id] = {
            count: item.count,
            totalSize: item.totalSize
          };
          return acc;
        }, {})
      },
      tasks: {
        total: totalTasks,
        completed: completedTasks,
        failed: failedTasks,
        successRate: totalTasks > 0 ? (completedTasks / totalTasks * 100).toFixed(2) : 0,
        byStatus: tasksByStatus.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      },
      apiUsage: apiUsageStats[0] || {
        totalRequests: 0,
        totalUsers: 0,
        avgRequestsPerUser: 0
      },
      dailyActivity
    }
  });
});

// @desc    Get all users with pagination
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    search,
    role,
    isActive,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;
  
  const skip = (page - 1) * limit;
  
  // Build query
  const query = {};
  
  if (search) {
    query.$or = [
      { email: { $regex: search, $options: 'i' } },
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } }
    ];
  }
  
  if (role) query.role = role;
  if (isActive !== undefined) query.isActive = isActive === 'true';
  
  // Build sort
  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
  
  // Get users with pagination
  const [users, total] = await Promise.all([
    User.find(query)
      .select('-password')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    User.countDocuments(query)
  ]);
  
  res.status(200).json({
    success: true,
    data: {
      users: users.map(user => ({
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: `${user.firstName} ${user.lastName}`,
        role: user.role,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        apiUsage: user.apiUsage,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    }
  });
});

// @desc    Get user details
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUserDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const user = await User.findById(id).select('-password');
  
  if (!user) {
    throw new AppError('User not found', 404);
  }
  
  // Get user's assets count
  const assetsCount = await Asset.countDocuments({
    userId: id,
    isDeleted: false
  });
  
  // Get user's tasks count
  const tasksCount = await TryOnTask.countDocuments({
    userId: id,
    isDeleted: false
  });
  
  // Get recent activity
  const recentTasks = await TryOnTask.find({
    userId: id,
    isDeleted: false
  })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('taskId status mode clothType createdAt')
    .lean();
  
  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        profileImage: user.profileImage,
        preferences: user.preferences,
        apiUsage: user.apiUsage,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      stats: {
        assetsCount,
        tasksCount
      },
      recentActivity: recentTasks
    }
  });
});

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    firstName,
    lastName,
    role,
    isActive,
    preferences
  } = req.body;
  
  const user = await User.findById(id);
  
  if (!user) {
    throw new AppError('User not found', 404);
  }
  
  // Update fields
  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (role) user.role = role;
  if (isActive !== undefined) user.isActive = isActive;
  if (preferences) user.preferences = { ...user.preferences, ...preferences };
  
  await user.save();
  
  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isActive: user.isActive,
        preferences: user.preferences,
        updatedAt: user.updatedAt
      }
    }
  });
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { permanent = false } = req.query;
  
  const user = await User.findById(id);
  
  if (!user) {
    throw new AppError('User not found', 404);
  }
  
  if (user.role === 'admin') {
    throw new AppError('Cannot delete admin user', 403);
  }
  
  if (permanent === 'true') {
    // Permanent delete - remove user and all associated data
    await Promise.all([
      Asset.deleteMany({ userId: id }),
      TryOnTask.deleteMany({ userId: id }),
      User.findByIdAndDelete(id)
    ]);
    
    // Delete user's uploaded files
    const userUploadsPath = path.join(
      process.env.UPLOAD_PATH || './uploads',
      'users',
      id
    );
    
    if (fs.existsSync(userUploadsPath)) {
      fs.rmSync(userUploadsPath, { recursive: true, force: true });
    }
  } else {
    // Soft delete - deactivate user
    user.isActive = false;
    await user.save();
  }
  
  res.status(200).json({
    success: true,
    message: permanent === 'true' ? 'User permanently deleted' : 'User deactivated'
  });
});

// @desc    Get all assets (admin view)
// @route   GET /api/admin/assets
// @access  Private/Admin
const getAllAssets = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    type,
    userId,
    isValid,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;
  
  const skip = (page - 1) * limit;
  
  // Build query
  const query = { isDeleted: false };
  
  if (type) query.type = type;
  if (userId) query.userId = userId;
  if (isValid !== undefined) query['validation.isValid'] = isValid === 'true';
  
  // Build sort
  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
  
  // Get assets with pagination
  const [assets, total] = await Promise.all([
    Asset.find(query)
      .populate('userId', 'firstName lastName email')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    Asset.countDocuments(query)
  ]);
  
  res.status(200).json({
    success: true,
    data: {
      assets: assets.map(asset => ({
        id: asset._id,
        type: asset.type,
        fileName: asset.fileName,
        originalName: asset.originalName,
        fileSize: asset.fileSize,
        mimeType: asset.mimeType,
        validation: asset.validation,
        user: asset.userId,
        createdAt: asset.createdAt
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    }
  });
});

// @desc    Get all try-on tasks (admin view)
// @route   GET /api/admin/tasks
// @access  Private/Admin
const getAllTasks = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    status,
    userId,
    mode,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;
  
  const skip = (page - 1) * limit;
  
  // Build query
  const query = { isDeleted: false };
  
  if (status) query.status = status;
  if (userId) query.userId = userId;
  if (mode) query.mode = mode;
  
  // Build sort
  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
  
  // Get tasks with pagination
  const [tasks, total] = await Promise.all([
    TryOnTask.find(query)
      .populate('userId', 'firstName lastName email')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    TryOnTask.countDocuments(query)
  ]);
  
  res.status(200).json({
    success: true,
    data: {
      tasks: tasks.map(task => ({
        id: task._id,
        taskId: task.taskId,
        status: task.status,
        progress: task.progress,
        mode: task.mode,
        clothType: task.clothType,
        user: task.userId,
        timing: task.timing,
        createdAt: task.createdAt
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    }
  });
});

// @desc    Create admin user
// @route   POST /api/admin/create-admin
// @access  Private/Admin
const createAdminUser = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('User with this email already exists', 400);
  }
  
  // Create admin user
  const adminUser = await User.create({
    email,
    password,
    firstName,
    lastName,
    role: 'admin',
    isActive: true
  });
  
  res.status(201).json({
    success: true,
    message: 'Admin user created successfully',
    data: {
      user: {
        id: adminUser._id,
        email: adminUser.email,
        firstName: adminUser.firstName,
        lastName: adminUser.lastName,
        role: adminUser.role
      }
    }
  });
});

// @desc    Get system health
// @route   GET /api/admin/health
// @access  Private/Admin
const getSystemHealth = asyncHandler(async (req, res) => {
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();
  
  // Check database connection
  const mongoose = require('mongoose');
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  // Check disk space (simplified)
  const uploadsPath = process.env.UPLOAD_PATH || './uploads';
  let diskSpace = null;
  
  try {
    const stats = fs.statSync(uploadsPath);
    diskSpace = {
      path: uploadsPath,
      exists: true
    };
  } catch (error) {
    diskSpace = {
      path: uploadsPath,
      exists: false,
      error: error.message
    };
  }
  
  res.status(200).json({
    success: true,
    data: {
      status: 'healthy',
      uptime: {
        seconds: uptime,
        formatted: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`
      },
      memory: {
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
        external: `${Math.round(memoryUsage.external / 1024 / 1024)} MB`
      },
      database: {
        status: dbStatus,
        name: mongoose.connection.name
      },
      storage: diskSpace,
      environment: process.env.NODE_ENV || 'development',
      nodeVersion: process.version,
      timestamp: new Date().toISOString()
    }
  });
});

module.exports = {
  getDashboardStats,
  getAllUsers,
  getUserDetails,
  updateUser,
  deleteUser,
  getAllAssets,
  getAllTasks,
  createAdminUser,
  getSystemHealth
};