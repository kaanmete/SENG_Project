const { query, transaction } = require('../config/database');
const { generateAdaptiveQuestion, generateHint } = require('../services/aiEngineService');
const logger = require('../utils/logger');

// Start new exam (FR-05 - UC-03)
const startExam = async (req, res) => {
  try {
    const userId = req.user.id;
    const { exam_type } = req.body; // 'placement', 'practice', 'full'

    // Get user's learning purpose
    const userResult = await query(
      'SELECT learning_purpose FROM users WHERE id = $1',
      [userId]
    );

    const learningPurpose = userResult.rows[0]?.learning_purpose || 'general';

    // Create new exam session
    const examResult = await query(
      `INSERT INTO exams (user_id, exam_type, status, start_time)
       VALUES ($1, $2, $3, NOW())
       RETURNING id, exam_type, start_time, status`,
      [userId, exam_type || 'practice', 'in_progress']
    );

    const exam = examResult.rows[0];

    logger.logUserAction(userId, 'EXAM_STARTED', {
      examId: exam.id,
      examType: exam.exam_type
    });

    res.json({
      success: true,
      message: 'Exam started successfully!',
      exam: {
        id: exam.id,
        exam_type: exam.exam_type,
        start_time: exam.start_time,
        learning_purpose: learningPurpose
      }
    });
  } catch (error) {
    logger.error('Start exam error', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start exam.'
    });
  }
};

// Get next adaptive question (FR-06 - UC-03)
const getNextQuestion = async (req, res) => {
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
        message: 'Exam is not in progress.'
      });
    }

    // Get user's previous responses in this exam
    const responsesResult = await query(
      `SELECT r.is_correct, q.type, q.difficulty_level
       FROM responses r
       JOIN questions q ON r.question_id = q.id
       WHERE r.exam_id = $1
       ORDER BY r.id DESC
       LIMIT 5`,
      [examId]
    );

    const previousAnswers = responsesResult.rows;

    // Calculate adaptive difficulty level based on performance
    let difficultyLevel = 3; // Start at B1 (medium)

    if (previousAnswers.length > 0) {
      const recentCorrect = previousAnswers.slice(0, 3).filter(a => a.is_correct).length;
      const recentTotal = Math.min(previousAnswers.length, 3);

      if (recentCorrect / recentTotal >= 0.67) {
        difficultyLevel = Math.min(6, (previousAnswers[0]?.difficulty_level || 3) + 1);
      } else if (recentCorrect / recentTotal <= 0.33) {
        difficultyLevel = Math.max(1, (previousAnswers[0]?.difficulty_level || 3) - 1);
      } else {
        difficultyLevel = previousAnswers[0]?.difficulty_level || 3;
      }
    }

    // Determine next skill to test (rotate through skills)
    const skillTypes = ['grammar', 'vocabulary', 'reading', 'listening'];
    const lastSkillType = previousAnswers[0]?.type || null;
    let nextSkillType = skillTypes[previousAnswers.length % skillTypes.length];

    if (lastSkillType) {
      const lastIndex = skillTypes.indexOf(lastSkillType);
      nextSkillType = skillTypes[(lastIndex + 1) % skillTypes.length];
    }

    // Get user's learning purpose
    const userResult = await query(
      'SELECT learning_purpose FROM users WHERE id = $1',
      [userId]
    );
    const learningPurpose = userResult.rows[0]?.learning_purpose || 'general';

    // Check if we have a suitable question in the database first
    const existingQuestion = await query(
      `SELECT id, type, difficulty_level, content, options, correct_answer
       FROM questions
       WHERE type = $1 AND difficulty_level = $2
       ORDER BY RANDOM()
       LIMIT 1`,
      [nextSkillType, difficultyLevel]
    );

    let question;

    if (existingQuestion.rows.length > 0) {
      // Use existing question from database
      question = existingQuestion.rows[0];
    } else {
      // Generate new question using AI (FR-07)
      try {
        const aiQuestion = await generateAdaptiveQuestion(
          nextSkillType,
          difficultyLevel,
          learningPurpose,
          previousAnswers.map(a => ({ correct: a.is_correct }))
        );

        // Save generated question to database
        const savedQuestion = await query(
          `INSERT INTO questions (type, difficulty_level, content, options, correct_answer)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING id, type, difficulty_level, content, options`,
          [
            nextSkillType,
            difficultyLevel,
            aiQuestion.question,
            JSON.stringify(aiQuestion.options),
            aiQuestion.correct_answer
          ]
        );

        question = savedQuestion.rows[0];
      } catch (aiError) {
        logger.error('AI question generation failed', aiError);
        return res.status(500).json({
          success: false,
          message: 'Failed to generate question. Please try again.'
        });
      }
    }

    logger.logAIDecision(examId, userId, 'QUESTION_SELECTED', {
      questionId: question.id,
      skillType: nextSkillType,
      difficultyLevel
    });

    res.json({
      success: true,
      question: {
        id: question.id,
        type: question.type,
        difficulty_level: question.difficulty_level,
        content: question.content,
        options: question.options,
        // Don't send correct_answer to client
        question_number: previousAnswers.length + 1
      }
    });
  } catch (error) {
    logger.error('Get next question error', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get next question.'
    });
  }
};

