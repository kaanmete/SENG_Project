const { verifyToken } = require('../utils/jwt');
const { query } = require('../config/database');
const logger = require('../utils/logger');

// Authentication middleware - verifies JWT token (FR-03)
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Please authenticate.'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      // Verify token
      const decoded = verifyToken(token);

      // Get user from database
      const result = await query(
        'SELECT id, email, role, is_verified, learning_purpose FROM users WHERE id = $1',
        [decoded.userId]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'User not found. Token invalid.'
        });
      }

      const user = result.rows[0];

      // Check if email is verified (FR-02)
      if (!user.is_verified) {
        return res.status(403).json({
          success: false,
          message: 'Email not verified. Please verify your email to access this resource.'
        });
      }

      // Attach user to request object
      req.user = user;

      logger.logUserAction(user.id, 'API_ACCESS', {
        endpoint: req.path,
        method: req.method
      });

      next();
    } catch (error) {
      logger.error('Token verification failed', error);
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token.'
      });
    }
  } catch (error) {
    logger.error('Authentication middleware error', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during authentication.'
    });
  }
};

// Admin authorization middleware (FR-13, FR-19, FR-22)
const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    if (req.user.role !== 'admin') {
      logger.logUserAction(req.user.id, 'UNAUTHORIZED_ACCESS_ATTEMPT', {
        endpoint: req.path,
        requiredRole: 'admin'
      });

      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    next();
  } catch (error) {
    logger.error('Admin authorization error', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during authorization.'
    });
  }
};

// Optional authentication - doesn't fail if no token provided
const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.substring(7);

  try {
    const decoded = verifyToken(token);
    const result = await query(
      'SELECT id, email, role, is_verified FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (result.rows.length > 0 && result.rows[0].is_verified) {
      req.user = result.rows[0];
    }
  } catch (error) {
    // Silently fail for optional auth
    logger.debug('Optional auth failed', error.message);
  }

  next();
};

module.exports = {
  authenticate,
  requireAdmin,
  optionalAuth
};
