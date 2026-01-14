const express = require('express');
const router = express.Router();
const assessmentController = require('../controller/assessmentController');
const { authenticate } = require('../middleware/auth');
const { aiLimiter } = require('../middleware/rateLimiter');

// All routes require authentication
router.use(authenticate);

router.post('/:examId/submit', assessmentController.submitExam);
router.post('/:examId/analyze', assessmentController.analyzeExam);
router.get('/:examId/results', assessmentController.getExamResults);
router.post('/writing-feedback', aiLimiter, assessmentController.submitWriting);
router.post('/speaking-feedback', aiLimiter, assessmentController.submitSpeaking);

module.exports = router;
