import { Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { AuthenticatedRequest, RoleId } from '../types/auth';
import { prisma } from '../config/database';

export async function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      message: 'Akses ditolak. Token otentikasi tidak ditemukan.',
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);

    // Verify user still exists and isActive in database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        role: {
          include: {
            permissions: {
              select: { permissionId: true },
            },
          },
        },
      },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Pengguna tidak ditemukan dalam sistem.',
      });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({
        success: false,
        message: 'Akun Anda telah dinonaktifkan oleh Administrator.',
      });
      return;
    }

    // Attach verified user payload
    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      roleId: user.roleId as RoleId,
      permissions: user.role.permissions.map((p) => p.permissionId),
    };

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Sesi login tidak valid atau telah kedaluwarsa. Silakan login kembali.',
    });
  }
}

