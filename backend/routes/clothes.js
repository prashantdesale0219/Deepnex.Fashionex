const express = require('express');
const {
  uploadClothImage,
  uploadMultipleClothImages,
  checkClothImage,
  getUserClothImages,
  getClothImageById,
  updateClothMetadata,
  deleteClothImage,
  revalidateClothImage
} = require('../controllers/clothController');
const { protect, rateLimitAuth } = require('../middleware/auth');
const {
  validate,
  schemas
} = require('../middleware/validation');
const {
  uploadClothes,
  validateImageUpload,
  processImages
} = require('../middleware/upload');

const router = express.Router();

// All routes are protected
router.use(protect);
router.use(rateLimitAuth);

// @desc    Upload and validate single cloth image
// @route   POST /api/clothes/upload
// @access  Private
router.post('/upload',
  uploadClothes.single('cloth'),
  validateImageUpload({ required: ['cloth'], maxFiles: 1 }),
  processImages,
  uploadClothImage
);

// @desc    Upload and validate multiple cloth images
// @route   POST /api/clothes/upload-multiple
// @access  Private
router.post('/upload-multiple',
  uploadClothes.array('clothes', 10),
  validateImageUpload({ required: ['clothes'], maxFiles: 10 }),
  processImages,
  uploadMultipleClothImages
);

// @desc    Check cloth image without saving
// @route   POST /api/clothes/check
// @access  Private
router.post('/check',
  uploadClothes.single('cloth'),
  validateImageUpload({ required: ['cloth'], maxFiles: 1 }),
  checkClothImage
);

// @desc    Get user's cloth images
// @route   GET /api/clothes
// @access  Private
router.get('/',
  validate(schemas.pagination.keys(schemas.assetFilters.describe().keys), 'query'),
  getUserClothImages
);

// @desc    Get cloth image by ID
// @route   GET /api/clothes/:id
// @access  Private
router.get('/:id', getClothImageById);

// @desc    Update cloth metadata
// @route   PUT /api/clothes/:id
// @access  Private
router.put('/:id',
  validate(schemas.assetMetadata),
  updateClothMetadata
);

// @desc    Re-validate cloth image
// @route   POST /api/clothes/:id/revalidate
// @access  Private
router.post('/:id/revalidate', revalidateClothImage);

// @desc    Delete cloth image
// @route   DELETE /api/clothes/:id
// @access  Private
router.delete('/:id', deleteClothImage);

module.exports = router;