const TryOnTask = require('../models/TryOnTask');
const fitroomService = require('./fitroomService');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const Asset = require('../models/Asset');

class TaskPollingService {
  constructor() {
    this.isRunning = false;
    this.pollInterval = null;
    this.pollIntervalMs = 5000; // 5 seconds
  }

  start() {
    if (this.isRunning) {
      console.log('⚠️  Task polling service is already running');
      return;
    }

    console.log('🚀 Starting task polling service...');
    this.isRunning = true;
    
    // Start immediate check
    this.checkPendingTasks();
    
    // Set up interval
    this.pollInterval = setInterval(() => {
      this.checkPendingTasks();
    }, this.pollIntervalMs);

    console.log(`✅ Task polling service started (checking every ${this.pollIntervalMs/1000}s)`);
  }

  stop() {
    if (!this.isRunning) {
      console.log('⚠️  Task polling service is not running');
      return;
    }

    console.log('🛑 Stopping task polling service...');
    this.isRunning = false;
    
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }

    console.log('✅ Task polling service stopped');
  }

  async checkPendingTasks() {
    try {
      // Find all tasks that are still in CREATED or PROCESSING status
      const pendingTasks = await TryOnTask.find({
        status: { $in: ['CREATED', 'PROCESSING'] },
        isDeleted: false
      });

      if (pendingTasks.length === 0) {
        return;
      }

      console.log(`🔄 Checking ${pendingTasks.length} pending tasks...`);

      for (const task of pendingTasks) {
        try {
          // Check status with FitRoom API
          const statusResult = await fitroomService.getTaskStatus(task.taskId);

          if (statusResult.success) {
            console.log(`   Task ${task.taskId}: ${statusResult.status}, Progress: ${statusResult.progress}%`);

            // Update task status
            await task.updateProgress(
              statusResult.progress,
              statusResult.status
            );

            // If completed, process the result
            if (statusResult.isCompleted && statusResult.downloadUrl) {
              console.log(`   ✅ Task ${task.taskId} completed! Processing result...`);
              await this.processCompletedTask(task, statusResult);
              console.log(`   💾 Result processed and saved for task ${task.taskId}`);
            }

            // If failed, update error details
            if (statusResult.isFailed) {
              console.log(`   ❌ Task ${task.taskId} failed`);
              await task.markFailed({
                code: 'FITROOM_PROCESSING_FAILED',
                message: 'FitRoom processing failed',
                details: statusResult.data
              });
            }
          } else {
            console.log(`   ⚠️  Error checking status for task ${task.taskId}: ${statusResult.error}`);
          }
        } catch (error) {
          console.log(`   💥 Error processing task ${task.taskId}:`, error.message);
        }
      }
    } catch (error) {
      console.error('💥 Error in task polling service:', error);
    }
  }

  // Helper function to process completed task
  async processCompletedTask(task, statusResult) {
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

  getStatus() {
    return {
      isRunning: this.isRunning,
      pollIntervalMs: this.pollIntervalMs
    };
  }
}

// Create singleton instance
const taskPollingService = new TaskPollingService();

module.exports = taskPollingService;