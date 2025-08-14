const mongoose = require('mongoose');
const TryOnTask = require('./models/TryOnTask');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/fashionx-deepnex-31')
  .then(() => console.log('Connected to MongoDB fashionx-deepnex-31'))
  .catch(err => console.error('MongoDB connection error:', err));

async function debugTasks() {
  try {
    const tasks = await TryOnTask.find({});
    console.log('\nAvailable tasks:');
    tasks.forEach(task => {
      console.log(`- ID: ${task._id}, Status: ${task.status}, User: ${task.userId}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

debugTasks();