const jwt = require('jsonwebtoken');
const logger = require('./logger');

// Generate JWT token
const generateToken = (payload) => {
  try {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
  } catch (error) {
    logger.error('Error generating JWT token', error);
    throw error;
  }
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    logger.error('Error verifying JWT token', error);
    throw error;
  }
};

// Generate email verification token (short-lived)
const generateVerificationToken = (payload) => {
  try {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '24h' // Verification tokens expire in 24 hours
    });
  } catch (error) {
    logger.error('Error generating verification token', error);
    throw error;
  }
};

// Generate password reset token (short-lived)
const generateResetToken = (payload) => {
  try {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h' // Reset tokens expire in 1 hour
    });
  } catch (error) {
    logger.error('Error generating reset token', error);
    throw error;
  }
};

module.exports = {
  generateToken,
  verifyToken,
  generateVerificationToken,
  generateResetToken
};
