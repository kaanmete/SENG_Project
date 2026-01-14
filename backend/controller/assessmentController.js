const { query, transaction } = require('../config/database');
const {
  calculateCEFRLevel,
  generateWritingFeedback,
  generateSpeakingFeedback
} = require('../services/aiEngineService');
const logger = require('../utils/logger');

// Submit exam for grading (FR-08 - UC-23)
const submitExam = async (req, res) => {
  try {
    const { examId } = req.params;
    const userId = req.user.id;

    // Verify exam belongs to user and is in progress
    const examResult = await query(
      'SELECT id, user_id, status FROM exams WHERE id = $1',
      [examId]
    );

    if (examResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found.'
      });
    }

    const exam = examResult.rows[0];

    if (exam.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.'
      });
    }

    if (exam.status !== 'in_progress') {
      return res.status(400).json({
        success: false,
        message: 'Exam is not in progress or already submitted.'
      });
    }

    // Update exam status
    await query(
      'UPDATE exams SET status = $1, end_time = NOW() WHERE id = $2',
      ['pending_analysis', examId]
    );

    logger.logUserAction(userId, 'EXAM_SUBMITTED', { examId });

    // Trigger analysis asynchronously (we'll handle this in analyzeExam endpoint)
    res.json({
      success: true,
      message: 'Exam submitted successfully! Your results are being analyzed.',
      exam_id: examId
    });
  } catch (error) {
    logger.error('Submit exam error', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit exam.'
    });
  }
};

// Analyze exam responses and calculate scores (FR-09, FR-10 - UC-24, UC-25)
const analyzeExam = async (req, res) => {
  try {
    const { examId } = req.params;
    const userId = req.user.id;

    // Verify exam
    const examResult = await query(
      'SELECT id, user_id, status FROM exams WHERE id = $1',
      [examId]
    );

    if (examResult.rows.length === 0 || examResult.rows[0].user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.'
      });
    }

    // Get all responses with questions
    const responsesResult = await query(
      `SELECT r.*, q.type as skill_type, q.difficulty_level
       FROM responses r
       JOIN questions q ON r.question_id = q.id
       WHERE r.exam_id = $1`,
      [examId]
    );

    if (responsesResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No responses found for this exam.'
      });
    }

    const responses = responsesResult.rows;

    // Calculate sub-skill scores (FR-09)
    const skillScores = {};
    const skillTypes = ['grammar', 'vocabulary', 'reading', 'listening', 'writing', 'speaking'];

    skillTypes.forEach(skill => {
      const skillResponses = responses.filter(r => r.skill_type === skill);
      if (skillResponses.length > 0) {
        const correctCount = skillResponses.filter(r => r.is_correct).length;
        skillScores[skill] = Math.round((correctCount / skillResponses.length) * 100);
      } else {
        skillScores[skill] = 0;
      }
    });

    // Calculate overall CEFR level (FR-10)
    const cefrLevel = calculateCEFRLevel(skillScores);

    // Calculate total score
    const totalCorrect = responses.filter(r => r.is_correct).length;
    const totalScore = Math.round((totalCorrect / responses.length) * 100);

    // Generate feedback summary
    const weakSkills = Object.entries(skillScores)
      .filter(([_, score]) => score < 60)
      .map(([skill, _]) => skill);

    const strongSkills = Object.entries(skillScores)
      .filter(([_, score]) => score >= 80)
      .map(([skill, _]) => skill);

    const feedbackSummary = `
CEFR Level: ${cefrLevel}
Overall Score: ${totalScore}%

Strong Areas: ${strongSkills.length > 0 ? strongSkills.join(', ') : 'Continue practicing'}
Areas for Improvement: ${weakSkills.length > 0 ? weakSkills.join(', ') : 'Great job! Keep it up'}

Skill Breakdown:
${Object.entries(skillScores).map(([skill, score]) => `- ${skill}: ${score}%`).join('\n')}
    `.trim();

    // Update exam with results
    await query(
      `UPDATE exams
       SET status = $1, total_score = $2, cefr_level = $3, feedback_summary = $4
       WHERE id = $5`,
      ['completed', totalScore, cefrLevel, feedbackSummary, examId]
    );

    logger.logAIDecision(examId, userId, 'EXAM_ANALYZED', {
      cefrLevel,
      totalScore,
      skillScores
    });

    res.json({
      success: true,
      results: {
        exam_id: examId,
        cefr_level: cefrLevel,
        total_score: totalScore,
        skill_scores: skillScores,
        feedback_summary: feedbackSummary,
        total_questions: responses.length,
        correct_answers: totalCorrect
      }
    });
  } catch (error) {
    logger.error('Analyze exam error', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze exam.'
    });
  }
};

