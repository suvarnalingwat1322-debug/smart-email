const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Track MongoDB connectivity
let dbConnected = false;

// Routes
const authRoutes = require('./routes/auth');
const emailRoutes = require('./routes/emails');
const aiRoutes = require('./routes/ai');
const analyticsRoutes = require('./routes/analytics');

app.use('/api/auth', authRoutes);
app.use('/api/emails', emailRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Smart Email Filter AI Server is running!',
    dbConnected,
    mode: dbConnected ? 'MongoDB' : 'Demo (no database)'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

const startServer = () => {
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    if (!dbConnected) {
      console.log('⚠️  Running in demo mode (no MongoDB). Register/Login will use in-memory store.');
    }
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`⚠️  Port ${PORT} is busy, trying ${PORT + 1}...`);
      app.listen(PORT + 1, () => {
        console.log(`🚀 Server running on http://localhost:${PORT + 1}`);
      });
    } else {
      throw err;
    }
  });
};

// Try MongoDB, start server regardless
mongoose.set('bufferCommands', false);
mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 3000 })
  .then(() => {
    dbConnected = true;
    console.log('✅ MongoDB connected');
    startServer();
  })
  .catch((err) => {
    console.log(`⚠️  MongoDB not available (${err.message}). Starting in demo mode...`);
    startServer();
  });

module.exports = app;
