const express = require('express');
const router = express.Router();
const examController = require('../controller/examController');
const { authenticate } = require('../middleware/auth');
const { aiLimiter } = require('../middleware/rateLimiter');

// All routes require authentication
router.use(authenticate);

router.post('/start', examController.startExam);
router.get('/active', examController.getActiveExam);
router.get('/test-pool', examController.getTestPool);
router.get('/:examId/next-question', aiLimiter, examController.getNextQuestion);
router.get('/:examId/question/:questionId/hint', aiLimiter, examController.getQuestionHint);
router.post('/:examId/submit-answer', examController.submitAnswer);

module.exports = router;
