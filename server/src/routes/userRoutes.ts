import { Router } from 'express';
import {
  listUsers,
  createUser,
  toggleUserStatus,
} from '../controllers/userController';
import { authenticateToken } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/rbacMiddleware';

const router = Router();

// All user management routes strictly require Super Admin
router.use(authenticateToken);
router.use(requireRole(['super_admin']));

router.get('/', listUsers);
router.post('/', createUser);
router.patch('/:id/status', toggleUserStatus);

export default router;

