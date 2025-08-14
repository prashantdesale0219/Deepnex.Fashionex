const mongoose = require('mongoose');
const TryOnTask = require('../models/TryOnTask');
const Asset = require('../models/Asset');
const User = require('../models/User');
const fitroomService = require('../services/fitroomService');
const { asyncHandler, AppError } = require('../middleware/errorHandler');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// @desc    Create new try-on task
// @route   POST /api/tryon
// @access  Private
const createTryOnTask = asyncHandler(async (req, res) => {
  const {
    modelAssetId,
    clothAssetIds,
    clothType,
    mode = 'single',
    hdMode = false
  } = req.body;
  
  const userId = req.user.id;
  
  // Validate model asset
  const modelAsset = await Asset.findOne({
    _id: modelAssetId,
    userId,
    type: 'model',
    isDeleted: false
  });
  
  if (!modelAsset) {
    throw new AppError('Model image not found', 404);
  }
  
  if (!modelAsset.validation.isValid) {
    throw new AppError('Model image is not valid for try-on', 400);
  }
  
  // Validate cloth assets
  const clothAssets = await Asset.find({
    _id: { $in: clothAssetIds },
    userId,
    type: 'cloth',
    isDeleted: false
  });
  
  if (clothAssets.length !== clothAssetIds.length) {
    throw new AppError('One or more cloth images not found', 404);
  }
  
  // Validate cloth assets
  for (const clothAsset of clothAssets) {
    if (!clothAsset.validation.isValid) {
      throw new AppError(`Cloth image ${clothAsset.originalName} is not valid for try-on`, 400);
    }
  }
  
  // Validate mode and cloth type combination
  if (mode === 'combo' && clothAssets.length !== 2) {
    throw new AppError('Combo mode requires exactly 2 cloth images', 400);
  }
  
  if (mode === 'single' && clothAssets.length !== 1) {
    throw new AppError('Single mode requires exactly 1 cloth image', 400);
  }
  
  try {
    // Get file paths
    const modelImagePath = path.join(
      process.env.UPLOAD_PATH || './uploads',
      'models',
      modelAsset.fileName
    );
    
    const clothImagePaths = clothAssets.map(asset => 
      path.join(
        process.env.UPLOAD_PATH || './uploads',
        'clothes',
        asset.fileName
      )
    );
    
    // Verify files exist
    if (!fs.existsSync(modelImagePath)) {
      throw new AppError('Model image file not found', 404);
    }
    
    for (const clothPath of clothImagePaths) {
      if (!fs.existsSync(clothPath)) {
        throw new AppError('Cloth image file not found', 404);
      }
    }
    
    // Create try-on task with FitRoom API
    const fitroomResult = await fitroomService.createTryOnTask({
      modelImagePath,
      clothImagePaths,
      clothType,
      hdMode,
      mode
    });
    
    if (!fitroomResult.success) {
      throw new AppError(`FitRoom API error: ${fitroomResult.error}`, 500);
    }
    
    // Create task record in database
    const tryOnTask = await TryOnTask.create({
      taskId: fitroomResult.taskId,
      userId,
      mode,
      clothType,
      status: 'CREATED',
      hdMode,
      inputs: {
        modelAssetId,
        clothAssetIds,
        modelImageUrl: modelAsset.fileUrl,
        clothImageUrls: clothAssets.map(asset => asset.fileUrl)
      },
      fitroomResponse: {
        originalResponse: fitroomResult.data
      },
      metadata: {
        userAgent: req.get('User-Agent'),
        ipAddress: req.ip,
        requestSource: 'web'
      }
    });
    
    // Update user API usage
    await User.findByIdAndUpdate(userId, {
      $inc: {
        'apiUsage.totalRequests': 1,
        'apiUsage.monthlyRequests': 1
      }
    });
    
    res.status(201).json({
      success: true,
      message: 'Try-on task created successfully',
      data: {
        task: {
          id: tryOnTask._id,
          taskId: tryOnTask.taskId,
          status: tryOnTask.status,
          progress: tryOnTask.progress,
          mode: tryOnTask.mode,
          clothType: tryOnTask.clothType,
          hdMode: tryOnTask.hdMode,
          createdAt: tryOnTask.createdAt
        }
      }
    });
    
  } catch (error) {
    console.error('Try-on task creation error:', error);
    throw error;
  }
});

