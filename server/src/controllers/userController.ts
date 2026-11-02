import { Response } from 'express';
import { prisma } from '../config/database';
import { hashPassword } from '../utils/password';
import { recordAuditLog } from '../utils/auditLogger';
import { AuthenticatedRequest } from '../types/auth';

/**
 * List all registered admin/editor users. Only accessible by Super Admin.
 */
export async function listUsers(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        username: true,
        email: true,
        roleId: true,
        isActive: true,
        avatarUrl: true,
        lastLoginAt: true,
        createdAt: true,
        role: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      users: users.map((u) => ({
        id: u.id,
        fullName: u.fullName,
        username: u.username,
        email: u.email,
        roleId: u.roleId,
        roleName: u.role.name,
        isActive: u.isActive,
        avatarUrl: u.avatarUrl,
        lastLoginAt: u.lastLoginAt,
        createdAt: u.createdAt,
      })),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memuat daftar pengguna.' });
  }
}

/**
 * Create a new user with assigned role (super_admin, admin, editor).
 */
export async function createUser(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { fullName, username, email, password, roleId } = req.body;

  if (!fullName || !username || !email || !password || !roleId) {
    res.status(400).json({
      success: false,
      message: 'Semua kolom (nama lengkap, username, email, password, role) wajib diisi.',
    });
    return;
  }

  const validRoles = ['super_admin', 'admin', 'editor'];
  if (!validRoles.includes(roleId)) {
    res.status(400).json({
      success: false,
      message: `Role tidak valid. Pilihan: ${validRoles.join(', ')}`,
    });
    return;
  }

  try {
    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ username: username.trim() }, { email: email.trim().toLowerCase() }],
      },
    });

    if (existing) {
      res.status(409).json({
        success: false,
        message: 'Username atau email sudah digunakan oleh akun lain.',
      });
      return;
    }

    const passwordHash = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        fullName: fullName.trim(),
        username: username.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        passwordHash,
        roleId,
        isActive: true,
      },
      include: {
        role: true,
      },
    });

    await recordAuditLog({
      userId: req.user?.id,
      action: 'USER_CREATED',
      module: 'users',
      targetId: newUser.id,
      details: { username: newUser.username, role: newUser.roleId },
      req,
    });

    res.status(201).json({
      success: true,
      message: `Akun untuk ${newUser.fullName} (${newUser.role.name}) berhasil dibuat.`,
      user: {
        id: newUser.id,
        fullName: newUser.fullName,
        username: newUser.username,
        email: newUser.email,
        roleId: newUser.roleId,
        isActive: newUser.isActive,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal membuat pengguna baru.' });
  }
}

/**
 * Toggle user active status.
 */
export async function toggleUserStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const { isActive } = req.body;

  if (typeof isActive !== 'boolean') {
    res.status(400).json({ success: false, message: 'Status isActive harus bertipe boolean.' });
    return;
  }

  if (req.user?.id === id) {
    res.status(400).json({
      success: false,
      message: 'Anda tidak dapat menonaktifkan akun Anda sendiri.',
    });
    return;
  }

  try {
    const updated = await prisma.user.update({
      where: { id },
      data: { isActive },
    });

    await recordAuditLog({
      userId: req.user?.id,
      action: isActive ? 'USER_ACTIVATED' : 'USER_DEACTIVATED',
      module: 'users',
      targetId: updated.id,
      req,
    });

    res.json({
      success: true,
      message: `Akun ${updated.username} berhasil ${isActive ? 'diaktifkan' : 'dinonaktifkan'}.`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memperbarui status pengguna.' });
  }
}

