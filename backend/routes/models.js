const express = require('express');
const {
  uploadModelImage,
  checkModelImage,
  getUserModelImages,
  getModelImageById,
  deleteModelImage,
  revalidateModelImage
} = require('../controllers/modelController');
const { protect, rateLimitAuth } = require('../middleware/auth');
const {
  validate,
  schemas
} = require('../middleware/validation');
const {
  uploadModels,
  validateImageUpload,
  processImages
} = require('../middleware/upload');

const router = express.Router();

// All routes are protected
router.use(protect);
router.use(rateLimitAuth);

// @desc    Upload and validate model image
// @route   POST /api/models/upload
// @access  Private
router.post('/upload',
  uploadModels.single('model'),
  validateImageUpload({ required: ['model'], maxFiles: 1 }),
  processImages,
  uploadModelImage
);

// @desc    Check model image without saving
// @route   POST /api/models/check
// @access  Private
router.post('/check',
  uploadModels.single('model'),
  validateImageUpload({ required: ['model'], maxFiles: 1 }),
  checkModelImage
);

// @desc    Get user's model images
// @route   GET /api/models
// @access  Private
router.get('/',
  validate(schemas.pagination.keys(schemas.assetFilters.describe().keys), 'query'),
  getUserModelImages
);

// @desc    Get model image by ID
// @route   GET /api/models/:id
// @access  Private
router.get('/:id', getModelImageById);

// @desc    Re-validate model image
// @route   POST /api/models/:id/revalidate
// @access  Private
router.post('/:id/revalidate', revalidateModelImage);

// @desc    Delete model image
// @route   DELETE /api/models/:id
// @access  Private
router.delete('/:id', deleteModelImage);

module.exports = router;