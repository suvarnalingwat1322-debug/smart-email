const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const dotenv   = require('dotenv');

dotenv.config();

const app = express();

// ─── CORS ────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.CLIENT_URL
  ].filter(Boolean),
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));

// ─── Routes ──────────────────────────────────────────────────────────────────
const authRoutes      = require('./routes/auth');
const emailRoutes     = require('./routes/emails');
const aiRoutes        = require('./routes/ai');
const analyticsRoutes = require('./routes/analytics');

app.use('/api/auth',      authRoutes);
app.use('/api/emails',    emailRoutes);
app.use('/api/ai',        aiRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Smart Email Filter AI Server is running!', status: 'ok' });
});

// ─── Global error handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Internal server error' });
});

// ─── Start server only after DB connects ─────────────────────────────────────
const PORT = process.env.PORT || 5000;

mongoose.set('bufferCommands', false);

mongoose
  .connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    console.error('   Authentication requires a database. Please check your MONGO_URI in .env');
    process.exit(1); // Do NOT start without a database — auth would be broken
  });

module.exports = app;
