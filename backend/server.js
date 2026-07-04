/**
 * RCA Academy Pro Backend — Entry Point
 *
 * Sets up Express application with security middleware, request logging,
 * route mounting, and global error handling. Connects to MongoDB on startup.
 *
 * @module server
 */

// Load environment variables FIRST (side-effect import, runs before all other imports)
import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';

// Validate critical env vars
if (!process.env.PORT) {
  console.warn('⚠️  WARNING: PORT not set in .env — defaulting to 5000');
}

// Import config, models (registers schemas), routes, and error handler
import connectDB from './config/db.js';
import './models/User.js';
import './models/Student.js';
import './models/Batch.js';
import './models/Match.js';
import './models/Attendance.js';
import './models/Performance.js';

import authRoutes from './routes/auth.js';
import studentRoutes from './routes/students.js';
import batchRoutes from './routes/batches.js';
import matchRoutes from './routes/matches.js';
import attendanceRoutes from './routes/attendance.js';
import performanceRoutes from './routes/performance.js';
import userRoutes from './routes/users.js';
import healthRoutes from './routes/health.js';

import errorHandler from './middleware/errorHandler.js';

// --- APP SETUP ---

const app = express();

console.log('\n--- RAJENDRA CRICKET ACADEMY PRO BACKEND ---');

// --- GLOBAL MIDDLEWARE ---

app.use(helmet());                          // Secure HTTP headers
app.use(cors());                            // Cross-origin requests
app.use(express.json());                    // JSON body parsing
app.use(mongoSanitize());                   // Prevent NoSQL injection
app.use(morgan('dev'));                     // HTTP request logging

// --- ROUTE MOUNTING ---

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/batches', batchRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/users', userRoutes);
app.use('/api/health', healthRoutes);

// Mount stats at /api/stats (delegates to health router's /stats sub-route)
app.use('/api', healthRoutes);

// --- GLOBAL ERROR HANDLER ---

app.use(errorHandler);

// --- START SERVER ---

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`\nSUCCESS: RCA RBAC Backend active at port ${PORT}`));
});
