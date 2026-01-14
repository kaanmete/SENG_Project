const { query } = require('../config/database');
const logger = require('../utils/logger');

// Get system health metrics (FR-13, FR-22 - UC-22)
const getSystemHealth = async (req, res) => {
  try {
    // Get database connection count
    const dbStats = await query('SELECT count(*) as active_connections FROM pg_stat_activity');

    // Get total users
    const userStats = await query(`
      SELECT
        COUNT(*) as total_users,
        COUNT(CASE WHEN is_verified THEN 1 END) as verified_users,
        COUNT(CASE WHEN created_at > NOW() - INTERVAL '24 hours' THEN 1 END) as users_last_24h
      FROM users
    `);

    // Get exam statistics
    const examStats = await query(`
      SELECT
        COUNT(*) as total_exams,
        COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as active_exams,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_exams,
        COUNT(CASE WHEN start_time > NOW() - INTERVAL '24 hours' THEN 1 END) as exams_last_24h
      FROM exams
    `);

    // Get error logs from last hour
    const errorStats = await query(`
      SELECT COUNT(*) as error_count
      FROM system_metrics
      WHERE metric_type = 'error' AND timestamp > NOW() - INTERVAL '1 hour'
    `);

    // Calculate system status
    const activeConnections = parseInt(dbStats.rows[0].active_connections);
    const activeExams = parseInt(examStats.rows[0].active_exams);
    const errorCount = parseInt(errorStats.rows[0]?.error_count || 0);

    let systemStatus = 'healthy';
    if (activeConnections > 15 || activeExams > 400 || errorCount > 10) {
      systemStatus = 'degraded';
    }
    if (activeConnections > 18 || activeExams > 480 || errorCount > 50) {
      systemStatus = 'critical';
    }

    // Save health metric
    await query(
      `INSERT INTO system_metrics (metric_type, value, details)
       VALUES ($1, $2, $3)`,
      [
        'health_check',
        systemStatus === 'healthy' ? 1 : 0,
        JSON.stringify({
          status: systemStatus,
          active_connections: activeConnections,
          active_exams: activeExams
        })
      ]
    );

    res.json({
      success: true,
      health: {
        status: systemStatus,
        timestamp: new Date().toISOString(),
        database: {
          active_connections: activeConnections,
          max_connections: 20
        },
        users: userStats.rows[0],
        exams: examStats.rows[0],
        errors: {
          last_hour: errorCount
        }
      }
    });
  } catch (error) {
    logger.error('Get system health error', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch system health.'
    });
  }
};

// Get all users (FR-19 - UC-22)
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 50, search } = req.query;
    const offset = (page - 1) * limit;

    let queryText = `
      SELECT id, email, role, learning_purpose, is_verified, created_at
      FROM users
    `;
    let params = [];

    if (search) {
      queryText += ` WHERE email ILIKE $1`;
      params.push(`%${search}%`);
    }

    queryText += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await query(queryText, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM users';
    let countParams = [];
    if (search) {
      countQuery += ' WHERE email ILIKE $1';
      countParams.push(`%${search}%`);
    }
    const countResult = await query(countQuery, countParams);

    res.json({
      success: true,
      users: result.rows,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(countResult.rows[0].total / limit),
        total_users: parseInt(countResult.rows[0].total)
      }
    });
  } catch (error) {
    logger.error('Get all users error', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users.'
    });
  }
};

// Get user details with exam history (FR-19)
const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    // Get user info
    const userResult = await query(
      'SELECT id, email, role, learning_purpose, is_verified, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    // Get exam history
    const examsResult = await query(
      `SELECT id, exam_type, start_time, end_time, status, total_score, cefr_level
       FROM exams
       WHERE user_id = $1
       ORDER BY start_time DESC`,
      [userId]
    );

    // Get statistics
    const statsResult = await query(
      `SELECT
        COUNT(*) as total_exams,
        AVG(total_score) as avg_score,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_exams
       FROM exams
       WHERE user_id = $1`,
      [userId]
    );

    res.json({
      success: true,
      user: userResult.rows[0],
      exams: examsResult.rows,
      statistics: statsResult.rows[0]
    });
  } catch (error) {
    logger.error('Get user details error', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user details.'
    });
  }
};

// Update user role (FR-19)
const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be "user" or "admin".'
      });
    }

    const result = await query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, email, role',
      [role, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    logger.logUserAction(req.user.id, 'ADMIN_UPDATE_USER_ROLE', {
      targetUserId: userId,
      newRole: role
    });

    res.json({
      success: true,
      message: 'User role updated successfully.',
      user: result.rows[0]
    });
  } catch (error) {
    logger.error('Update user role error', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user role.'
    });
  }
};

// Delete user (FR-19)
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user exists
    const userResult = await query(
      'SELECT id, email FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    // Delete user (cascade will delete related data)
    await query('DELETE FROM users WHERE id = $1', [userId]);

    logger.logUserAction(req.user.id, 'ADMIN_DELETE_USER', {
      deletedUserId: userId,
      deletedEmail: userResult.rows[0].email
    });

    res.json({
      success: true,
      message: 'User deleted successfully.'
    });
  } catch (error) {
    logger.error('Delete user error', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user.'
    });
  }
};

// Get system usage reports (FR-13)
const getUsageReports = async (req, res) => {
  try {
    const { days = 7 } = req.query;

    // Daily active users
    const dauResult = await query(
      `SELECT
        DATE(created_at) as date,
        COUNT(*) as new_users
       FROM users
       WHERE created_at > NOW() - INTERVAL '${parseInt(days)} days'
       GROUP BY DATE(created_at)
       ORDER BY date DESC`,
      []
    );

    // Daily exams
    const examResult = await query(
      `SELECT
        DATE(start_time) as date,
        COUNT(*) as total_exams,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_exams
       FROM exams
       WHERE start_time > NOW() - INTERVAL '${parseInt(days)} days'
       GROUP BY DATE(start_time)
       ORDER BY date DESC`,
      []
    );

    // Top skills being practiced
    const skillsResult = await query(
      `SELECT
        q.type as skill,
        COUNT(*) as practice_count
       FROM responses r
       JOIN questions q ON r.question_id = q.id
       JOIN exams e ON r.exam_id = e.id
       WHERE e.start_time > NOW() - INTERVAL '${parseInt(days)} days'
       GROUP BY q.type
       ORDER BY practice_count DESC`,
      []
    );

    res.json({
      success: true,
      reports: {
        daily_users: dauResult.rows,
        daily_exams: examResult.rows,
        popular_skills: skillsResult.rows
      }
    });
  } catch (error) {
    logger.error('Get usage reports error', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate usage reports.'
    });
  }
};

// Get system metrics history
const getMetricsHistory = async (req, res) => {
  try {
    const { metric_type, hours = 24 } = req.query;

    let queryText = `
      SELECT id, metric_type, value, details, timestamp
      FROM system_metrics
      WHERE timestamp > NOW() - INTERVAL '${parseInt(hours)} hours'
    `;

    const params = [];

    if (metric_type) {
      queryText += ` AND metric_type = $1`;
      params.push(metric_type);
    }

    queryText += ` ORDER BY timestamp DESC LIMIT 100`;

    const result = await query(queryText, params);

    res.json({
      success: true,
      metrics: result.rows
    });
  } catch (error) {
    logger.error('Get metrics history error', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch metrics history.'
    });
  }
};

module.exports = {
  getSystemHealth,
  getAllUsers,
  getUserDetails,
  updateUserRole,
  deleteUser,
  getUsageReports,
  getMetricsHistory
};
