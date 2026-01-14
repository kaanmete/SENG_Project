const { body, validationResult } = require('express-validator');

// Validation middleware factory
const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  };
};

// Common validation rules
const validationRules = {
  register: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
  ],
  login: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],
  learningPurpose: [
    body('learning_purpose')
      .notEmpty()
      .isIn(['exam', 'business', 'travel', 'academic', 'general'])
      .withMessage('Invalid learning purpose')
  ],
  submitResponse: [
    body('exam_id')
      .isInt()
      .withMessage('Valid exam ID is required'),
    body('question_id')
      .isInt()
      .withMessage('Valid question ID is required'),
    body('user_answer')
      .notEmpty()
      .withMessage('Answer is required')
  ]
};

module.exports = {
  validate,
  validationRules
};
