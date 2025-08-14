const Asset = require('../models/Asset');
const { asyncHandler, AppError } = require('../middleware/errorHandler');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// @desc    Get user's assets
// @route   GET /api/assets
// @access  Private
const getUserAssets = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const {
    page = 1,
    limit = 20,
    type,
    clothType,
    isValid,
    dateFrom,
    dateTo,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;
  
  const skip = (page - 1) * limit;
  
  // Build query
  const query = {
    userId,
    isDeleted: false
  };
  
  if (type) query.type = type;
  if (clothType) query['meta.clothType'] = clothType;
  if (isValid !== undefined) query['validation.isValid'] = isValid === 'true';
  
  if (dateFrom || dateTo) {
    query.createdAt = {};
    if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
    if (dateTo) query.createdAt.$lte = new Date(dateTo);
  }
  
  if (search) {
    query.$or = [
      { originalName: { $regex: search, $options: 'i' } },
      { 'meta.tags': { $regex: search, $options: 'i' } },
      { 'meta.brand': { $regex: search, $options: 'i' } },
      { 'meta.category': { $regex: search, $options: 'i' } }
    ];
  }
  
  // Build sort
  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
  
  // Get assets with pagination
  const [assets, total] = await Promise.all([
    Asset.find(query)
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
        fileUrl: asset.fileUrl,
        fileSize: asset.fileSize,
        fileSizeFormatted: asset.fileSizeFormatted,
        mimeType: asset.mimeType,
        meta: asset.meta,
        validation: asset.validation,
        downloadCount: asset.downloadCount,
        isPublic: asset.isPublic,
        createdAt: asset.createdAt,
        updatedAt: asset.updatedAt
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

// @desc    Get asset by ID
// @route   GET /api/assets/:id
// @access  Private
const getAssetById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  
  const asset = await Asset.findOne({
    _id: id,
    userId,
    isDeleted: false
  });
  
  if (!asset) {
    throw new AppError('Asset not found', 404);
  }
  
  res.status(200).json({
    success: true,
    data: {
      asset: {
        id: asset._id,
        type: asset.type,
        fileName: asset.fileName,
        originalName: asset.originalName,
        fileUrl: asset.fileUrl,
        fileSize: asset.fileSize,
        fileSizeFormatted: asset.fileSizeFormatted,
        mimeType: asset.mimeType,
        meta: asset.meta,
        validation: asset.validation,
        downloadCount: asset.downloadCount,
        isPublic: asset.isPublic,
        storage: asset.storage,
        createdAt: asset.createdAt,
        updatedAt: asset.updatedAt
      }
    }
  });
});

// @desc    Update asset metadata
// @route   PUT /api/assets/:id
// @access  Private
const updateAssetMetadata = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const {
    originalName,
    tags,
    brand,
    category,
    season,
    price,
    sku,
    isPublic
  } = req.body;
  
  const asset = await Asset.findOne({
    _id: id,
    userId,
    isDeleted: false
  });
  
  if (!asset) {
    throw new AppError('Asset not found', 404);
  }
  
  // Update fields
  if (originalName) asset.originalName = originalName;
  if (tags) asset.meta.tags = tags;
  if (brand) asset.meta.brand = brand;
  if (category) asset.meta.category = category;
  if (season) asset.meta.season = season;
  if (price !== undefined) asset.meta.price = price;
  if (sku) asset.meta.sku = sku;
  if (isPublic !== undefined) asset.isPublic = isPublic;
  
  await asset.save();
  
  res.status(200).json({
    success: true,
    message: 'Asset metadata updated successfully',
    data: {
      asset: {
        id: asset._id,
        originalName: asset.originalName,
        meta: asset.meta,
        isPublic: asset.isPublic,
        updatedAt: asset.updatedAt
      }
    }
  });
});

// @desc    Delete asset
// @route   DELETE /api/assets/:id
// @access  Private
const deleteAsset = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { permanent = false } = req.query;
  
  const asset = await Asset.findOne({
    _id: id,
    userId,
    isDeleted: false
  });
  
  if (!asset) {
    throw new AppError('Asset not found', 404);
  }
  
  // Soft delete
  await asset.softDelete();
  
  // If permanent delete requested, also delete physical file
  if (permanent === 'true') {
    const filePath = path.join(
      process.env.UPLOAD_PATH || './uploads',
      asset.type === 'model' ? 'models' : 
      asset.type === 'cloth' ? 'clothes' : 'results',
      asset.fileName
    );
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
  
  res.status(200).json({
    success: true,
    message: 'Asset deleted successfully'
  });
});

// @desc    Download asset
// @route   GET /api/assets/:id/download
// @access  Private
const downloadAsset = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  
  const asset = await Asset.findOne({
    _id: id,
    userId,
    isDeleted: false
  });
  
  if (!asset) {
    throw new AppError('Asset not found', 404);
  }
  
  const filePath = path.join(
    process.env.UPLOAD_PATH || './uploads',
    asset.type === 'model' ? 'models' : 
    asset.type === 'cloth' ? 'clothes' : 'results',
    asset.fileName
  );
  
  if (!fs.existsSync(filePath)) {
    throw new AppError('File not found on server', 404);
  }
  
  // Increment download count
  await asset.incrementDownloadCount();
  
  // Set headers for download
  res.setHeader('Content-Disposition', `attachment; filename="${asset.originalName}"`);
  res.setHeader('Content-Type', asset.mimeType);
  
  // Stream file
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
});

