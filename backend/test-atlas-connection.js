const mongoose = require('mongoose');
require('dotenv').config();

// Atlas connection string
const ATLAS_URI = 'mongodb+srv://prashantdesale259:jDMqLOlRZJhOztx8@cluster0.fobyotd.mongodb.net/deepnex-fashionX-31?retryWrites=true&w=majority&appName=Cluster0';

async function testAtlasConnection() {
  console.log('🔍 Testing MongoDB Atlas Connection...');
  console.log('📍 Atlas URI:', ATLAS_URI.replace(/:\/\/([^:]+):([^@]+)@/, '://***:***@'));
  
  try {
    // Test with different timeout configurations
    const options = {
      serverSelectionTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 20000, // 20 seconds
      connectTimeoutMS: 10000, // 10 seconds
      maxPoolSize: 5,
      minPoolSize: 1,
      retryWrites: true,
      w: 'majority'
    };
    
    console.log('⏳ Attempting connection with options:', JSON.stringify(options, null, 2));
    
    const conn = await mongoose.connect(ATLAS_URI, options);
    
    console.log('✅ Atlas Connection Successful!');
    console.log('🏠 Connected to host:', conn.connection.host);
    console.log('🗄️  Database name:', conn.connection.name);
    console.log('📊 Connection state:', conn.connection.readyState);
    
    // Test a simple query
    console.log('\n🧪 Testing database query...');
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('📋 Available collections:', collections.map(c => c.name));
    
    // Test creating a simple document
    console.log('\n📝 Testing write operation...');
    const testCollection = conn.connection.db.collection('connection_test');
    const result = await testCollection.insertOne({
      test: true,
      timestamp: new Date(),
      message: 'Atlas connection test successful'
    });
    console.log('✅ Write test successful, inserted ID:', result.insertedId);
    
    // Clean up test document
    await testCollection.deleteOne({ _id: result.insertedId });
    console.log('🧹 Test document cleaned up');
    
    await mongoose.connection.close();
    console.log('\n🎉 Atlas connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ Atlas Connection Failed!');
    console.error('🔍 Error type:', error.constructor.name);
    console.error('💬 Error message:', error.message);
    
    if (error.code) {
      console.error('🔢 Error code:', error.code);
    }
    
    if (error.codeName) {
      console.error('📛 Error code name:', error.codeName);
    }
    
    // Specific error analysis
    if (error.message.includes('IP')) {
      console.log('\n🔧 IP Whitelist Issue Detected:');
      console.log('1. Go to MongoDB Atlas → Network Access');
      console.log('2. Add 0.0.0.0/0 (allow all IPs) for development');
      console.log('3. Wait 2-3 minutes for changes to propagate');
    }
    
    if (error.message.includes('authentication')) {
      console.log('\n🔧 Authentication Issue Detected:');
      console.log('1. Check username and password in connection string');
      console.log('2. Ensure user has proper database permissions');
      console.log('3. Check if user exists in Atlas dashboard');
    }
    
    if (error.message.includes('timeout') || error.message.includes('ENOTFOUND')) {
      console.log('\n🔧 Network/DNS Issue Detected:');
      console.log('1. Check internet connection');
      console.log('2. Try different network/disable VPN');
      console.log('3. Check if cluster is running (not paused)');
    }
    
    console.log('\n📋 Full error details:');
    console.error(error);
  }
}

// Run the test
testAtlasConnection().then(() => {
  process.exit(0);
}).catch((error) => {
  console.error('💥 Unexpected error:', error);
  process.exit(1);
});