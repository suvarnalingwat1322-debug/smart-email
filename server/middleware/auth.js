const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    // ── 1. Extract Bearer token ──
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized. No token provided.' });
    }

    // ── 2. Verify JWT signature and expiry ──
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtErr) {
      return res.status(401).json({ message: 'Not authorized. Token is invalid or expired.' });
    }

    // ── 3. Find the real user in the database ──
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Not authorized. User account no longer exists.' });
    }

    // ── 4. Ensure the user is still verified ──
    if (!user.isVerified) {
      return res.status(403).json({
        message: 'Account not verified. Please verify your email before accessing this resource.'
      });
    }

    // ── 5. Attach real user to request and continue ──
    req.user = user;
    next();

  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ message: 'Not authorized. Authentication failed.' });
  }
};

module.exports = { protect };
