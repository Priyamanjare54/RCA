import { Router } from 'express';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';
import { requireFields } from '../middleware/validate.js';
import * as studentController from '../controllers/studentController.js';

const router = Router();

/** GET /api/students — List all students */
router.get('/', authenticateToken, studentController.getAll);

/** POST /api/students — Create a new student (Admin, Coach) */
router.post('/', authenticateToken, authorizeRole(['Admin', 'Coach']), requireFields('name'), studentController.create);

/** PUT /api/students/:id — Update a student (Admin, Coach) */
router.put('/:id', authenticateToken, authorizeRole(['Admin', 'Coach']), studentController.update);

/** DELETE /api/students/:id — Delete a student (Admin, Coach) */
router.delete('/:id', authenticateToken, authorizeRole(['Admin', 'Coach']), studentController.remove);

export default router;
