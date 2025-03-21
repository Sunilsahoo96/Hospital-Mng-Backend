const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');

const connectionString = 'mongodb://127.0.0.1:27018/Hospital-Management-System';

const connectDB = async () => {
  try {
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected successfully on port 27018!');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;