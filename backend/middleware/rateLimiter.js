const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');

// General API rate limiter (NFR-07)
const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('Rate limit exceeded', {
      ip: req.ip,
      path: req.path
    });
    res.status(429).json({
      success: false,
      message: 'Too many requests. Please try again later.'
    });
  }
});

// Strict rate limiter for authentication endpoints (NFR-07)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  skipSuccessfulRequests: true, // Don't count successful requests
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again in 15 minutes.'
  },
  handler: (req, res) => {
    logger.warn('Auth rate limit exceeded', {
      ip: req.ip,
      email: req.body.email,
      path: req.path
    });
    res.status(429).json({
      success: false,
      message: 'Too many authentication attempts. Please try again later.'
    });
  }
});

// AI generation rate limiter (prevent abuse)
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 AI requests per minute per user
  keyGenerator: (req) => {
    // Use user ID if authenticated, otherwise use IP
    return req.user ? `user_${req.user.id}` : req.ip;
  },
  message: {
    success: false,
    message: 'Too many AI requests. Please wait a moment.'
  }
});

module.exports = {
  apiLimiter,
  authLimiter,
  aiLimiter
};