// @desc    Get try-on task status
// @route   GET /api/tryon/:id
// @access  Private
const getTryOnTaskStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  
  const task = await TryOnTask.findOne({
    _id: id,
    userId,
    isDeleted: false
  }).populate('inputs.modelAssetId inputs.clothAssetIds result.resultAssetId');
  
  if (!task) {
    throw new AppError('Try-on task not found', 404);
  }
  
  // If task is not completed, check status with FitRoom API
  if (task.status === 'CREATED' || task.status === 'PROCESSING') {
    const statusResult = await fitroomService.getTaskStatus(task.taskId);
    
    if (statusResult.success) {
      // Update task status
      await task.updateProgress(
        statusResult.progress,
        statusResult.status
      );
      
      // If completed, process the result
      if (statusResult.isCompleted && statusResult.downloadUrl) {
        await processCompletedTask(task, statusResult);
      }
      
      // If failed, update error details
      if (statusResult.isFailed) {
        await task.markFailed({
          code: 'FITROOM_PROCESSING_FAILED',
          message: 'FitRoom processing failed',
          details: statusResult.data
        });
      }
    }
  }
  
  // Refresh task data
  await task.populate('result.resultAssetId');
  
  res.status(200).json({
    success: true,
    data: {
      task: {
        id: task._id,
        taskId: task.taskId,
        status: task.status,
        statusDisplay: task.statusDisplay,
        progress: task.progress,
        mode: task.mode,
        clothType: task.clothType,
        hdMode: task.hdMode,
        inputs: {
          modelAsset: task.inputs.modelAssetId,
          clothAssets: task.inputs.clothAssetIds
        },
        result: task.result.resultAssetId ? {
          asset: task.result.resultAssetId,
          processingTime: task.result.processingTime,
          qualityScore: task.result.qualityScore
        } : null,
        timing: task.timing,
        totalProcessingTime: task.totalProcessingTime,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt
      }
    }
  });
});

// @desc    Get user's try-on tasks
// @route   GET /api/tryon/list
// @access  Private
const getUserTryOnTasks = asyncHandler(async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user.id);
  const { 
    page = 1, 
    limit = 20, 
    status,
    clothType,
    mode,
    dateFrom,
    dateTo
  } = req.query;
  
  const skip = (page - 1) * limit;
  
  // Build query
  const query = {
    userId,
    isDeleted: false
  };
  
  if (status) query.status = status;
  if (clothType) query.clothType = clothType;
  if (mode) query.mode = mode;
  
  if (dateFrom || dateTo) {
    query.createdAt = {};
    if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
    if (dateTo) query.createdAt.$lte = new Date(dateTo);
  }
  
  // Get tasks with pagination
  const [tasks, total] = await Promise.all([
    TryOnTask.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('inputs.modelAssetId inputs.clothAssetIds result.resultAssetId')
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
        hdMode: task.hdMode,
        inputs: {
          modelAsset: task.inputs.modelAssetId,
          clothAssets: task.inputs.clothAssetIds
        },
        result: task.result || null,
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

// @desc    Cancel try-on task
// @route   DELETE /api/tryon/:id/cancel
// @access  Private
const cancelTryOnTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  
  const task = await TryOnTask.findOne({
    _id: id,
    userId,
    isDeleted: false
  });
  
  if (!task) {
    throw new AppError('Try-on task not found', 404);
  }
  
  if (task.status === 'COMPLETED' || task.status === 'FAILED') {
    throw new AppError('Cannot cancel completed or failed task', 400);
  }
  
  // Update task status
  task.status = 'CANCELLED';
  await task.save();
  
  res.status(200).json({
    success: true,
    message: 'Try-on task cancelled successfully'
  });
});

