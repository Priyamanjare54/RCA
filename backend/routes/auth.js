import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { signup, login } from '../controllers/authController.js';
import { requireFields } from '../middleware/validate.js';

const router = Router();

/**
 * Rate limiter for auth routes — prevents brute-force attacks.
 * Allows 15 requests per 15-minute window per IP.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests, please try again later' }
});

/** POST /api/auth/signup — Register a new user */
router.post('/signup', authLimiter, requireFields('username', 'password', 'name'), signup);

/** POST /api/auth/login — Authenticate and receive JWT */
router.post('/login', authLimiter, requireFields('username', 'password'), login);

export default router;
