const { query } = require('../config/database');
const { generateStudyPlan } = require('../services/aiEngineService');
const logger = require('../utils/logger');

// Update learning purpose (FR-04 - UC-02)
const updateLearningPurpose = async (req, res) => {
  try {
    const { learning_purpose } = req.body;
    const userId = req.user.id;

    const validPurposes = ['exam', 'business', 'travel', 'academic', 'general'];

    if (!validPurposes.includes(learning_purpose)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid learning purpose. Must be one of: exam, business, travel, academic, general'
      });
    }

    const result = await query(
      'UPDATE users SET learning_purpose = $1 WHERE id = $2 RETURNING id, email, learning_purpose',
      [learning_purpose, userId]
    );

    logger.logUserAction(userId, 'UPDATE_LEARNING_PURPOSE', { purpose: learning_purpose });

    res.json({
      success: true,
      message: 'Learning purpose updated successfully!',
      user: result.rows[0]
    });
  } catch (error) {
    logger.error('Update learning purpose error', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update learning purpose.'
    });
  }
};

// Get user's exam history
const getExamHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await query(
      `SELECT id, exam_type, start_time, end_time, status, total_score, cefr_level
       FROM exams
       WHERE user_id = $1
       ORDER BY start_time DESC
       LIMIT 20`,
      [userId]
    );

    res.json({
      success: true,
      exams: result.rows
    });
  } catch (error) {
    logger.error('Get exam history error', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch exam history.'
    });
  }
};

// Get user's progress analytics (FR-12 - UC-15)
const getUserAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get completed exams with detailed scores
    const examsResult = await query(
      `SELECT
        e.id, e.exam_type, e.cefr_level, e.total_score, e.end_time,
        COUNT(r.id) as total_questions,
        SUM(CASE WHEN r.is_correct THEN 1 ELSE 0 END) as correct_answers
       FROM exams e
       LEFT JOIN responses r ON e.id = r.exam_id
       WHERE e.user_id = $1 AND e.status = 'completed'
       GROUP BY e.id
       ORDER BY e.end_time DESC
       LIMIT 10`,
      [userId]
    );

    // Get skill-based performance
    const skillsResult = await query(
      `SELECT
        q.type as skill,
        COUNT(r.id) as total,
        SUM(CASE WHEN r.is_correct THEN 1 ELSE 0 END) as correct,
        ROUND(AVG(CASE WHEN r.is_correct THEN 100 ELSE 0 END), 2) as success_rate
       FROM responses r
       JOIN questions q ON r.question_id = q.id
       JOIN exams e ON r.exam_id = e.id
       WHERE e.user_id = $1 AND e.status = 'completed'
       GROUP BY q.type`,
      [userId]
    );

    // Calculate overall progress
    const overallResult = await query(
      `SELECT
        COUNT(DISTINCT e.id) as total_exams,
        AVG(e.total_score) as avg_score,
        MAX(e.cefr_level) as highest_level
       FROM exams e
       WHERE e.user_id = $1 AND e.status = 'completed'`,
      [userId]
    );

    res.json({
      success: true,
      analytics: {
        recent_exams: examsResult.rows,
        skill_performance: skillsResult.rows,
        overall: overallResult.rows[0]
      }
    });
  } catch (error) {
    logger.error('Get user analytics error', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics.'
    });
  }
};

// Get personalized study plan (FR-20 - UC-18)
const getStudyPlan = async (req, res) => {
  try {
    const userId = req.user.id;

    // Check for existing study plan
    const existingPlan = await query(
      `SELECT id, target_level, tasks, generated_at
       FROM study_plans
       WHERE user_id = $1
       ORDER BY generated_at DESC
       LIMIT 1`,
      [userId]
    );

    if (existingPlan.rows.length > 0) {
      return res.json({
        success: true,
        studyPlan: existingPlan.rows[0]
      });
    }

    // Get user's latest CEFR level and weak areas
    const latestExam = await query(
      `SELECT e.cefr_level, e.feedback_summary
       FROM exams e
       WHERE e.user_id = $1 AND e.status = 'completed'
       ORDER BY e.end_time DESC
       LIMIT 1`,
      [userId]
    );

    if (latestExam.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please complete at least one exam to generate a study plan.'
      });
    }

    // Get weak skills
    const weakSkills = await query(
      `SELECT q.type
       FROM responses r
       JOIN questions q ON r.question_id = q.id
       JOIN exams e ON r.exam_id = e.id
       WHERE e.user_id = $1 AND e.status = 'completed'
       GROUP BY q.type
       HAVING AVG(CASE WHEN r.is_correct THEN 1.0 ELSE 0.0 END) < 0.6
       ORDER BY AVG(CASE WHEN r.is_correct THEN 1.0 ELSE 0.0 END) ASC
       LIMIT 3`,
      [userId]
    );

    const weakAreas = weakSkills.rows.map(row => row.type);

    // Get user's learning purpose
    const userResult = await query(
      'SELECT learning_purpose FROM users WHERE id = $1',
      [userId]
    );

    const learningPurpose = userResult.rows[0]?.learning_purpose || 'general';

    // Generate study plan using AI
    const studyPlanData = await generateStudyPlan(
      latestExam.rows[0].cefr_level,
      weakAreas.length > 0 ? weakAreas : ['grammar', 'vocabulary'],
      learningPurpose
    );

    // Save study plan to database
    const savedPlan = await query(
      `INSERT INTO study_plans (user_id, target_level, tasks)
       VALUES ($1, $2, $3)
       RETURNING id, target_level, tasks, generated_at`,
      [userId, studyPlanData.target_level, JSON.stringify(studyPlanData)]
    );

    logger.logUserAction(userId, 'STUDY_PLAN_GENERATED', {
      targetLevel: studyPlanData.target_level
    });

    res.json({
      success: true,
      studyPlan: savedPlan.rows[0]
    });
  } catch (error) {
    logger.error('Get study plan error', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate study plan.'
    });
  }
};

// Delete user account
const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    await query('DELETE FROM users WHERE id = $1', [userId]);

    logger.logUserAction(userId, 'ACCOUNT_DELETED', {});

    res.json({
      success: true,
      message: 'Account deleted successfully.'
    });
  } catch (error) {
    logger.error('Delete account error', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete account.'
    });
  }
};

module.exports = {
  updateLearningPurpose,
  getExamHistory,
  getUserAnalytics,
  getStudyPlan,
  deleteAccount
};
