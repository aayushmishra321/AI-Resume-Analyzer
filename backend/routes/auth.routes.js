import express from 'express';
import User from '../models/User.model.js';
import jwt from 'jsonwebtoken';
import { authenticate } from '../middleware/auth.middleware.js';
import { authValidators, validate } from '../middleware/validators.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '7d' }
  );
};

// Register
router.post('/register', 
  authValidators.register,
  validate,
  asyncHandler(async (req, res) => {
    const { fullName, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
        errorCode: 'EMAIL_EXISTS'
      });
    }

    // Create user
    const user = await User.create({
      fullName,
      email,
      password
    });

    const token = generateToken(user._id);

    logger.info('User registered:', { userId: user._id, email: user.email });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user,
        token
      }
    });
  })
);

// Login - with rate limiting to prevent brute force
router.post('/login',
  authLimiter,
  authValidators.login,
  validate,
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find user with password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        errorCode: 'INVALID_CREDENTIALS'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      logger.warn('Failed login attempt:', { email, ip: req.ip });
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        errorCode: 'INVALID_CREDENTIALS'
      });
    }

    const token = generateToken(user._id);

    // Remove password from response
    user.password = undefined;

    logger.info('User logged in:', { userId: user._id, email: user.email });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user,
        token
      }
    });
  })
);

// Get current user
router.get('/me', authenticate, asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      user: req.user
    }
  });
}));

export default router;
