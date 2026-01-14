const bcrypt = require('bcryptjs');
const { query } = require('../config/database');
const { generateToken, verifyToken } = require('../utils/jwt');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../services/emailService');
const logger = require('../utils/logger');

// Register new user (FR-01)
const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered. Please login or use a different email.'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Create user
    const result = await query(
      'INSERT INTO users (email, password_hash, role, is_verified) VALUES ($1, $2, $3, $4) RETURNING id, email, role, created_at',
      [email, password_hash, 'user', false]
    );

    const user = result.rows[0];

    // Send verification email (FR-02)
    try {
      await sendVerificationEmail(email, user.id);
    } catch (emailError) {
      logger.error('Failed to send verification email', emailError);
      // Don't fail registration if email fails
    }

    logger.logUserAction(user.id, 'REGISTER', { email });

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please check your email to verify your account.',
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    logger.error('Registration error', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during registration. Please try again.'
    });
  }
};

// Login (FR-03)
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const result = await query(
      'SELECT id, email, password_hash, role, is_verified, learning_purpose FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const user = result.rows[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      logger.logUserAction(user.id, 'FAILED_LOGIN', { email });
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Check if email is verified (FR-02)
    if (!user.is_verified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email before logging in.',
        requiresVerification: true
      });
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    logger.logUserAction(user.id, 'LOGIN', { email });

    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        learning_purpose: user.learning_purpose
      }
    });
  } catch (error) {
    logger.error('Login error', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during login. Please try again.'
    });
  }
};

// Verify email (FR-02)
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required.'
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token.'
      });
    }

    // Update user verification status
    const result = await query(
      'UPDATE users SET is_verified = true WHERE id = $1 AND email = $2 RETURNING id, email',
      [decoded.userId, decoded.email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    const user = result.rows[0];
    logger.logUserAction(user.id, 'EMAIL_VERIFIED', { email: user.email });

    res.json({
      success: true,
      message: 'Email verified successfully! You can now login.'
    });
  } catch (error) {
    logger.error('Email verification error', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during verification. Please try again.'
    });
  }
};

// Resend verification email
const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    const result = await query(
      'SELECT id, email, is_verified FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Email not found.'
      });
    }

    const user = result.rows[0];

    if (user.is_verified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified.'
      });
    }

    await sendVerificationEmail(email, user.id);

    res.json({
      success: true,
      message: 'Verification email sent! Please check your inbox.'
    });
  } catch (error) {
    logger.error('Resend verification error', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resend verification email.'
    });
  }
};

// Request password reset (FR-04)
const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    const result = await query(
      'SELECT id, email FROM users WHERE email = $1',
      [email]
    );

    // Always return success to prevent email enumeration
    if (result.rows.length === 0) {
      return res.json({
        success: true,
        message: 'If that email exists, a password reset link has been sent.'
      });
    }

    const user = result.rows[0];

    await sendPasswordResetEmail(email, user.id);

    logger.logUserAction(user.id, 'PASSWORD_RESET_REQUESTED', { email });

    res.json({
      success: true,
      message: 'If that email exists, a password reset link has been sent.'
    });
  } catch (error) {
    logger.error('Password reset request error', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred. Please try again.'
    });
  }
};

// Reset password (FR-04)
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required.'
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token.'
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(newPassword, salt);

    // Update password
    const result = await query(
      'UPDATE users SET password_hash = $1 WHERE id = $2 AND email = $3 RETURNING id, email',
      [password_hash, decoded.userId, decoded.email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    const user = result.rows[0];
    logger.logUserAction(user.id, 'PASSWORD_RESET', { email: user.email });

    res.json({
      success: true,
      message: 'Password reset successful! You can now login with your new password.'
    });
  } catch (error) {
    logger.error('Password reset error', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred. Please try again.'
    });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const result = await query(
      'SELECT id, email, role, learning_purpose, is_verified, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    res.json({
      success: true,
      user: result.rows[0]
    });
  } catch (error) {
    logger.error('Get profile error', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile.'
    });
  }
};

module.exports = {
  register,
  login,
  verifyEmail,
  resendVerification,
  requestPasswordReset,
  resetPassword,
  getProfile
};
