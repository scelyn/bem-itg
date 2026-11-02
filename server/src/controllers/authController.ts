import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { comparePassword, hashPassword } from '../utils/password';
import { signToken } from '../utils/jwt';
import { recordAuditLog } from '../utils/auditLogger';
import { AuthenticatedRequest, RoleId } from '../types/auth';

/**
 * Single unified login endpoint for all roles (Super Admin, Admin, Editor).
 * No role selection required on the frontend.
 */
export async function login(req: Request, res: Response): Promise<void> {
  const { identifier, username, email, password } = req.body;
  const loginIdentifier = identifier || username || email;

  if (!loginIdentifier || !password) {
    res.status(400).json({
      success: false,
      message: 'Username/Email dan kata sandi wajib diisi.',
    });
    return;
  }

  try {
    // Find user by username or email (case-insensitive for robust authentication)
    const cleanIdentifier = loginIdentifier.trim();
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: { equals: cleanIdentifier, mode: 'insensitive' } },
          { email: { equals: cleanIdentifier.toLowerCase(), mode: 'insensitive' } },
        ],
      },
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
      await recordAuditLog({
        action: 'AUTH_LOGIN_FAILED',
        module: 'auth',
        details: { identifier: loginIdentifier, reason: 'User not found' },
        req,
      });

      res.status(401).json({
        success: false,
        message: 'Kredensial tidak valid. Periksa kembali username/email dan kata sandi.',
      });
      return;
    }

    if (!user.isActive) {
      await recordAuditLog({
        userId: user.id,
        action: 'AUTH_LOGIN_BLOCKED',
        module: 'auth',
        details: { reason: 'Account inactive' },
        req,
      });

      res.status(403).json({
        success: false,
        message: 'Akun Anda dinonaktifkan. Hubungi Super Administrator.',
      });
      return;
    }

    // Verify bcrypt password hash
    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
      await recordAuditLog({
        userId: user.id,
        action: 'AUTH_LOGIN_FAILED',
        module: 'auth',
        details: { reason: 'Incorrect password' },
        req,
      });

      res.status(401).json({
        success: false,
        message: 'Kredensial tidak valid. Periksa kembali username/email dan kata sandi.',
      });
      return;
    }

    // Update lastLoginAt
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const permissions = user.role.permissions.map((p) => p.permissionId);

    const tokenPayload = {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      roleId: user.roleId as RoleId,
      permissions,
    };

    const token = signToken(tokenPayload);

    await recordAuditLog({
      userId: user.id,
      action: 'AUTH_LOGIN_SUCCESS',
      module: 'auth',
      details: { role: user.roleId },
      req,
    });

    res.json({
      success: true,
      message: 'Autentikasi berhasil.',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.roleId,
        avatarUrl: user.avatarUrl,
        lastLoginAt: user.lastLoginAt,
      },
      permissions,
    });
  } catch (error) {
    console.error('[Login Controller Error]', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan sistem saat memproses login.',
    });
  }
}

/**
 * Get profile and role of currently authenticated session.
 */
export async function getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Tidak terotentikasi.' });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
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
      res.status(404).json({ success: false, message: 'Data pengguna tidak ditemukan.' });
      return;
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.roleId,
        avatarUrl: user.avatarUrl,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
      },
      permissions: user.role.permissions.map((p) => p.permissionId),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data profil.' });
  }
}

/**
 * Setup Initial Super Admin.
 * Guarded strictly: only executes if ZERO users exist in the database.
 * No hardcoded default credentials.
 */
export async function setupInitialAdmin(req: Request, res: Response): Promise<void> {
  try {
    const totalUsers = await prisma.user.count();

    if (totalUsers > 0) {
      res.status(403).json({
        success: false,
        message: 'Sistem telah memiliki administrator. Pendaftaran awal dikunci demi keamanan.',
      });
      return;
    }

    const { fullName, username, email, password } = req.body;

    if (!fullName || !username || !email || !password) {
      res.status(400).json({
        success: false,
        message: 'Nama lengkap, username, email, dan kata sandi wajib diisi.',
      });
      return;
    }

    if (password.length < 8) {
      res.status(400).json({
        success: false,
        message: 'Kata sandi minimal 8 karakter.',
      });
      return;
    }

    const passwordHash = await hashPassword(password);

    const superAdmin = await prisma.user.create({
      data: {
        fullName: fullName.trim(),
        username: username.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        passwordHash,
        roleId: 'super_admin',
        isActive: true,
      },
    });

    await recordAuditLog({
      userId: superAdmin.id,
      action: 'SYSTEM_INITIAL_SUPERADMIN_CREATED',
      module: 'system',
      details: { username: superAdmin.username, email: superAdmin.email },
      req,
    });

    res.status(201).json({
      success: true,
      message: 'Super Administrator berhasil dibuat. Silakan login ke portal.',
      user: {
        id: superAdmin.id,
        username: superAdmin.username,
        email: superAdmin.email,
        fullName: superAdmin.fullName,
        role: superAdmin.roleId,
      },
    });
  } catch (error: any) {
    console.error('[Setup Initial Admin Error]', error);
    res.status(500).json({
      success: false,
      message: error?.message || 'Gagal membuat akun Super Administrator awal.',
    });
  }
}

/**
 * Check if the system has been initialized with an initial Super Admin.
 */
export async function checkSystemStatus(_req: Request, res: Response): Promise<void> {
  try {
    const userCount = await prisma.user.count();
    res.json({
      success: true,
      initialized: userCount > 0,
      rolesConfigured: true,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memeriksa status sistem.' });
  }
}

/**
 * Logout audit logger
 */
export async function logout(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (req.user) {
    await recordAuditLog({
      userId: req.user.id,
      action: 'AUTH_LOGOUT',
      module: 'auth',
      req,
    });
  }

  res.json({
    success: true,
    message: 'Berhasil keluar dari sesi.',
  });
}