// @desc    Delete try-on task
// @route   DELETE /api/tryon/:id
// @access  Private
const deleteTryOnTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  
  const task = await TryOnTask.findOne({
    _id: id,
    userId,
    isDeleted: false
  });
  
  if (!task) {
    throw new AppError('Try-on task not found', 404);
  }
  
  // Soft delete task
  await task.softDelete();
  
  // Optionally soft delete result asset
  if (task.result.resultAssetId) {
    const resultAsset = await Asset.findById(task.result.resultAssetId);
    if (resultAsset) {
      await resultAsset.softDelete();
    }
  }
  
  res.status(200).json({
    success: true,
    message: 'Try-on task deleted successfully'
  });
});

// @desc    Retry failed try-on task
// @route   POST /api/tryon/:id/retry
// @access  Private
const retryTryOnTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  
  const task = await TryOnTask.findOne({
    _id: id,
    userId,
    isDeleted: false
  }).populate('inputs.modelAssetId inputs.clothAssetIds');
  
  if (!task) {
    throw new AppError('Try-on task not found', 404);
  }
  
  if (task.status !== 'FAILED') {
    throw new AppError('Only failed tasks can be retried', 400);
  }
  
  // Check retry limit
  if (task.metadata.retryCount >= 3) {
    throw new AppError('Maximum retry attempts exceeded', 400);
  }
  
  try {
    // Get file paths
    const modelImagePath = path.join(
      process.env.UPLOAD_PATH || './uploads',
      'models',
      task.inputs.modelAssetId.fileName
    );
    
    const clothImagePaths = task.inputs.clothAssetIds.map(asset => 
      path.join(
        process.env.UPLOAD_PATH || './uploads',
        'clothes',
        asset.fileName
      )
    );
    
    // Create new try-on task with FitRoom API
    const fitroomResult = await fitroomService.createTryOnTask({
      modelImagePath,
      clothImagePaths,
      clothType: task.clothType,
      hdMode: task.hdMode,
      mode: task.mode
    });
    
    if (!fitroomResult.success) {
      throw new AppError(`FitRoom API error: ${fitroomResult.error}`, 500);
    }
    
    // Update task with new FitRoom task ID
    task.taskId = fitroomResult.taskId;
    task.status = 'CREATED';
    task.progress = 0;
    task.metadata.retryCount += 1;
    task.timing.submittedAt = new Date();
    task.timing.startedAt = null;
    task.timing.completedAt = null;
    task.fitroomResponse.originalResponse = fitroomResult.data;
    task.fitroomResponse.errorDetails = null;
    
    await task.save();
    
    res.status(200).json({
      success: true,
      message: 'Try-on task retry initiated successfully',
      data: {
        task: {
          id: task._id,
          taskId: task.taskId,
          status: task.status,
          progress: task.progress,
          retryCount: task.metadata.retryCount
        }
      }
    });
    
  } catch (error) {
    console.error('Try-on task retry error:', error);
    throw error;
  }
});

// Helper function to process completed task
const processCompletedTask = async (task, statusResult) => {
  try {
    // Download result image
    const imageBuffer = await fitroomService.downloadResultImage(statusResult.downloadUrl);
    
    // Generate filename
    const timestamp = Date.now();
    const fileName = `result-${task.taskId}-${timestamp}.jpg`;
    const filePath = path.join(
      process.env.UPLOAD_PATH || './uploads',
      'results',
      fileName
    );
    
    // Ensure results directory exists
    const resultsDir = path.dirname(filePath);
    if (!fs.existsSync(resultsDir)) {
      fs.mkdirSync(resultsDir, { recursive: true });
    }
    
    // Process and save image
    const processedImage = await sharp(imageBuffer)
      .jpeg({ quality: 90 })
      .toBuffer();
    
    fs.writeFileSync(filePath, processedImage);
    
    // Get image metadata
    const metadata = await sharp(processedImage).metadata();
    
    // Create result asset
    const resultAsset = await Asset.create({
      userId: task.userId,
      type: 'result',
      fileName,
      originalName: `${task.mode}-tryon-result.jpg`,
      fileUrl: `/uploads/results/${fileName}`,
      fileSize: processedImage.length,
      mimeType: 'image/jpeg',
      meta: {
        clothType: task.clothType,
        width: metadata.width,
        height: metadata.height,
        aspectRatio: metadata.width / metadata.height
      },
      storage: {
        provider: 'local',
        key: fileName
      }
    });
    
    // Update task with result
    await task.markCompleted({
      resultAssetId: resultAsset._id,
      downloadSignedUrl: statusResult.downloadUrl,
      resultImageUrl: resultAsset.fileUrl,
      qualityScore: statusResult.data?.quality_score || null
    });
    
  } catch (error) {
    console.error('Error processing completed task:', error);
    await task.markFailed({
      code: 'RESULT_PROCESSING_FAILED',
      message: 'Failed to process result image',
      details: error.message
    });
  }
};

