import { Router } from 'express';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';
import { requireFields } from '../middleware/validate.js';
import * as batchController from '../controllers/batchController.js';

const router = Router();

/** GET /api/batches — List all batches */
router.get('/', authenticateToken, batchController.getAll);

/** POST /api/batches — Create a new batch (Admin only) */
router.post('/', authenticateToken, authorizeRole('Admin'), requireFields('name'), batchController.create);

/** PUT /api/batches/:id — Update a batch (Admin only) */
router.put('/:id', authenticateToken, authorizeRole('Admin'), batchController.update);

/** DELETE /api/batches/:id — Delete a batch (Admin only) */
router.delete('/:id', authenticateToken, authorizeRole('Admin'), batchController.remove);

export default router;
