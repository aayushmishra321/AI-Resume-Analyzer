import { body, param, query, validationResult } from 'express-validator';

/**
 * Validation middleware to check for validation errors
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

/**
 * Auth validation rules
 */
export const authValidators = {
  register: [
    body('fullName')
      .trim()
      .notEmpty().withMessage('Full name is required')
      .isLength({ min: 2, max: 100 }).withMessage('Full name must be between 2 and 100 characters')
      .matches(/^[a-zA-Z\s'-]+$/).withMessage('Full name can only contain letters, spaces, hyphens, and apostrophes'),
    
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Valid email is required')
      .normalizeEmail()
      .isLength({ max: 255 }).withMessage('Email is too long'),
    
    body('password')
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 8, max: 128 }).withMessage('Password must be between 8 and 128 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)')
  ],

  login: [
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Valid email is required')
      .normalizeEmail(),
    
    body('password')
      .notEmpty().withMessage('Password is required')
  ]
};

/**
 * Resume validation rules
 */
export const resumeValidators = {
  create: [
    body('fullName')
      .trim()
      .notEmpty().withMessage('Full name is required')
      .isLength({ min: 2, max: 100 }).withMessage('Full name must be between 2 and 100 characters'),
    
    body('email')
      .optional()
      .trim()
      .isEmail().withMessage('Valid email is required')
      .normalizeEmail()
      .isLength({ max: 255 }).withMessage('Email is too long'),
    
    body('phone')
      .optional()
      .trim()
      .matches(/^[\d\s\-\+\(\)]+$/).withMessage('Invalid phone number format')
      .isLength({ max: 20 }).withMessage('Phone number is too long'),
    
    body('location')
      .optional()
      .trim()
      .isLength({ max: 200 }).withMessage('Location is too long'),
    
    body('summary')
      .optional()
      .trim()
      .isLength({ max: 2000 }).withMessage('Summary must not exceed 2000 characters'),
    
    body('experience')
      .optional()
      .isArray({ max: 20 }).withMessage('Maximum 20 experience entries allowed'),
    
    body('experience.*.title')
      .optional()
      .trim()
      .isLength({ max: 200 }).withMessage('Job title is too long'),
    
    body('experience.*.company')
      .optional()
      .trim()
      .isLength({ max: 200 }).withMessage('Company name is too long'),
    
    body('experience.*.description')
      .optional()
      .trim()
      .isLength({ max: 2000 }).withMessage('Job description is too long'),
    
    body('education')
      .optional()
      .isArray({ max: 10 }).withMessage('Maximum 10 education entries allowed'),
    
    body('education.*.degree')
      .optional()
      .trim()
      .isLength({ max: 200 }).withMessage('Degree name is too long'),
    
    body('education.*.school')
      .optional()
      .trim()
      .isLength({ max: 200 }).withMessage('School name is too long'),
    
    body('skills')
      .optional()
      .isString().withMessage('Skills must be a string')
      .isLength({ max: 2000 }).withMessage('Skills must not exceed 2000 characters')
  ],

  getById: [
    param('id')
      .isMongoId().withMessage('Invalid resume ID')
  ],

  delete: [
    param('id')
      .isMongoId().withMessage('Invalid resume ID')
  ]
};

/**
 * Analysis validation rules
 */
export const analysisValidators = {
  analyze: [
    param('resumeId')
      .isMongoId().withMessage('Invalid resume ID'),
    
    body('jobDescription')
      .optional()
      .trim()
      .isLength({ max: 10000 }).withMessage('Job description is too long (max 10000 characters)')
  ],

  getHistory: [
    param('resumeId')
      .isMongoId().withMessage('Invalid resume ID')
  ]
};

/**
 * Cover Letter validation rules
 */
export const coverLetterValidators = {
  generate: [
    body('jobTitle')
      .trim()
      .notEmpty().withMessage('Job title is required')
      .isLength({ min: 2, max: 200 }).withMessage('Job title must be between 2 and 200 characters'),
    
    body('companyName')
      .trim()
      .notEmpty().withMessage('Company name is required')
      .isLength({ min: 2, max: 200 }).withMessage('Company name must be between 2 and 200 characters'),
    
    body('hiringManager')
      .optional()
      .trim()
      .isLength({ max: 100 }).withMessage('Hiring manager name is too long'),
    
    body('jobDescription')
      .trim()
      .notEmpty().withMessage('Job description is required')
      .isLength({ min: 10, max: 10000 }).withMessage('Job description must be between 10 and 10000 characters'),
    
    body('tone')
      .optional()
      .isIn(['professional', 'enthusiastic', 'formal', 'creative']).withMessage('Invalid tone value'),
    
    body('resumeId')
      .optional()
      .isMongoId().withMessage('Invalid resume ID')
  ],

  getById: [
    param('id')
      .isMongoId().withMessage('Invalid cover letter ID')
  ],

  delete: [
    param('id')
      .isMongoId().withMessage('Invalid cover letter ID')
  ]
};

/**
 * User validation rules
 */
export const userValidators = {
  updateProfile: [
    body('fullName')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 }).withMessage('Full name must be between 2 and 100 characters'),
    
    body('phone')
      .optional()
      .trim()
      .matches(/^[\d\s\-\+\(\)]+$/).withMessage('Invalid phone number format')
      .isLength({ max: 20 }).withMessage('Phone number is too long'),
    
    body('location')
      .optional()
      .trim()
      .isLength({ max: 200 }).withMessage('Location is too long')
  ],

  changePassword: [
    body('currentPassword')
      .notEmpty().withMessage('Current password is required'),
    
    body('newPassword')
      .notEmpty().withMessage('New password is required')
      .isLength({ min: 8, max: 128 }).withMessage('Password must be between 8 and 128 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)')
  ]
};

/**
 * Pagination validation
 */
export const paginationValidators = [
  query('page')
    .optional()
    .isInt({ min: 1, max: 10000 }).withMessage('Page must be a positive integer')
    .toInt(),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
    .toInt()
];
