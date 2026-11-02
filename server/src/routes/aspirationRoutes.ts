import { Router } from 'express';
import {
  submitPublicAspiration,
  trackPublicAspiration,
  listAdminAspirations,
  updateAspirationStatus,
  addInternalNote,
} from '../controllers/aspirationController';
import { authenticateToken } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/rbacMiddleware';

const router = Router();

// Public routes
router.post('/submit', submitPublicAspiration);
router.get('/track/:code', trackPublicAspiration);

// Protected routes (Super Admin & Admin can manage; Editor cannot modify aspirations)
router.get(
  '/admin/all',
  authenticateToken,
  requireRole(['super_admin', 'admin']),
  listAdminAspirations
);

router.patch(
  '/admin/:id/status',
  authenticateToken,
  requireRole(['super_admin', 'admin']),
  updateAspirationStatus
);

router.post(
  '/admin/:id/notes',
  authenticateToken,
  requireRole(['super_admin', 'admin']),
  addInternalNote
);

export default router;

