const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // MongoDB connection options for Atlas
    const options = {
      serverSelectionTimeoutMS: 5000, // 5 seconds
      socketTimeoutMS: 45000, // 45 seconds
      connectTimeoutMS: 10000, // 10 seconds
      maxPoolSize: 10,
      minPoolSize: 2,
      retryWrites: true,
      w: 'majority'
    };

    console.log('🔄 Connecting to MongoDB...');
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection events with better logging
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected - will attempt to reconnect');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected successfully');
    });
    
    mongoose.connection.on('connecting', () => {
      console.log('🔄 MongoDB connecting...');
    });
    
    mongoose.connection.on('connected', () => {
      console.log('✅ MongoDB connected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
      } catch (error) {
        console.error('Error during MongoDB disconnection:', error);
        process.exit(1);
      }
    });

  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    
    if (process.env.MONGODB_URI && process.env.MONGODB_URI.includes('localhost')) {
      console.log('\n🔧 Local MongoDB connection failed. To fix this:');
      console.log('1. Install MongoDB Community Server: https://www.mongodb.com/try/download/community');
      console.log('2. Start MongoDB service: net start MongoDB (Windows) or brew services start mongodb/brew/mongodb-community (Mac)');
      console.log('3. Or switch to Atlas by uncommenting the Atlas URI in .env file');
    } else {
      console.log('\n🔧 MongoDB Atlas connection failed. To fix this:');
      console.log('1. Add your IP to MongoDB Atlas Network Access list');
      console.log('2. Ensure 0.0.0.0/0 is properly configured in Atlas');
      console.log('3. Check your MongoDB Atlas credentials in .env file');
      console.log('4. Or switch to local MongoDB for development');
    }
    
    console.log('\n⚠️  Server will continue running without database connection');
    console.log('🔄 Database will attempt to reconnect automatically');
    
    // Don't exit the process, let the server continue running
    // The task polling service will handle the disconnected state gracefully
  }
};

module.exports = connectDB;