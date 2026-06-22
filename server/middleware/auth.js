const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require('mongoose');

const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Demo Mode fallback for middleware
    if (mongoose.connection.readyState !== 1) {
      req.user = { _id: decoded.id, name: 'Demo User', email: 'demo@smartfilter.ai' };
      return next();
    }

    try {
      req.user = await User.findById(decoded.id).select('-password').maxTimeMS(5000);
      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }
    } catch (dbErr) {
      console.warn("DB not ready, mocking user:", dbErr.message);
      req.user = { _id: decoded.id, name: 'Demo User', email: 'demo@smartfilter.ai' };
    }

    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

module.exports = { protect };