// @desc    Get asset statistics
// @route   GET /api/assets/stats
// @access  Private
const getAssetStats = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  
  const stats = await Asset.aggregate([
    {
      $match: {
        userId: userId,
        isDeleted: false
      }
    },
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
        totalSize: { $sum: '$fileSize' },
        validCount: {
          $sum: {
            $cond: ['$validation.isValid', 1, 0]
          }
        },
        invalidCount: {
          $sum: {
            $cond: ['$validation.isValid', 0, 1]
          }
        }
      }
    }
  ]);
  
  // Get recent assets
  const recentAssets = await Asset.find({
    userId,
    isDeleted: false
  })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('type originalName fileUrl createdAt validation')
    .lean();
  
  // Format stats
  const formattedStats = {
    total: 0,
    totalSize: 0,
    byType: {
      model: { count: 0, totalSize: 0, validCount: 0, invalidCount: 0 },
      cloth: { count: 0, totalSize: 0, validCount: 0, invalidCount: 0 },
      result: { count: 0, totalSize: 0, validCount: 0, invalidCount: 0 }
    }
  };
  
  stats.forEach(stat => {
    formattedStats.total += stat.count;
    formattedStats.totalSize += stat.totalSize;
    formattedStats.byType[stat._id] = {
      count: stat.count,
      totalSize: stat.totalSize,
      validCount: stat.validCount,
      invalidCount: stat.invalidCount
    };
  });
  
  res.status(200).json({
    success: true,
    data: {
      stats: formattedStats,
      recentAssets: recentAssets.map(asset => ({
        id: asset._id,
        type: asset.type,
        originalName: asset.originalName,
        fileUrl: asset.fileUrl,
        isValid: asset.validation.isValid,
        createdAt: asset.createdAt
      }))
    }
  });
});

// @desc    Bulk delete assets
// @route   DELETE /api/assets/bulk
// @access  Private
const bulkDeleteAssets = asyncHandler(async (req, res) => {
  const { assetIds, permanent = false } = req.body;
  const userId = req.user.id;
  
  if (!assetIds || !Array.isArray(assetIds) || assetIds.length === 0) {
    throw new AppError('Asset IDs are required', 400);
  }
  
  const assets = await Asset.find({
    _id: { $in: assetIds },
    userId,
    isDeleted: false
  });
  
  if (assets.length === 0) {
    throw new AppError('No assets found to delete', 404);
  }
  
  // Soft delete all assets
  await Asset.updateMany(
    {
      _id: { $in: assets.map(a => a._id) },
      userId
    },
    {
      isDeleted: true,
      deletedAt: new Date()
    }
  );
  
  // If permanent delete requested, delete physical files
  if (permanent) {
    for (const asset of assets) {
      const filePath = path.join(
        process.env.UPLOAD_PATH || './uploads',
        asset.type === 'model' ? 'models' : 
        asset.type === 'cloth' ? 'clothes' : 'results',
        asset.fileName
      );
      
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (error) {
          console.error(`Failed to delete file ${filePath}:`, error);
        }
      }
    }
  }
  
  res.status(200).json({
    success: true,
    message: `${assets.length} assets deleted successfully`,
    data: {
      deletedCount: assets.length
    }
  });
});

// @desc    Restore deleted asset
// @route   POST /api/assets/:id/restore
// @access  Private
const restoreAsset = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  
  const asset = await Asset.findOne({
    _id: id,
    userId,
    isDeleted: true
  });
  
  if (!asset) {
    throw new AppError('Deleted asset not found', 404);
  }
  
  // Check if physical file still exists
  const filePath = path.join(
    process.env.UPLOAD_PATH || './uploads',
    asset.type === 'model' ? 'models' : 
    asset.type === 'cloth' ? 'clothes' : 'results',
    asset.fileName
  );
  
  if (!fs.existsSync(filePath)) {
    throw new AppError('Physical file no longer exists, cannot restore', 400);
  }
  
  // Restore asset
  await asset.restore();
  
  res.status(200).json({
    success: true,
    message: 'Asset restored successfully',
    data: {
      asset: {
        id: asset._id,
        type: asset.type,
        originalName: asset.originalName,
        fileUrl: asset.fileUrl
      }
    }
  });
});

// @desc    Get deleted assets
// @route   GET /api/assets/deleted
// @access  Private
const getDeletedAssets = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;
  
  const [assets, total] = await Promise.all([
    Asset.find({
      userId,
      isDeleted: true
    })
      .sort({ deletedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    Asset.countDocuments({
      userId,
      isDeleted: true
    })
  ]);
  
  res.status(200).json({
    success: true,
    data: {
      assets: assets.map(asset => ({
        id: asset._id,
        type: asset.type,
        originalName: asset.originalName,
        fileSize: asset.fileSize,
        deletedAt: asset.deletedAt,
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

module.exports = {
  getUserAssets,
  getAssetById,
  updateAssetMetadata,
  deleteAsset,
  downloadAsset,
  getAssetStats,
  bulkDeleteAssets,
  restoreAsset,
  getDeletedAssets
};