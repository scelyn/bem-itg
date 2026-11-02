import { Router } from 'express';
import {
  listPublicDocuments,
  createLegalDocument,
  deleteLegalDocument,
} from '../controllers/documentController';
import { authenticateToken } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/rbacMiddleware';

const router = Router();

// Public routes
router.get('/', listPublicDocuments);

// Protected routes (Super Admin and Admin manage legal documents; Editor cannot modify legal records)
router.post(
  '/',
  authenticateToken,
  requireRole(['super_admin', 'admin']),
  createLegalDocument
);

router.delete(
  '/:id',
  authenticateToken,
  requireRole(['super_admin', 'admin']),
  deleteLegalDocument
);

export default router;

