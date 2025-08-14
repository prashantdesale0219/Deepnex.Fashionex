const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const TryOnTask = require('./models/TryOnTask');

async function fixTaskUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Find the specific task
    const taskId = '689983ab7100a316c6893bf8';
    const correctUserId = '689850cf02b7dc1625ef5e51'; // From JWT token
    
    const task = await TryOnTask.findById(taskId);
    
    if (!task) {
      console.log('❌ Task not found');
      process.exit(1);
    }
    
    console.log('📋 Current task user ID:', task.userId);
    console.log('📋 Correct user ID:', correctUserId);
    
    // Update the task with correct user ID
    const updateResult = await TryOnTask.findByIdAndUpdate(
      taskId,
      {
        $set: {
          userId: new mongoose.Types.ObjectId(correctUserId)
        }
      },
      { new: true }
    );
    
    console.log('✅ Task user ID updated successfully');
    console.log('📋 Updated task user ID:', updateResult.userId);
    
  } catch (error) {
    console.error('❌ Error updating task user:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

fixTaskUser();