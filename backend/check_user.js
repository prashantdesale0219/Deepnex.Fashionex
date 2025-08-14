const mongoose = require('mongoose');
const User = require('./models/User');
const TryOnTask = require('./models/TryOnTask');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/FashionX')
  .then(() => console.log('Connected to MongoDB FashionX'))
  .catch(err => console.error('MongoDB connection error:', err));

async function checkData() {
  try {
    // Check users
    const users = await User.find({});
    console.log('Total users:', users.length);
    
    if (users.length > 0) {
      console.log('Users found:');
      users.forEach(user => {
        console.log(`- ID: ${user._id}, Email: ${user.email}`);
      });
    }
    
    // Check tasks
    const tasks = await TryOnTask.find({});
    console.log('\nTotal tasks:', tasks.length);
    
    if (tasks.length > 0) {
      console.log('Tasks found:');
      tasks.forEach(task => {
        console.log(`- ID: ${task._id}, Status: ${task.status}, User: ${task.userId}`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkData();