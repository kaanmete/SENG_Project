const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const { authenticate } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const { validate, validationRules } = require('../utils/validation');

// Public routes
router.post('/register', authLimiter, validate(validationRules.register), authController.register);
router.post('/login', authLimiter, validate(validationRules.login), authController.login);
router.post('/verify-email', authController.verifyEmail);
router.post('/resend-verification', authLimiter, authController.resendVerification);
router.post('/request-password-reset', authLimiter, authController.requestPasswordReset);
router.post('/reset-password', authLimiter, authController.resetPassword);

// Protected routes
router.get('/profile', authenticate, authController.getProfile);

module.exports = router;
