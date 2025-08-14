const mongoose = require('mongoose');
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/fashionx-deepnex-31')
  .then(() => console.log('Connected to MongoDB fashionx-deepnex-31'))
  .catch(err => console.error('MongoDB connection error:', err));

async function debugUser() {
  try {
    const targetUserId = '6894b50c57a427dac104d79d';
    console.log('Looking for user ID:', targetUserId);
    
    // Try different ways to find the user
    const user1 = await User.findById(targetUserId);
    console.log('findById result:', user1 ? 'Found' : 'Not found');
    
    const user2 = await User.findOne({ _id: targetUserId });
    console.log('findOne with _id result:', user2 ? 'Found' : 'Not found');
    
    const user3 = await User.findOne({ _id: new mongoose.Types.ObjectId(targetUserId) });
    console.log('findOne with ObjectId result:', user3 ? 'Found' : 'Not found');
    
    // List all users
    const allUsers = await User.find({});
    console.log('\nAll users in database:');
    allUsers.forEach(user => {
      console.log(`- ID: ${user._id} (${typeof user._id}), Email: ${user.email}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

debugUser();