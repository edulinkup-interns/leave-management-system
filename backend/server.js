const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/leaves', require('./routes/leaveRoutes'));

const { MongoMemoryServer } = require('mongodb-memory-server');
const PORT = process.env.PORT || 5000;
const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URI;
    
    // Use in-memory MongoDB if the placeholder URI is present or if no URI is provided
    if (!mongoUri || mongoUri.includes('<username>:<password>')) {
      console.log('No valid MongoDB URI configured. Starting a temporary in-memory MongoDB server for development...');
      const mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
      console.log(`In-memory MongoDB started successfully at: ${mongoUri}`);
      console.log('\n--- IMPORTANT ---');
      console.log('INFO: Any data created now will be CLEARED when this server stops.');
      console.log('To persist data permanently, please provide a real MONGO_URI in your .env file.');
      console.log('-----------------\n');
    }

    console.log('Attempting to connect to MongoDB URI:', mongoUri);
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('MongoDB connection error details:', err.stack || err);
  }
};

connectDB();
