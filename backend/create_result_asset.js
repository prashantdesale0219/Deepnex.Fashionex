const mongoose = require('mongoose');
const Asset = require('./models/Asset');
const TryOnTask = require('./models/TryOnTask');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/fashionx-deepnex-31')
  .then(() => console.log('Connected to MongoDB fashionx-deepnex-31'))
  .catch(err => console.error('MongoDB connection error:', err));

async function createResultAsset() {
  try {
    const taskId = '689983ab7100a316c6893bf8';
    const userId = '689850cf02b7dc1625ef5e51';
    
    // Create result asset
    const resultAsset = new Asset({
      userId: userId,
      type: 'result',
      fileName: 'demo-result.jpg',
      originalName: 'demo-result.jpg',
      fileUrl: '/uploads/results/demo-result.jpg',
      fileSize: 1024,
      mimeType: 'image/jpeg',
      meta: {
        clothType: 'upper',
        width: 400,
        height: 600
      }
    });
    
    await resultAsset.save();
    console.log('✅ Result asset created:', resultAsset._id);
    
    // Update task with result asset
    const task = await TryOnTask.findById(taskId);
    if (task) {
      task.result.resultAssetId = resultAsset._id;
      await task.save();
      console.log('✅ Task updated with result asset ID');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createResultAsset();