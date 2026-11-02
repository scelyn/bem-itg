import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, RoleId } from '../types/auth';
import { recordAuditLog } from '../utils/auditLogger';

/**
 * Middleware to enforce role-based access control.
 * @param allowedRoles List of roles permitted to access this endpoint.
 */
export function requireRole(allowedRoles: RoleId[]) {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Akses ditolak: Pengguna belum terotentikasi.',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.roleId)) {
      // Record unauthorized access attempt in audit log
      await recordAuditLog({
        userId: req.user.id,
        action: 'RBAC_ACCESS_DENIED',
        module: 'system',
        details: {
          path: req.originalUrl,
          method: req.method,
          userRole: req.user.roleId,
          allowedRoles,
        },
        req,
      });

      res.status(403).json({
        success: false,
        message: `Akses ditolak. Peran '${req.user.roleId}' tidak memiliki izin untuk tindakan ini.`,
      });
      return;
    }

    next();
  };
}

/**
 * Middleware to enforce specific permission-based access control.
 * @param requiredPermission e.g. "news:publish", "documents:verify"
 */
export function requirePermission(requiredPermission: string) {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Akses ditolak: Pengguna belum terotentikasi.',
      });
      return;
    }

    // Super Admin has wildcard full access
    if (req.user.roleId === 'super_admin') {
      return next();
    }

    const userPerms = req.user.permissions || [];
    if (!userPerms.includes(requiredPermission)) {
      await recordAuditLog({
        userId: req.user.id,
        action: 'PERMISSION_DENIED',
        module: 'system',
        details: {
          path: req.originalUrl,
          method: req.method,
          requiredPermission,
        },
        req,
      });

      res.status(403).json({
        success: false,
        message: `Akses ditolak. Anda memerlukan izin '${requiredPermission}' untuk tindakan ini.`,
      });
      return;
    }

    next();
  };
}

