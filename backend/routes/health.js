import { Router } from 'express';
import mongoose from 'mongoose';
import { authenticateToken } from '../middleware/auth.js';
import { getStats } from '../controllers/statsController.js';

const router = Router();

/**
 * GET /api/health — Returns server and database connection status.
 * No authentication required.
 */
router.get('/', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  res.json({
    status: 'ok',
    db: dbStatusMap[dbState] || 'unknown',
    timestamp: new Date().toISOString()
  });
});

/**
 * GET /api/stats — Dashboard statistics (authenticated).
 * Mounted here to keep stats under health-adjacent routing.
 */
router.get('/stats', authenticateToken, getStats);

export default router;
