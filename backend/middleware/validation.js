const { body } = require('express-validator');

// Validation rules for creating a post
const validateCreatePost = [
  body('username')
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage('Username must be between 2 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  
  body('caption')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Caption must be between 1 and 500 characters')
    .escape() // Sanitize HTML entities for security
];

// Validation rules for MongoDB ObjectId
const validateObjectId = (paramName = 'id') => [
  body(paramName).optional().isMongoId().withMessage(`Invalid ${paramName} format`),
  // For URL parameters
  (req, res, next) => {
    if (req.params[paramName] && !req.params[paramName].match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        error: {
          message: `Invalid ${paramName} format`
        }
      });
    }
    next();
  }
];

module.exports = {
  validateCreatePost,
  validateObjectId
};