// Get hint for current question (FR-17 - UC-06)
const getQuestionHint = async (req, res) => {
  try {
    const { examId, questionId } = req.params;
    const userId = req.user.id;

    // Verify exam belongs to user
    const examResult = await query(
      'SELECT user_id, status FROM exams WHERE id = $1',
      [examId]
    );

    if (examResult.rows.length === 0 || examResult.rows[0].user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.'
      });
    }

    // Get question details
    const questionResult = await query(
      'SELECT id, content, type, difficulty_level FROM questions WHERE id = $1',
      [questionId]
    );

    if (questionResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Question not found.'
      });
    }

    const question = questionResult.rows[0];

    // Generate hint using AI (FR-17)
    const hint = await generateHint(
      question.content,
      question.type,
      question.difficulty_level
    );

    logger.logUserAction(userId, 'HINT_REQUESTED', {
      examId,
      questionId
    });

    res.json({
      success: true,
      hint
    });
  } catch (error) {
    logger.error('Get hint error', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate hint.'
    });
  }
};

// Submit answer to question
const submitAnswer = async (req, res) => {
  try {
    const { examId } = req.params;
    const { question_id, user_answer, time_taken_seconds } = req.body;
    const userId = req.user.id;

    // Verify exam
    const examResult = await query(
      'SELECT user_id, status FROM exams WHERE id = $1',
      [examId]
    );

    if (examResult.rows.length === 0 || examResult.rows[0].user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.'
      });
    }

    if (examResult.rows[0].status !== 'in_progress') {
      return res.status(400).json({
        success: false,
        message: 'Exam is not in progress.'
      });
    }

    // Get question and correct answer
    const questionResult = await query(
      'SELECT id, content, correct_answer, type FROM questions WHERE id = $1',
      [question_id]
    );

    if (questionResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Question not found.'
      });
    }

    const question = questionResult.rows[0];
    const isCorrect = user_answer.trim().toUpperCase() === question.correct_answer.trim().toUpperCase();

    // Save response
    await query(
      `INSERT INTO responses (exam_id, question_id, user_answer, is_correct, time_taken_seconds)
       VALUES ($1, $2, $3, $4, $5)`,
      [examId, question_id, user_answer, isCorrect, time_taken_seconds || 0]
    );

    logger.logUserAction(userId, 'ANSWER_SUBMITTED', {
      examId,
      questionId: question_id,
      isCorrect
    });

    res.json({
      success: true,
      is_correct: isCorrect,
      message: isCorrect ? 'Correct!' : 'Incorrect'
    });
  } catch (error) {
    logger.error('Submit answer error', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit answer.'
    });
  }
};

// Get active exam for user
const getActiveExam = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await query(
      `SELECT id, exam_type, start_time, status
       FROM exams
       WHERE user_id = $1 AND status = 'in_progress'
       ORDER BY start_time DESC
       LIMIT 1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.json({
        success: true,
        exam: null
      });
    }

    // Get question count
    const countResult = await query(
      'SELECT COUNT(*) as count FROM responses WHERE exam_id = $1',
      [result.rows[0].id]
    );

    const exam = {
      ...result.rows[0],
      questions_answered: parseInt(countResult.rows[0].count)
    };

    res.json({
      success: true,
      exam
    });
  } catch (error) {
    logger.error('Get active exam error', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch active exam.'
    });
  }
};

// Get test pool for user (FR-18, FR-21 - UC-16, UC-17)
const getTestPool = async (req, res) => {
  try {
    const userId = req.user.id;
    const { level, skill, tags } = req.query;

    let queryText = `
      SELECT DISTINCT q.id, q.type, q.difficulty_level, q.tags,
        CASE WHEN r.question_id IS NOT NULL THEN true ELSE false END as completed
      FROM questions q
      LEFT JOIN (
        SELECT DISTINCT r.question_id
        FROM responses r
        JOIN exams e ON r.exam_id = e.id
        WHERE e.user_id = $1
      ) r ON q.id = r.question_id
      WHERE 1=1
    `;

    const params = [userId];
    let paramCount = 1;

    if (level) {
      paramCount++;
      queryText += ` AND q.difficulty_level = $${paramCount}`;
      params.push(parseInt(level));
    }

    if (skill) {
      paramCount++;
      queryText += ` AND q.type = $${paramCount}`;
      params.push(skill);
    }

    if (tags) {
      paramCount++;
      queryText += ` AND q.tags ILIKE $${paramCount}`;
      params.push(`%${tags}%`);
    }

    queryText += ' ORDER BY q.difficulty_level, q.type LIMIT 50';

    const result = await query(queryText, params);

    res.json({
      success: true,
      tests: result.rows
    });
  } catch (error) {
    logger.error('Get test pool error', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch test pool.'
    });
  }
};

module.exports = {
  startExam,
  getNextQuestion,
  getQuestionHint,
  submitAnswer,
  getActiveExam,
  getTestPool
};
