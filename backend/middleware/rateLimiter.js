import rateLimit from 'express-rate-limit';

/**
 * General API rate limiter
 * Prevents abuse of API endpoints
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window per IP
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    errorCode: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting for health check
  skip: (req) => req.path === '/api/health'
});

/**
 * Strict rate limiter for authentication endpoints
 * Prevents brute force attacks
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 login attempts per window per IP
  message: {
    success: false,
    message: 'Too many login attempts, please try again after 15 minutes.',
    errorCode: 'AUTH_RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true // Don't count successful logins
});

/**
 * Rate limiter for AI analysis endpoints
 * Prevents API quota abuse and cost overruns
 * WHY: Each AI call costs money and uses API quota
 */
export const aiAnalysisLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 analyses per hour per IP
  message: {
    success: false,
    message: 'You have reached the maximum number of analyses per hour. Please try again later.',
    errorCode: 'ANALYSIS_RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Rate limiter for cover letter generation
 * Prevents AI API abuse
 */
export const coverLetterLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 15, // 15 cover letters per hour per IP
  message: {
    success: false,
    message: 'You have reached the maximum number of cover letter generations per hour. Please try again later.',
    errorCode: 'COVER_LETTER_RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Rate limiter for file uploads
 * Prevents storage abuse
 */
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 uploads per hour per IP
  message: {
    success: false,
    message: 'You have reached the maximum number of uploads per hour. Please try again later.',
    errorCode: 'UPLOAD_RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false
});
