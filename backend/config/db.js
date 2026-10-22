// config/db.js - MongoDB connection setup using Mongoose
const mongoose = require('mongoose');

// Connect to MongoDB using the URI specified in the environment variables
const connectDB = async () => {
  try {
    // WHY: Connect with modern Mongoose options to enable connection pooling and unified topology
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`[Database] MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    // WHY: Exit the process immediately if the database connection fails, because the API cannot function without data
    console.error(`[Database Error] Connection failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
