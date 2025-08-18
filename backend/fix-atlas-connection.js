const mongoose = require('mongoose');
require('dotenv').config();

// Current IP address
const CURRENT_IP = '89.39.107.193';

// Atlas connection string
const ATLAS_URI = 'mongodb+srv://prashantdesale259:jDMqLOlRZJhOztx8@cluster0.fobyotd.mongodb.net/deepnex-fashionX-31?retryWrites=true&w=majority&appName=Cluster0';

async function fixAtlasConnection() {
  console.log('🔧 MongoDB Atlas Connection Fix Tool');
  console.log('=' .repeat(50));
  
  console.log('\n📍 Current IP Address:', CURRENT_IP);
  console.log('🎯 Atlas Cluster: cluster0.fobyotd.mongodb.net');
  
  console.log('\n🚨 ISSUE DETECTED: IP Whitelist Problem');
  console.log('Your current IP address is not whitelisted in MongoDB Atlas.');
  
  console.log('\n✅ SOLUTION STEPS:');
  console.log('1. Go to MongoDB Atlas Dashboard: https://cloud.mongodb.com/');
  console.log('2. Select your project and cluster');
  console.log('3. Click "Network Access" in the left sidebar');
  console.log('4. Click "Add IP Address" button');
  console.log('5. Choose one of these options:');
  console.log('   📍 Option A: Add your specific IP:', CURRENT_IP);
  console.log('   🌍 Option B: Add 0.0.0.0/0 (allow all IPs - for development only)');
  console.log('6. Click "Confirm" and wait 2-3 minutes for changes to propagate');
  
  console.log('\n⚡ QUICK FIX FOR DEVELOPMENT:');
  console.log('Add this IP range in Atlas Network Access: 0.0.0.0/0');
  console.log('⚠️  WARNING: Only use 0.0.0.0/0 for development, not production!');
  
  console.log('\n🔄 Testing connection in 30 seconds...');
  
  // Wait for user to potentially fix the issue
  await new Promise(resolve => setTimeout(resolve, 30000));
  
  console.log('\n🧪 Testing Atlas connection...');
  
  try {
    const options = {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 30000,
      connectTimeoutMS: 15000,
      maxPoolSize: 5,
      minPoolSize: 1
    };
    
    const conn = await mongoose.connect(ATLAS_URI, options);
    
    console.log('\n🎉 SUCCESS! Atlas connection is now working!');
    console.log('✅ Connected to:', conn.connection.host);
    console.log('✅ Database:', conn.connection.name);
    
    // Test basic operations
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('✅ Collections accessible:', collections.length);
    
    await mongoose.connection.close();
    
    console.log('\n🔧 Now update your .env file:');
    console.log('Uncomment the Atlas URI and comment out localhost URI');
    
    return true;
    
  } catch (error) {
    console.log('\n❌ Connection still failing...');
    console.log('Error:', error.message);
    
    if (error.message.includes('IP')) {
      console.log('\n🔍 IP whitelist issue persists.');
      console.log('Please ensure you have added the IP address correctly.');
      console.log('Current IP to whitelist:', CURRENT_IP);
    }
    
    console.log('\n🆘 ALTERNATIVE SOLUTIONS:');
    console.log('1. Try a different network/internet connection');
    console.log('2. Disable VPN if you\'re using one');
    console.log('3. Check if your Atlas cluster is paused');
    console.log('4. Verify your Atlas credentials are correct');
    console.log('5. Create a new Atlas cluster if this one has issues');
    
    return false;
  }
}

// Create .env update script
function createEnvUpdateScript() {
  const fs = require('fs');
  const path = require('path');
  
  const envPath = path.join(__dirname, '.env');
  
  try {
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Comment out localhost URI
    envContent = envContent.replace(
      /^MONGODB_URI=mongodb:\/\/localhost/m,
      '# MONGODB_URI=mongodb://localhost'
    );
    
    // Uncomment Atlas URI
    envContent = envContent.replace(
      /^# MONGODB_URI=mongodb\+srv:/m,
      'MONGODB_URI=mongodb+srv:'
    );
    
    // Write updated content
    fs.writeFileSync(envPath + '.atlas', envContent);
    
    console.log('\n📝 Created .env.atlas file with Atlas configuration');
    console.log('To use Atlas: rename .env.atlas to .env');
    
  } catch (error) {
    console.log('\n⚠️  Could not create .env update:', error.message);
  }
}

// Run the fix
fixAtlasConnection().then((success) => {
  if (success) {
    createEnvUpdateScript();
    console.log('\n🎯 Atlas connection is ready!');
    console.log('You can now use Atlas in your application.');
  } else {
    console.log('\n🔄 Please fix the IP whitelist issue and try again.');
    console.log('Run this script again after adding your IP to Atlas.');
  }
  
  process.exit(success ? 0 : 1);
}).catch((error) => {
  console.error('💥 Unexpected error:', error);
  process.exit(1);
});