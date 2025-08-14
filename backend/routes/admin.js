const express = require('express');
const {
  getDashboardStats,
  getAllUsers,
  getUserDetails,
  updateUser,
  deleteUser,
  getAllAssets,
  getAllTasks,
  createAdminUser,
  getSystemHealth
} = require('../controllers/adminController');
const { protect, restrictTo } = require('../middleware/auth');
const {
  validate,
  validateRegistration,
  schemas
} = require('../middleware/validation');

const router = express.Router();

// All routes are protected and restricted to admin
router.use(protect);
router.use(restrictTo('admin'));

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
router.get('/dashboard', getDashboardStats);

// @desc    Get system health
// @route   GET /api/admin/health
// @access  Private/Admin
router.get('/health', getSystemHealth);

// User management routes
// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
router.get('/users',
  validate(schemas.pagination),
  getAllUsers
);

// @desc    Create admin user
// @route   POST /api/admin/users/create-admin
// @access  Private/Admin
router.post('/users/create-admin',
  validateRegistration,
  createAdminUser
);

// @desc    Get user details
// @route   GET /api/admin/users/:id
// @access  Private/Admin
router.get('/users/:id', getUserDetails);

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
router.put('/users/:id', updateUser);

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
router.delete('/users/:id', deleteUser);

// Asset management routes
// @desc    Get all assets
// @route   GET /api/admin/assets
// @access  Private/Admin
router.get('/assets',
  validate(schemas.pagination),
  getAllAssets
);

// Task management routes
// @desc    Get all try-on tasks
// @route   GET /api/admin/tasks
// @access  Private/Admin
router.get('/tasks',
  validate(schemas.pagination),
  getAllTasks
);

module.exports = router;