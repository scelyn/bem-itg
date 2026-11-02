import { Response } from 'express';
import { prisma } from '../config/database';
import { AuthenticatedRequest } from '../types/auth';

/**
 * Protected: Summary metrics and audit logs for administrative overviews.
 */
export async function getSystemMetrics(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const [
      totalAspirations,
      pendingAspirations,
      totalNews,
      publishedNews,
      totalDocuments,
      totalUsers,
      activePeriod,
    ] = await Promise.all([
      prisma.aspiration.count(),
      prisma.aspiration.count({
        where: {
          status: {
            in: ['Baru Diterima', 'Sedang Ditelaah Komisi'],
          },
        },
      }),
      prisma.newsArticle.count(),
      prisma.newsArticle.count({
        where: { status: 'published' },
      }),
      prisma.legalDocument.count(),
      prisma.user.count(),
      prisma.cabinetPeriod.findFirst({
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          startYear: true,
          endYear: true,
          theme: true,
        },
      }),
    ]);

    const aspirationsByStatus = await prisma.aspiration.groupBy({
      by: ['status'],
      _count: { id: true },
    });

    const usersByRole = await prisma.user.groupBy({
      by: ['roleId'],
      _count: { id: true },
    });

    const recentAuditLogs = req.user?.roleId === 'super_admin'
      ? await prisma.auditLog.findMany({
          take: 8,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: { username: true, fullName: true, roleId: true },
            },
          },
        })
      : [];

    res.json({
      success: true,
      metrics: {
        totalAspirations,
        pendingAspirations,
        totalNews,
        publishedNews,
        totalDocuments,
        totalUsers,
        aspirationsByStatus,
        usersByRole,
        activePeriod,
      },
      recentAuditLogs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memuat ringkasan sistem.' });
  }
}

