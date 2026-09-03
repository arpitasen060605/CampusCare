const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const sendEmail = require('../utils/sendEmail');

// Helper to generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'super_secret_jwt_key_hackathon_2026', {
    expiresIn: '30d',
  });
};

// In-memory rate limiting map for password reset requests (max 5 per 15 mins)
const resetRateLimit = new Map();

// @route   POST /api/auth/register
// @desc    Register a new user (student/staff/admin)
// @access  Public
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, role, department } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Bad Request', message: 'Please provide name, email, and password' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ error: 'Bad Request', message: 'User already exists with this email' });
    }

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: role ? role.toLowerCase() : 'student',
      department: department || 'General',
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get JWT token
// @access  Public
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Bad Request', message: 'Please provide email and password' });
    }

    // Find user & include password field
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Invalid credentials' });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email with secure token
// @access  Public
router.post('/forgot-password', async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Bad Request', message: 'Please enter a valid campus email' });
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ error: 'Bad Request', message: 'Please enter a valid campus email address' });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Simple Rate Limiting Check (Max 5 requests per 15 minutes)
    const now = Date.now();
    const userRateData = resetRateLimit.get(cleanEmail) || { count: 0, firstReset: now };

    if (now - userRateData.firstReset > 15 * 60 * 1000) {
      userRateData.count = 1;
      userRateData.firstReset = now;
    } else {
      userRateData.count += 1;
    }
    resetRateLimit.set(cleanEmail, userRateData);

    if (userRateData.count > 5) {
      return res.status(429).json({
        error: 'Too Many Requests',
        message: 'Too many password reset attempts. Please wait 15 minutes before trying again.',
      });
    }

    const user = await User.findOne({ email: cleanEmail });

    if (user) {
      // Generate random 32-byte hex token
      const rawToken = crypto.randomBytes(32).toString('hex');

      // Hash token using SHA256 before storing in DB
      const resetTokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

      // Set expiration to 20 minutes from now
      user.resetPasswordToken = resetTokenHash;
      user.resetPasswordExpire = Date.now() + 20 * 60 * 1000;

      await user.save({ validateBeforeSave: false });

      // Construct reset URL
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      const resetUrl = `${frontendUrl.replace(/\/$/, '')}/reset-password?token=${rawToken}`;

      const message = `You are receiving this email because you requested a password reset for your Smart Complaint account.\n\nPlease click on the link below or paste it into your browser to complete the process:\n\n${resetUrl}\n\nThis link will expire in 20 minutes.\n\nIf you did not request this, please ignore this email and your password will remain unchanged.`;

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0f172a; color: #f8fafc; border-radius: 16px; border: 1px solid #1e293b;">
          <h2 style="color: #6366f1; margin-top: 0;">Smart Complaint Password Reset</h2>
          <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">You requested a password reset for your campus portal account. Click the button below to reset your password:</p>
          <div style="margin: 25px 0;">
            <a href="${resetUrl}" style="background-color: #4f46e5; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 14px; display: inline-block;">Reset Password</a>
          </div>
          <p style="color: #94a3b8; font-size: 12px;">This link expires in <strong>20 minutes</strong>. If you did not request a password reset, you can safely ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid #1e293b; margin: 20px 0;" />
          <p style="color: #64748b; font-size: 11px;">CampusCare • Smart Complaint Management System</p>
        </div>
      `;

      try {
        await sendEmail({
          email: user.email,
          subject: 'Password Reset - Smart Complaint System',
          message,
          html,
          resetUrl,
        });
      } catch (err) {
        console.error('[Email Dispatch Warning]', err.message);
        // Do not throw error to user; keep generic response
      }
    }

    // Always return generic response to prevent user enumeration
    res.status(200).json({
      success: true,
      message: 'If an account exists for this email, a password reset link has been sent.',
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/auth/reset-password
// @desc    Reset password using valid token
// @access  Public
router.post('/reset-password', async (req, res, next) => {
  try {
    const { token, password } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Bad Request', message: 'Password reset token is missing' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Bad Request', message: 'Password must be at least 6 characters long' });
    }

    // Hash incoming raw token with SHA256 to compare with stored hash
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with matching token that hasn't expired
    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid or expired password reset token. Please request a new link.',
      });
    }

    // Set new password (pre-save hook will hash it with bcrypt)
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful. Your password has been updated.',
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/auth/me
// @desc    Get current authenticated user profile
// @access  Private
router.get('/me', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