// @desc    Download try-on result
// @route   GET /api/tryon/:id/download
// @access  Private
const downloadTryOnResult = asyncHandler(async (req, res) => {
  console.log('🔽 Download request received');
  console.log('📋 Request params:', req.params);
  console.log('📋 Request URL:', req.url);
  console.log('📋 Request method:', req.method);
  
  const { id } = req.params;
  const userId = req.user.id;
  
  console.log('🔽 Download request for task:', id, 'by user:', userId);
  
  const task = await TryOnTask.findOne({
    _id: id,
    userId
  }).populate('result.resultAssetId');
  
  console.log('📋 Task found:', !!task);
  if (task) {
    console.log('📊 Task status:', task.status);
    console.log('🎯 Task result:', !!task.result);
    console.log('🖼️ Result asset ID:', !!task.result?.resultAssetId);
  }
  
  if (!task) {
    throw new AppError('Try-on task not found', 404);
  }
  
  if (task.status !== 'COMPLETED') {
    throw new AppError('Try-on task is not completed yet', 400);
  }
  
  // Check for result asset or result image URL
  let filePath, fileName, mimeType, fileSize;
  
  if (task.result?.resultAssetId) {
    // Use result asset if available
    const resultAsset = task.result.resultAssetId;
    console.log('📁 Result asset:', {
      id: resultAsset._id,
      fileName: resultAsset.fileName,
      fileUrl: resultAsset.fileUrl,
      mimeType: resultAsset.mimeType,
      fileSize: resultAsset.fileSize
    });
    
    filePath = path.join(
      process.env.UPLOAD_PATH || './uploads',
      'results',
      resultAsset.fileName
    );
    fileName = resultAsset.originalName || `try-on-result-${task.taskId}.jpg`;
    mimeType = resultAsset.mimeType || 'image/jpeg';
    fileSize = resultAsset.fileSize;
    
  } else if (task.result?.resultImageUrl) {
    // Use result image URL as fallback
    console.log('📁 Using result image URL:', task.result.resultImageUrl);
    
    // Extract filename from URL (e.g., /uploads/results/demo-result.jpg)
    const urlPath = task.result.resultImageUrl.replace(/^\//, ''); // Remove leading slash
    filePath = path.join(process.env.UPLOAD_PATH || './uploads', urlPath.replace(/\//g, path.sep));
    fileName = `try-on-result-${task.taskId}.jpg`;
    mimeType = 'image/jpeg';
    
    // Get file size if file exists
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      fileSize = stats.size;
    }
    
  } else {
    console.log('❌ No result asset or image URL found. Task result:', JSON.stringify(task.result, null, 2));
    throw new AppError('Result image not available', 404);
  }
  
  console.log('📂 File path:', filePath);
  console.log('📄 File exists:', fs.existsSync(filePath));
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    throw new AppError('Result file not found on server', 404);
  }
  
  try {
    // Set appropriate headers for download
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    if (fileSize) {
      res.setHeader('Content-Length', fileSize);
    }
    
    console.log('✅ Headers set, starting file stream...');
    
    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
    
    fileStream.on('error', (error) => {
      console.error('❌ Error streaming file:', error);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          error: 'Error downloading file'
        });
      }
    });
    
    fileStream.on('end', () => {
      console.log('✅ File download completed successfully');
    });
    
  } catch (error) {
    console.error('❌ Download error:', error);
    throw error;
  }
});

module.exports = {
  createTryOnTask,
  getTryOnTaskStatus,
  getUserTryOnTasks,
  cancelTryOnTask,
  deleteTryOnTask,
  retryTryOnTask,
  downloadTryOnResult
};