require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const logger = require('./utils/logger');
const { apiLimiter } = require('./middleware/rateLimiter');

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO for real-time features (NFR-04)
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'https://frontend-production-77355.up.railway.app',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(helmet()); // Security headers
app.use(compression()); // Response compression
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://frontend-production-77355.up.railway.app',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  }));
} else {
  app.use(morgan('dev'));
}

// Apply rate limiting to all routes
app.use('/api/', apiLimiter);

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const examRoutes = require('./routes/examRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
const adminRoutes = require('./routes/adminRoutes');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint (for Railway and monitoring)
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'AI Diagnostic Engine API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      exams: '/api/exams',
      assessments: '/api/assessments',
      admin: '/api/admin',
      health: '/health'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method
  });

  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production'
      ? 'An internal error occurred'
      : err.message
  });
});

// WebSocket connection handling (NFR-04 - Real-time scoring and updates)
io.on('connection', (socket) => {
  logger.info('WebSocket client connected', { socketId: socket.id });

  // Join exam room
  socket.on('join-exam', (examId) => {
    socket.join(`exam-${examId}`);
    logger.debug('User joined exam room', { examId, socketId: socket.id });
  });

  // Leave exam room
  socket.on('leave-exam', (examId) => {
    socket.leave(`exam-${examId}`);
    logger.debug('User left exam room', { examId, socketId: socket.id });
  });

  // Real-time score update
  socket.on('score-update', (data) => {
    const { examId, score, progress } = data;
    io.to(`exam-${examId}`).emit('score-updated', {
      score,
      progress,
      timestamp: new Date().toISOString()
    });
  });

  // Question answered notification
  socket.on('question-answered', (data) => {
    const { examId, questionNumber, isCorrect } = data;
    io.to(`exam-${examId}`).emit('progress-update', {
      questionNumber,
      isCorrect,
      timestamp: new Date().toISOString()
    });
  });

  // Disconnect handler
  socket.on('disconnect', () => {
    logger.info('WebSocket client disconnected', { socketId: socket.id });
  });

  // Error handler
  socket.on('error', (error) => {
    logger.error('WebSocket error', { error: error.message, socketId: socket.id });
  });
});

// Make io available to routes if needed
app.set('io', io);

// Graceful shutdown
const gracefulShutdown = (signal) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);

  server.close(() => {
    logger.info('HTTP server closed');

    // Close database connections
    const { pool } = require('./config/database');
    pool.end(() => {
      logger.info('Database pool closed');
      process.exit(0);
    });
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', { error: error.message, stack: error.stack });
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', { reason, promise });
});

// Start server
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  logger.info(`
TPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPW
Q                                                          Q
Q       =� AI Diagnostic Engine API Server Running        Q
Q                                                          Q
Q       Environment: ${process.env.NODE_ENV || 'development'}                              Q
Q       Port: ${PORT}                                           Q
Q       URL: http://localhost:${PORT}                         Q
Q                                                          Q
Q       API Documentation: http://localhost:${PORT}/         Q
Q       Health Check: http://localhost:${PORT}/health        Q
Q                                                          Q
ZPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP]
  `);
});

// Export for testing
module.exports = { app, server, io };
