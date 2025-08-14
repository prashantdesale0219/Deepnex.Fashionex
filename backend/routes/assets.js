const express = require('express');
const {
  getUserAssets,
  getAssetById,
  updateAssetMetadata,
  deleteAsset,
  downloadAsset,
  getAssetStats,
  bulkDeleteAssets,
  restoreAsset,
  getDeletedAssets
} = require('../controllers/assetController');
const { protect, rateLimitAuth } = require('../middleware/auth');
const {
  validate,
  schemas
} = require('../middleware/validation');

const router = express.Router();

// All routes are protected
router.use(protect);
router.use(rateLimitAuth);

// @desc    Get user's assets
// @route   GET /api/assets
// @access  Private
router.get('/',
  validate(schemas.pagination.concat(schemas.assetFilters)),
  getUserAssets
);

// @desc    Get asset statistics
// @route   GET /api/assets/stats
// @access  Private
router.get('/stats', getAssetStats);

// @desc    Get deleted assets
// @route   GET /api/assets/deleted
// @access  Private
router.get('/deleted',
  validate(schemas.pagination),
  getDeletedAssets
);

// @desc    Bulk delete assets
// @route   DELETE /api/assets/bulk
// @access  Private
router.delete('/bulk', bulkDeleteAssets);

// @desc    Get asset by ID
// @route   GET /api/assets/:id
// @access  Private
router.get('/:id', getAssetById);

// @desc    Update asset metadata
// @route   PUT /api/assets/:id
// @access  Private
router.put('/:id',
  validate(schemas.assetMetadata),
  updateAssetMetadata
);

// @desc    Delete asset
// @route   DELETE /api/assets/:id
// @access  Private
router.delete('/:id', deleteAsset);

// @desc    Download asset
// @route   GET /api/assets/:id/download
// @access  Private
router.get('/:id/download', downloadAsset);

// @desc    Restore deleted asset
// @route   POST /api/assets/:id/restore
// @access  Private
router.post('/:id/restore', restoreAsset);

module.exports = router;