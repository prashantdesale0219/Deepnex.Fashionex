const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');

function switchToAtlas() {
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
    
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Switched to MongoDB Atlas configuration');
    console.log('🔗 Now using: mongodb+srv://...@cluster0.fobyotd.mongodb.net');
    
  } catch (error) {
    console.error('❌ Error switching to Atlas:', error.message);
  }
}

function switchToLocalhost() {
  try {
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Comment out Atlas URI
    envContent = envContent.replace(
      /^MONGODB_URI=mongodb\+srv:/m,
      '# MONGODB_URI=mongodb+srv:'
    );
    
    // Uncomment localhost URI
    envContent = envContent.replace(
      /^# MONGODB_URI=mongodb:\/\/localhost/m,
      'MONGODB_URI=mongodb://localhost'
    );
    
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Switched to localhost MongoDB configuration');
    console.log('🏠 Now using: mongodb://localhost:27017/fashionx-local');
    
  } catch (error) {
    console.error('❌ Error switching to localhost:', error.message);
  }
}

function showCurrentConfig() {
  try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const mongoUriMatch = envContent.match(/^MONGODB_URI=(.+)$/m);
    
    if (mongoUriMatch) {
      const uri = mongoUriMatch[1];
      if (uri.includes('localhost')) {
        console.log('📍 Current: Localhost MongoDB');
        console.log('🔗 URI:', uri);
      } else if (uri.includes('mongodb+srv')) {
        console.log('📍 Current: MongoDB Atlas');
        console.log('🔗 URI:', uri.replace(/:\/\/([^:]+):([^@]+)@/, '://***:***@'));
      } else {
        console.log('📍 Current: Unknown configuration');
        console.log('🔗 URI:', uri);
      }
    } else {
      console.log('❌ No MONGODB_URI found in .env file');
    }
  } catch (error) {
    console.error('❌ Error reading .env file:', error.message);
  }
}

// Parse command line arguments
const command = process.argv[2];

switch (command) {
  case 'atlas':
    console.log('🔄 Switching to MongoDB Atlas...');
    switchToAtlas();
    break;
    
  case 'localhost':
  case 'local':
    console.log('🔄 Switching to localhost MongoDB...');
    switchToLocalhost();
    break;
    
  case 'status':
  case 'current':
    showCurrentConfig();
    break;
    
  default:
    console.log('🔧 Database Configuration Switcher');
    console.log('=' .repeat(40));
    console.log('');
    console.log('Usage:');
    console.log('  node switch-database.js atlas     - Switch to MongoDB Atlas');
    console.log('  node switch-database.js localhost - Switch to localhost MongoDB');
    console.log('  node switch-database.js status    - Show current configuration');
    console.log('');
    showCurrentConfig();
    break;
}