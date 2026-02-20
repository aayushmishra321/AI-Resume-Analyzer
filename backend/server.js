import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import mongoSanitize from 'express-mongo-sanitize';
import fs from 'fs';

// Import routes
import authRoutes from './routes/auth.routes.js';
import resumeRoutes from './routes/resume.routes.js';
import analysisRoutes from './routes/analysis.routes.js';
import coverLetterRoutes from './routes/coverLetter.routes.js';
import userRoutes from './routes/user.routes.js';

// Import middleware
import { generalLimiter } from './middleware/rateLimiter.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import logger from './utils/logger.js';

// Load environment variables from parent directory
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

// Validate required environment variables
const requiredEnvVars = ['JWT_ACCESS_SECRET', 'GEMINI_API_KEY', 'CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  logger.error('Missing required environment variables:', missingEnvVars);
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5001;

// Create uploads directory if it doesn't exist (for temporary files only)
// WHY: Prevents server crash on first resume generation
const uploadsDir = join(__dirname, '..', 'uploads', 'resumes');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  logger.info('Created uploads directory:', uploadsDir);
}

// Security middleware - Helmet with proper configuration
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
  crossOriginEmbedderPolicy: false
}));

// MongoDB injection protection
// WHY: Prevents NoSQL injection attacks by sanitizing user input
app.use(mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    logger.warn('Sanitized potentially malicious input:', { key, path: req.path });
  }
}));

// CORS configuration - Production-safe
// WHY: Only allows requests from specified frontend URL
const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : [];

// In development, allow localhost
if (process.env.NODE_ENV !== 'production') {
  allowedOrigins.push('http://localhost:5173', 'http://localhost:3000');
}

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn('CORS blocked request from:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// General rate limiting
// WHY: Prevents API abuse and DDoS attacks
app.use('/api/', generalLimiter);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging and debugging
app.use((req, res, next) => {
  const startTime = Date.now();
  
  // Log incoming request
  logger.debug(`→ ${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
  
  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logLevel = res.statusCode >= 400 ? 'warn' : 'debug';
    
    logger[logLevel](`← ${req.method} ${req.path} ${res.statusCode}`, {
      duration: `${duration}ms`,
      status: res.statusCode
    });
  });
  
  next();
});

// Serve static files (uploaded resumes) - DEPRECATED: Moving to Cloudinary
// Keeping for backward compatibility during migration
app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

// MongoDB connection - Production-ready configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/resume-analyzer';

logger.info('🔌 Connecting to MongoDB...');

mongoose.connect(MONGODB_URI, {
  maxPoolSize: 10, // Connection pool size
  serverSelectionTimeoutMS: 5000, // Timeout for server selection
  socketTimeoutMS: 45000, // Socket timeout
  family: 4 // Use IPv4, skip trying IPv6
})
.then(() => {
  logger.info('✅ MongoDB connected successfully');
  logger.info(`📊 Database: ${mongoose.connection.name}`);
})
.catch((err) => {
  logger.error('❌ MongoDB initial connection error', {
    error: err.message,
    stack: err.stack,
    uri: MONGODB_URI.replace(/\/\/.*@/, '//***:***@') // Hide credentials in logs
  });
  logger.error('💡 Make sure MongoDB is running on localhost:27017');
  logger.error('💡 Run: mongod --dbpath /path/to/data');
  process.exit(1); // Exit only on initial connection failure
});

// Handle MongoDB connection errors after initial connection
mongoose.connection.on('error', (err) => {
  logger.error('❌ MongoDB connection error after startup', {
    error: err.message,
    stack: err.stack
  });
  // Don't exit - let the app try to reconnect
});

mongoose.connection.on('disconnected', () => {
  logger.warn('⚠️  MongoDB disconnected - will attempt to reconnect');
});

mongoose.connection.on('reconnected', () => {
  logger.info('✅ MongoDB reconnected successfully');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/cover-letter', coverLetterRoutes);
app.use('/api/user', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Resume Analyzer API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler - Must be last
app.use(notFoundHandler);

// Start server
const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🌐 CORS allowed origins: ${allowedOrigins.join(', ')}`);
});

// Graceful shutdown handling
// WHY: Ensures all connections are closed properly before shutdown
const gracefulShutdown = async (signal) => {
  logger.info(`${signal} received, closing server gracefully`);
  
  server.close(() => {
    logger.info('HTTP server closed');
  });

  // Close MongoDB connection without callback (Mongoose 8+ doesn't accept callbacks)
  try {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed');
    process.exit(0);
  } catch (err) {
    logger.error('Error closing MongoDB connection', {
      error: err.message,
      stack: err.stack
    });
    process.exit(1);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Global error handlers - Production-safe pattern
// WHY: Prevents server crashes from unhandled errors while logging them properly

// Handle uncaught exceptions - FATAL, must exit
process.on('uncaughtException', (err) => {
  logger.error('🔴 FATAL: Uncaught Exception', {
    error: err.message,
    stack: err.stack,
    name: err.name
  });
  
  // Uncaught exceptions are fatal - must restart
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

// Handle unhandled promise rejections - LOG but DON'T exit
// WHY: Most promise rejections are not fatal (failed API calls, validation errors, etc.)
// Only exit if it's a critical system error
process.on('unhandledRejection', (reason, promise) => {
  // Properly extract error information
  const errorInfo = {
    message: reason?.message || String(reason),
    stack: reason?.stack || 'No stack trace available',
    name: reason?.name || 'UnhandledRejection',
    promise: promise.toString()
  };
  
  logger.error('⚠️  Unhandled Promise Rejection', errorInfo);
  
  // Check if this is a critical error that requires shutdown
  const criticalErrors = [
    'ECONNREFUSED', // Database connection refused
    'ENOTFOUND', // DNS lookup failed
    'FATAL', // Explicitly marked as fatal
    'MONGODB_CONNECTION_FAILED' // MongoDB connection failed after startup
  ];
  
  const isCritical = criticalErrors.some(errType => 
    errorInfo.message.includes(errType) || errorInfo.name.includes(errType)
  );
  
  if (isCritical) {
    logger.error('🔴 CRITICAL: Shutting down due to critical error');
    gracefulShutdown('CRITICAL_UNHANDLED_REJECTION');
  } else {
    logger.warn('⚠️  Non-critical rejection - server continues running');
    logger.warn('💡 This error should be handled in the code to prevent this warning');
  }
});
