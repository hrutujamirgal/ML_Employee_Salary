const mongoose = require("mongoose");

const url = "mongodb://localhost:27017/Floqer"

const connectDB = async () => {
    try {
      await mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('MongoDB Connected');
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error.message);
      process.exit(1); 
    }
  };
  
module.exports = connectDB;
