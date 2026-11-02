import { Router } from 'express';
import {
  login,
  getMe,
  setupInitialAdmin,
  checkSystemStatus,
  logout,
} from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/login', login);
router.get('/status', checkSystemStatus);
router.post('/setup-initial-superadmin', setupInitialAdmin);
router.get('/me', authenticateToken, getMe);
router.post('/logout', authenticateToken, logout);

export default router;

