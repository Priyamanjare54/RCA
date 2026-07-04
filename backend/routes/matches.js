import { Router } from 'express';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';
import * as matchController from '../controllers/matchController.js';

const router = Router();

/** GET /api/matches — List all matches */
router.get('/', authenticateToken, matchController.getAll);

/** POST /api/matches — Create a new match (Admin, Coach) */
router.post('/', authenticateToken, authorizeRole(['Admin', 'Coach']), matchController.create);

/** PUT /api/matches/:id — Update a match (Admin, Coach) */
router.put('/:id', authenticateToken, authorizeRole(['Admin', 'Coach']), matchController.update);

/** DELETE /api/matches/:id — Delete a match (Admin, Coach) */
router.delete('/:id', authenticateToken, authorizeRole(['Admin', 'Coach']), matchController.remove);

export default router;
