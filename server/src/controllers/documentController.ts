import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { recordAuditLog } from '../utils/auditLogger';
import { AuthenticatedRequest } from '../types/auth';

/**
 * Public: List verified legal documents.
 */
export async function listPublicDocuments(req: Request, res: Response): Promise<void> {
  try {
    const { category, search, year } = req.query;

    const where: Record<string, unknown> = {
      status: 'published',
    };

    if (category && category !== 'all') {
      where.category = String(category);
    }

    if (year) {
      where.year = String(year);
    }

    if (search) {
      where.OR = [
        { documentNumber: { contains: String(search) } },
        { title: { contains: String(search) } },
        { description: { contains: String(search) } },
      ];
    }

    const documents = await prisma.legalDocument.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        cabinetPeriod: {
          select: { name: true, id: true },
        },
      },
    });

    res.json({
      success: true,
      count: documents.length,
      documents,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memuat arsip dokumen legal.' });
  }
}

/**
 * Protected: Create legal document.
 */
export async function createLegalDocument(req: AuthenticatedRequest, res: Response): Promise<void> {
  const {
    documentNumber,
    title,
    description,
    category,
    categoryLabel,
    year,
    fileUrl,
    fileSize,
    fileFormat = 'PDF',
    verifiedStatus = 'Terverifikasi Kemensesneg',
    status = 'published',
    cabinetPeriodId = '2026-2027',
  } = req.body;

  if (!documentNumber || !title || !category || !fileUrl) {
    res.status(400).json({
      success: false,
      message: 'Nomor surat, judul, kategori, dan tautan berkas dokumen wajib diisi.',
    });
    return;
  }

  try {
    const existing = await prisma.legalDocument.findUnique({
      where: { documentNumber: documentNumber.trim() },
    });

    if (existing) {
      res.status(409).json({
        success: false,
        message: `Nomor surat '${documentNumber}' sudah terdaftar dalam arsip.`,
      });
      return;
    }

    const doc = await prisma.legalDocument.create({
      data: {
        documentNumber: documentNumber.trim(),
        title: title.trim(),
        description: description?.trim() || null,
        category,
        categoryLabel: categoryLabel || category.toUpperCase(),
        year: String(year || new Date().getFullYear()),
        fileUrl,
        fileSize: fileSize || '1.2 MB',
        fileFormat,
        verifiedStatus,
        status,
        cabinetPeriodId,
        uploadedById: req.user?.id,
      },
    });

    await recordAuditLog({
      userId: req.user?.id,
      action: 'DOCUMENT_CREATED',
      module: 'documents',
      targetId: doc.id,
      details: { documentNumber: doc.documentNumber, title: doc.title },
      req,
    });

    res.status(201).json({
      success: true,
      message: 'Dokumen legal berhasil diarsipkan.',
      document: doc,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengarsipkan dokumen legal.' });
  }
}

/**
 * Protected: Delete legal document.
 */
export async function deleteLegalDocument(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { id } = req.params;

  try {
    await prisma.legalDocument.delete({ where: { id } });

    await recordAuditLog({
      userId: req.user?.id,
      action: 'DOCUMENT_DELETED',
      module: 'documents',
      targetId: id,
      req,
    });

    res.json({ success: true, message: 'Dokumen berhasil dihapus dari arsip.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menghapus dokumen.' });
  }
}

