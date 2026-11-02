import { Request } from 'express';
import { prisma } from '../config/database';

export interface AuditLogOptions {
  userId?: string | null;
  action: string;
  module: 'auth' | 'users' | 'aspirations' | 'news' | 'documents' | 'organization' | 'system';
  targetId?: string | null;
  details?: Record<string, unknown> | string | null;
  req?: Request;
}

/**
 * Creates an immutable audit log entry in the database.
 */
export async function recordAuditLog(options: AuditLogOptions): Promise<void> {
  try {
    const { userId, action, module, targetId, details, req } = options;

    const ipAddress =
      req?.headers['x-forwarded-for']?.toString() ||
      req?.socket?.remoteAddress ||
      null;

    const userAgent = req?.headers['user-agent'] || null;

    const detailsStr = details
      ? typeof details === 'string'
        ? details
        : JSON.stringify(details)
      : null;

    await prisma.auditLog.create({
      data: {
        userId: userId || null,
        action,
        module,
        targetId: targetId || null,
        details: detailsStr,
        ipAddress,
        userAgent,
      },
    });
  } catch (error) {
    // Non-blocking log failure
    console.error('[AuditLog] Failed to record audit log:', error);
  }
}

