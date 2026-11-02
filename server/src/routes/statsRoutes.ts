import { Router } from 'express';
import { getSystemMetrics } from '../controllers/statsController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/metrics', authenticateToken, getSystemMetrics);

export default router;