// Get exam results (FR-11 - UC-07)
const getExamResults = async (req, res) => {
  try {
    const { examId } = req.params;
    const userId = req.user.id;

    // Get exam details
    const examResult = await query(
      `SELECT id, user_id, exam_type, start_time, end_time, status, total_score, cefr_level, feedback_summary
       FROM exams
       WHERE id = $1`,
      [examId]
    );

    if (examResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found.'
      });
    }

    const exam = examResult.rows[0];

    if (exam.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.'
      });
    }

    if (exam.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Exam results are not yet available.'
      });
    }

    // Get detailed responses
    const responsesResult = await query(
      `SELECT r.*, q.content, q.type, q.options, q.correct_answer
       FROM responses r
       JOIN questions q ON r.question_id = q.id
       WHERE r.exam_id = $1
       ORDER BY r.id`,
      [examId]
    );

    // Calculate skill breakdown
    const skillBreakdown = {};
    responsesResult.rows.forEach(response => {
      if (!skillBreakdown[response.type]) {
        skillBreakdown[response.type] = { total: 0, correct: 0 };
      }
      skillBreakdown[response.type].total++;
      if (response.is_correct) {
        skillBreakdown[response.type].correct++;
      }
    });

    res.json({
      success: true,
      results: {
        exam: {
          id: exam.id,
          exam_type: exam.exam_type,
          start_time: exam.start_time,
          end_time: exam.end_time,
          cefr_level: exam.cefr_level,
          total_score: exam.total_score,
          feedback_summary: exam.feedback_summary
        },
        responses: responsesResult.rows.map(r => ({
          question_id: r.question_id,
          question: r.content,
          type: r.type,
          user_answer: r.user_answer,
          correct_answer: r.correct_answer,
          is_correct: r.is_correct,
          ai_feedback: r.ai_feedback,
          time_taken: r.time_taken_seconds
        })),
        skill_breakdown: Object.entries(skillBreakdown).map(([skill, data]) => ({
          skill,
          correct: data.correct,
          total: data.total,
          percentage: Math.round((data.correct / data.total) * 100)
        }))
      }
    });
  } catch (error) {
    logger.error('Get exam results error', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch exam results.'
    });
  }
};

// Submit writing sample for feedback (FR-15 - UC-13)
const submitWriting = async (req, res) => {
  try {
    const { text, topic } = req.body;
    const userId = req.user.id;

    if (!text || text.length < 50) {
      return res.status(400).json({
        success: false,
        message: 'Writing sample must be at least 50 characters long.'
      });
    }

    // Get user's learning purpose
    const userResult = await query(
      'SELECT learning_purpose FROM users WHERE id = $1',
      [userId]
    );

    const purpose = userResult.rows[0]?.learning_purpose || 'general';

    // Generate AI feedback
    const feedback = await generateWritingFeedback(text, purpose);

    logger.logUserAction(userId, 'WRITING_SUBMITTED', {
      textLength: text.length,
      topic
    });

    res.json({
      success: true,
      feedback
    });
  } catch (error) {
    logger.error('Submit writing error', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze writing sample.'
    });
  }
};

// Submit speaking sample for feedback (FR-14 - UC-14)
const submitSpeaking = async (req, res) => {
  try {
    const { transcription, topic } = req.body;
    const userId = req.user.id;

    if (!transcription || transcription.length < 20) {
      return res.status(400).json({
        success: false,
        message: 'Speaking transcription is too short.'
      });
    }

    // Get user's learning purpose
    const userResult = await query(
      'SELECT learning_purpose FROM users WHERE id = $1',
      [userId]
    );

    const purpose = userResult.rows[0]?.learning_purpose || 'general';

    // Generate AI feedback
    const feedback = await generateSpeakingFeedback(transcription, purpose);

    logger.logUserAction(userId, 'SPEAKING_SUBMITTED', {
      transcriptionLength: transcription.length,
      topic
    });

    res.json({
      success: true,
      feedback
    });
  } catch (error) {
    logger.error('Submit speaking error', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze speaking sample.'
    });
  }
};

module.exports = {
  submitExam,
  analyzeExam,
  getExamResults,
  submitWriting,
  submitSpeaking
};
