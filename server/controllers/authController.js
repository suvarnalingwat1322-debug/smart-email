const jwt        = require('jsonwebtoken');
const crypto      = require('crypto');
const nodemailer  = require('nodemailer');
const User        = require('../models/User');

// ─── Helpers ────────────────────────────────────────────────────────────────

const generateJWT = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

const generateVerificationToken = () => crypto.randomBytes(32).toString('hex');

/**
 * Create a Nodemailer transporter.
 * - If EMAIL_USER / EMAIL_PASS are set in .env, use Gmail (or any SMTP).
 * - Otherwise create an Ethereal test account and log the preview URL to console.
 */
const getTransporter = async () => {
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  // Ethereal fallback — no real email sent; preview URL printed to console
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });
};

const sendVerificationEmail = async (email, token) => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const verifyUrl = `${clientUrl}/verify-email?token=${token}`;

  const transporter = await getTransporter();

  const info = await transporter.sendMail({
    from: `"SmartFilter AI" <${process.env.EMAIL_USER || 'noreply@smartfilter.ai'}>`,
    to: email,
    subject: 'Verify your SmartFilter AI account',
    html: `
      <div style="font-family:sans-serif;max-width:500px;margin:auto;padding:32px;border-radius:12px;border:1px solid #e5e7eb">
        <h2 style="color:#4f46e5">Verify your email</h2>
        <p>Thanks for signing up! Click the button below to verify your email address.</p>
        <a href="${verifyUrl}"
           style="display:inline-block;margin-top:16px;padding:12px 24px;background:#4f46e5;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">
          Verify Email
        </a>
        <p style="margin-top:24px;color:#6b7280;font-size:13px">
          This link expires in 24 hours. If you did not create this account, you can safely ignore this email.
        </p>
        <p style="color:#9ca3af;font-size:12px">Or copy this link:<br/>${verifyUrl}</p>
      </div>
    `
  });

  // When using Ethereal, log the preview URL so developers can click it
  if (!process.env.EMAIL_USER) {
    console.log('\n📧 VERIFICATION EMAIL (Ethereal preview):');
    console.log('   URL:', nodemailer.getTestMessageUrl(info));
    console.log('   Direct verify link:', verifyUrl, '\n');
  }
};

// ─── Controllers ────────────────────────────────────────────────────────────

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // ── 1. Input validation ──
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill all fields.' });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters.' });
    }

    // ── 2. Duplicate email check ──
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    // ── 3. Create user (password hashed by pre-save hook) ──
    const verificationToken  = generateVerificationToken();
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 h

    const user = await User.create({
      name:                    name.trim(),
      email:                   email.toLowerCase().trim(),
      password,
      isVerified:              false,
      verificationToken,
      verificationTokenExpiry: verificationExpiry
    });

    // ── 4. Send verification email ──
    await sendVerificationEmail(user.email, verificationToken);

    // ── 5. Return success — NO token, NO session yet ──
    return res.status(201).json({
      message: 'Registration successful! Please check your email to verify your account before logging in.'
    });

  } catch (error) {
    console.error('Register error:', error);
    if (error.code === 11000) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }
    return res.status(500).json({ message: 'Server error during registration. Please try again.' });
  }
};

// GET /api/auth/verify-email?token=...
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: 'Verification token is missing.' });
    }

    // Find user with this token that hasn't expired
    const user = await User.findOne({
      verificationToken:        token,
      verificationTokenExpiry:  { $gt: new Date() }
    }).select('+verificationToken +verificationTokenExpiry');

    if (!user) {
      return res.status(400).json({
        message: 'Invalid or expired verification link. Please request a new one.'
      });
    }

    // Mark as verified and clear the token
    user.isVerified              = true;
    user.verificationToken       = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save({ validateBeforeSave: false });

    return res.json({ message: 'Email verified successfully! You can now log in.' });

  } catch (error) {
    console.error('Verify email error:', error);
    return res.status(500).json({ message: 'Server error during verification. Please try again.' });
  }
};

// POST /api/auth/resend-verification
const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Please provide your email address.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() })
      .select('+verificationToken +verificationTokenExpiry');

    // Generic response to prevent user enumeration
    if (!user) {
      return res.json({ message: 'If an account with that email exists, a new verification email has been sent.' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'This account is already verified. Please log in.' });
    }

    // Issue new token
    user.verificationToken       = generateVerificationToken();
    user.verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save({ validateBeforeSave: false });

    await sendVerificationEmail(user.email, user.verificationToken);

    return res.json({ message: 'If an account with that email exists, a new verification email has been sent.' });

  } catch (error) {
    console.error('Resend verification error:', error);
    return res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ── 1. Input validation ──
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide your email and password.' });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address.' });
    }

    // ── 2. Find user (include password for comparison) ──
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!user) {
      // Use a generic message to prevent email enumeration
      return res.status(401).json({ message: 'Account not found. Please register first.' });
    }

    // ── 3. Compare password ──
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // ── 4. Check verification status ──
    if (!user.isVerified) {
      return res.status(403).json({
        message: 'Please verify your email before logging in.',
        needsVerification: true,
        email: user.email
      });
    }

    // ── 5. All checks passed — issue JWT ──
    const token = generateJWT(user._id);

    return res.json({
      token,
      user: {
        _id:         user._id,
        name:        user.name,
        email:       user.email,
        isVerified:  user.isVerified,
        preferences: user.preferences
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error during login. Please try again.' });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  // req.user is set by the protect middleware — always a real DB user
  return res.json({
    user: {
      _id:         req.user._id,
      name:        req.user.name,
      email:       req.user.email,
      isVerified:  req.user.isVerified,
      preferences: req.user.preferences
    }
  });
};

module.exports = { register, login, getMe, verifyEmail, resendVerification };
