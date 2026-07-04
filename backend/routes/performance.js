import { Router } from 'express';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';
import { requireFields } from '../middleware/validate.js';
import * as performanceController from '../controllers/performanceController.js';

const router = Router();

/** POST /api/performance — Save a skill or fitness performance record */
router.post('/', authenticateToken, authorizeRole(['Admin', 'Coach']), requireFields('studentId', 'date'), performanceController.save);

/** GET /api/performance/history/:studentId — Get performance history for a student */
router.get('/history/:studentId', authenticateToken, performanceController.getHistory);

export default router;
