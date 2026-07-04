import { Router } from 'express';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';
import * as userController from '../controllers/userController.js';

const router = Router();

/** GET /api/users — List all users without passwords (Admin only) */
router.get('/', authenticateToken, authorizeRole('Admin'), userController.getAll);

export default router;
