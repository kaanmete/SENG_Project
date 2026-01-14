const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const { authenticate } = require('../middleware/auth');
const { validate, validationRules } = require('../utils/validation');

// All routes require authentication
router.use(authenticate);

router.put('/learning-purpose', validate(validationRules.learningPurpose), userController.updateLearningPurpose);
router.get('/exam-history', userController.getExamHistory);
router.get('/analytics', userController.getUserAnalytics);
router.get('/study-plan', userController.getStudyPlan);
router.delete('/account', userController.deleteAccount);

module.exports = router;
