const mongoose = require('mongoose');
const path = require('path');
const TryOnTask = require('../models/TryOnTask');

// Load environment variables from parent directory
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Check if required environment variables are loaded
if (!process.env.FITROOM_API_KEY) {
  console.error('❌ FITROOM_API_KEY not found in environment variables');
  console.log('Available env vars:', Object.keys(process.env).filter(k => k.includes('FITROOM')));
  process.exit(1);
}

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Import FitroomService after env vars are loaded (it's a singleton instance)
const fitroomService = require('../services/fitroomService');

async function updatePendingTasks() {
  try {
    console.log('🔍 Finding pending tasks...');
    
    // Find all tasks that are still in CREATED or PROCESSING status
    const pendingTasks = await TryOnTask.find({
      status: { $in: ['CREATED', 'PROCESSING'] },
      isDeleted: false
    });
    
    console.log(`📋 Found ${pendingTasks.length} pending tasks`);
    
    for (const task of pendingTasks) {
      console.log(`\n🔄 Checking task: ${task.taskId}`);
      
      try {
        // Check status with FitRoom API
        const statusResult = await fitroomService.getTaskStatus(task.taskId);
        
        if (statusResult.success) {
          console.log(`   Status: ${statusResult.status}, Progress: ${statusResult.progress}%`);
          
          // Update task status
          await task.updateProgress(
            statusResult.progress,
            statusResult.status
          );
          
          // If completed, process the result
          if (statusResult.isCompleted && statusResult.downloadUrl) {
            console.log('   ✅ Task completed! Processing result...');
            await processCompletedTask(task, statusResult);
            console.log('   💾 Result processed and saved');
          }
          
          // If failed, update error details
          if (statusResult.isFailed) {
            console.log('   ❌ Task failed');
            await task.markFailed({
              code: 'FITROOM_PROCESSING_FAILED',
              message: 'FitRoom processing failed',
              details: statusResult.data
            });
          }
        } else {
          console.log(`   ⚠️  Error checking status: ${statusResult.error}`);
        }
      } catch (error) {
        console.log(`   💥 Error processing task ${task.taskId}:`, error.message);
      }
    }
    
    console.log('\n✨ Update complete!');
    process.exit(0);
  } catch (error) {
    console.error('💥 Script error:', error);
    process.exit(1);
  }
}

// Helper function to process completed task (copied from controller)
async function processCompletedTask(task, statusResult) {
  const path = require('path');
  const fs = require('fs');
  const sharp = require('sharp');
  const Asset = require('../models/Asset');
  
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
}

// Run the script
updatePendingTasks();