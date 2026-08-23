const mongoose = require('mongoose');

let mongod = null;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/smart_complaint_db';
    
    // Attempt standard MongoDB connection first
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    
    // Auto seed database if empty
    const autoSeed = require('./autoSeed');
    await autoSeed();
  } catch (error) {
    console.warn(`[Database Warning] Local MongoDB service connection failed (${error.message}).`);
    console.log('[Database] Initializing In-Memory MongoDB Server for smooth local operation...');
    
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongod = await MongoMemoryServer.create();
      const memUri = mongod.getUri();
      const conn = await mongoose.connect(memUri);
      console.log(`[Database] In-Memory MongoDB Connected successfully: ${conn.connection.host}`);

      // Auto seed database if empty
      const autoSeed = require('./autoSeed');
      await autoSeed();
    } catch (memErr) {
      console.error('[Database Error] Failed to start In-Memory MongoDB:', memErr.message);
    }
  }
};

const getDBState = () => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  return states[mongoose.connection.readyState] || 'unknown';
};

module.exports = { connectDB, getDBState };
