require('dotenv').config();
const mongoose = require('mongoose');

const connectionString = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(connectionString);
    console.log('MongoDB connected successfully on port 27017!');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;