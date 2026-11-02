import { Router } from 'express';
import {
  listPublicNews,
  getPublicNewsBySlug,
  listAdminNews,
  createNewsArticle,
  updateNewsArticle,
  deleteNewsArticle,
} from '../controllers/newsController';
import { authenticateToken } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/rbacMiddleware';

const router = Router();

// Public routes
router.get('/', listPublicNews);
router.get('/:slug', getPublicNewsBySlug);

// Protected routes (Super Admin, Admin, and Editor can author & edit articles)
router.get(
  '/admin/all',
  authenticateToken,
  requireRole(['super_admin', 'admin', 'editor']),
  listAdminNews
);

router.post(
  '/',
  authenticateToken,
  requireRole(['super_admin', 'admin', 'editor']),
  createNewsArticle
);

router.put(
  '/:id',
  authenticateToken,
  requireRole(['super_admin', 'admin', 'editor']),
  updateNewsArticle
);

// Only Super Admin and Admin can delete news articles
router.delete(
  '/:id',
  authenticateToken,
  requireRole(['super_admin', 'admin']),
  deleteNewsArticle
);

export default router;

