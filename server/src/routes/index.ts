import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import aspirationRoutes from './aspirationRoutes';
import newsRoutes from './newsRoutes';
import documentRoutes from './documentRoutes';
import statsRoutes from './statsRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/aspirations', aspirationRoutes);
router.use('/news', newsRoutes);
router.use('/documents', documentRoutes);
router.use('/stats', statsRoutes);

export default router;

