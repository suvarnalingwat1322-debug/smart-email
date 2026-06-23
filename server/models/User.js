const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false
  },
  avatar: {
    type: String,
    default: null
  },
  // ── Email verification ──────────────────────────────────────────
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: {
    type: String,
    select: false
  },
  verificationTokenExpiry: {
    type: Date,
    select: false
  },
  // ────────────────────────────────────────────────────────────────
  preferences: {
    darkMode:       { type: Boolean, default: false },
    notifications:  { type: Boolean, default: true },
    aiSensitivity:  { type: String, enum: ['low', 'medium', 'high'], default: 'medium' }
  }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare plain password with hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
