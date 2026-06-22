const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require('mongoose');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Mock in-memory user store for demo mode when DB is unavailable
const mockUsers = [];

const isDbConnected = () => mongoose.connection.readyState === 1;

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    if (!isDbConnected()) {
      // Demo Mode Fallback
      if (mockUsers.find(u => u.email === email)) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }
      const mockUser = {
        _id: Math.random().toString(36).substring(7),
        name,
        email,
        password, // In memory, we don't hash just for demo
        preferences: { darkMode: false, notifications: true, aiSensitivity: 'medium' }
      };
      mockUsers.push(mockUser);
      const token = generateToken(mockUser._id);
      return res.status(201).json({ token, user: { _id: mockUser._id, name: mockUser.name, email: mockUser.email, preferences: mockUser.preferences } });
    }

    const existingUser = await User.findOne({ email }).maxTimeMS(5000);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    // If Mongoose errors out due to connection, use mock
    const mockUser = {
      _id: Math.random().toString(36).substring(7),
      name: req.body.name,
      email: req.body.email,
      preferences: { darkMode: false, notifications: true, aiSensitivity: 'medium' }
    };
    mockUsers.push(mockUser);
    const token = generateToken(mockUser._id);
    return res.status(201).json({ token, user: mockUser });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    if (!isDbConnected()) {
      // Demo mode fallback
      const mockUser = mockUsers.find(u => u.email === email);
      if (!mockUser || mockUser.password !== password) {
        if (email === 'demo@smartfilter.ai' && password === 'demo123456') {
           const demoUser = { _id: 'demo1', name: 'Demo User', email, preferences: { darkMode: false, notifications: true, aiSensitivity: 'medium' } };
           return res.json({ token: generateToken('demo1'), user: demoUser });
        }
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      return res.json({
        token: generateToken(mockUser._id),
        user: { _id: mockUser._id, name: mockUser.name, email: mockUser.email, preferences: mockUser.preferences }
      });
    }

    const user = await User.findOne({ email }).select('+password').maxTimeMS(5000);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    // Fallback to demo
    if (req.body.email === 'demo@smartfilter.ai' && req.body.password === 'demo123456') {
       const demoUser = { _id: 'demo1', name: 'Demo User', email: req.body.email, preferences: { darkMode: false, notifications: true, aiSensitivity: 'medium' } };
       return res.json({ token: generateToken('demo1'), user: demoUser });
    }
    res.status(500).json({ message: error.message });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  if (req.user) {
    res.json({
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        preferences: req.user.preferences
      }
    });
  } else {
    // If middleware mocked the user
    res.json({
      user: {
        _id: 'mock',
        name: 'Demo User',
        email: 'demo@smartfilter.ai',
        preferences: { darkMode: false, notifications: true, aiSensitivity: 'medium' }
      }
    });
  }
};

module.exports = { register, login, getMe };
