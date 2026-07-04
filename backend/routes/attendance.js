import express from 'express';
import * as attendanceController from '../controllers/attendanceController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/** POST /api/attendance — Save daily attendance */
router.post('/', authenticateToken, attendanceController.save);

/** GET /api/attendance — Get all attendance records */
router.get('/', authenticateToken, attendanceController.getAll);

export default router;
