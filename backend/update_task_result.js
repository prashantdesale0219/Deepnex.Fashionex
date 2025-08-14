const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const TryOnTask = require('./models/TryOnTask');

async function updateTaskResult() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Find the specific task
    const taskId = '689983ab7100a316c6893bf8';
    const task = await TryOnTask.findById(taskId);
    
    if (!task) {
      console.log('❌ Task not found');
      process.exit(1);
    }
    
    console.log('📋 Current task result:', JSON.stringify(task.result, null, 2));
    
    // Update the task with resultImageUrl
    const updateResult = await TryOnTask.findByIdAndUpdate(
      taskId,
      {
        $set: {
          'result.resultImageUrl': '/uploads/results/demo-result.jpg',
          'result.processingTime': 5.2,
          'result.qualityScore': 85
        }
      },
      { new: true }
    );
    
    console.log('✅ Task updated successfully');
    console.log('📋 Updated task result:', JSON.stringify(updateResult.result, null, 2));
    
  } catch (error) {
    console.error('❌ Error updating task:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

updateTaskResult();