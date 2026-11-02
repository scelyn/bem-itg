import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { generateAspirationTicketCode } from '../utils/ticketCode';
import { recordAuditLog } from '../utils/auditLogger';
import { AuthenticatedRequest } from '../types/auth';

/**
 * Public: Submit a new student aspiration.
 */
export async function submitPublicAspiration(req: Request, res: Response): Promise<void> {
  const {
    title,
    body,
    category,
    urgency = 'Normal',
    isAnonymous = true,
    senderName,
    senderNim,
    senderEmail,
    senderPhone,
  } = req.body;

  if (!title || !body || !category) {
    res.status(400).json({
      success: false,
      message: 'Judul, isi aspirasi, dan kategori wajib diisi.',
    });
    return;
  }

  try {
    const ticketCode = await generateAspirationTicketCode();

    const aspiration = await prisma.aspiration.create({
      data: {
        ticketCode,
        title: title.trim(),
        body: body.trim(),
        category: category.trim(),
        urgency,
        isAnonymous: Boolean(isAnonymous),
        senderName: isAnonymous ? null : senderName?.trim() || null,
        senderNim: isAnonymous ? null : senderNim?.trim() || null,
        senderEmail: isAnonymous ? null : senderEmail?.trim() || null,
        senderPhone: isAnonymous ? null : senderPhone?.trim() || null,
        status: 'Baru Diterima',
        pipelineSteps: {
          create: [
            {
              stepNumber: 1,
              title: 'Diterima Sistem & Verifikasi Administrasi',
              description: 'Aspirasi telah masuk ke portal digital dan terverifikasi dalam antrean.',
              status: 'completed',
              completedAt: new Date(),
            },
            {
              stepNumber: 2,
              title: 'Telaah Komisi Advokasi & Pemetaan Isu',
              description: 'Kementerian Advokasi & Kebijakan Kampus menelaah substansi tuntutan.',
              status: 'in-progress',
            },
            {
              stepNumber: 3,
              title: 'Koordinasi & Audiensi Pihak Terkait',
              description: 'Pembahasan bersama birokrasi kampus atau pihak pengelola fasilitas.',
              status: 'pending',
            },
            {
              stepNumber: 4,
              title: 'Penerbitan Hasil Advokasi / Tindak Lanjut',
              description: 'Penyampaian nota tindak lanjut dan rekomendasi kebijakan resmi.',
              status: 'pending',
            },
          ],
        },
      },
      include: {
        pipelineSteps: {
          orderBy: { stepNumber: 'asc' },
        },
      },
    });

    await recordAuditLog({
      action: 'ASPIRATION_SUBMITTED',
      module: 'aspirations',
      targetId: aspiration.id,
      details: { ticketCode, category, urgency, isAnonymous },
      req,
    });

    res.status(201).json({
      success: true,
      message: 'Aspirasi berhasil dikirim dan dicatat dalam sistem.',
      ticketCode: aspiration.ticketCode,
      data: aspiration,
    });
  } catch (error) {
    console.error('[Submit Aspiration Error]', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengirim aspirasi. Silakan coba beberapa saat lagi.',
    });
  }
}

/**
 * Public: Track aspiration status by ticketCode.
 */
export async function trackPublicAspiration(req: Request, res: Response): Promise<void> {
  const { code } = req.params;

  if (!code) {
    res.status(400).json({ success: false, message: 'Kode tiket aspirasi diperlukan.' });
    return;
  }

  try {
    const aspiration = await prisma.aspiration.findUnique({
      where: { ticketCode: code.trim().toUpperCase() },
      include: {
        pipelineSteps: {
          orderBy: { stepNumber: 'asc' },
        },
      },
    });

    if (!aspiration) {
      res.status(404).json({
        success: false,
        message: `Tiket aspirasi '${code}' tidak ditemukan dalam arsip sistem.`,
      });
      return;
    }

    // Mask sender identity for public view if anonymous
    const sanitized = {
      id: aspiration.id,
      ticketCode: aspiration.ticketCode,
      title: aspiration.title,
      body: aspiration.body,
      category: aspiration.category,
      urgency: aspiration.urgency,
      isAnonymous: aspiration.isAnonymous,
      senderName: aspiration.isAnonymous ? 'Anonim Mahasiswa' : aspiration.senderName,
      status: aspiration.status,
      createdAt: aspiration.createdAt,
      updatedAt: aspiration.updatedAt,
      pipelineSteps: aspiration.pipelineSteps,
    };

    res.json({
      success: true,
      aspiration: sanitized,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menelusuri tiket aspirasi.' });
  }
}

/**
 * Protected: List aspirations for Admin & Super Admin with filtering.
 */
export async function listAdminAspirations(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { status, category, urgency } = req.query;

    const whereClause: Record<string, unknown> = {};
    if (status) whereClause.status = String(status);
    if (category) whereClause.category = String(category);
    if (urgency) whereClause.urgency = String(urgency);

    const aspirations = await prisma.aspiration.findMany({
      where: whereClause,
      include: {
        pipelineSteps: {
          orderBy: { stepNumber: 'asc' },
        },
        internalNotes: {
          include: {
            author: {
              select: { id: true, fullName: true, username: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      count: aspirations.length,
      aspirations,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memuat daftar aspirasi.' });
  }
}

/**
 * Protected: Update status and pipeline step of an aspiration ticket.
 */
export async function updateAspirationStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const { status, pipelineStepNumber, stepStatus } = req.body;

  try {
    const updated = await prisma.aspiration.update({
      where: { id },
      data: {
        ...(status && { status }),
      },
      include: { pipelineSteps: true },
    });

    // Optionally update specific pipeline step
    if (pipelineStepNumber !== undefined && stepStatus) {
      await prisma.aspirationPipelineStep.updateMany({
        where: {
          aspirationId: id,
          stepNumber: Number(pipelineStepNumber),
        },
        data: {
          status: stepStatus,
          ...(stepStatus === 'completed' && { completedAt: new Date() }),
        },
      });
    }

    await recordAuditLog({
      userId: req.user?.id,
      action: 'ASPIRATION_STATUS_UPDATED',
      module: 'aspirations',
      targetId: id,
      details: { status, pipelineStepNumber, stepStatus },
      req,
    });

    res.json({
      success: true,
      message: 'Status aspirasi berhasil diperbarui.',
      aspiration: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memperbarui status aspirasi.' });
  }
}

/**
 * Protected: Add internal note to an aspiration ticket.
 */
export async function addInternalNote(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const { note } = req.body;

  if (!note || !req.user) {
    res.status(400).json({ success: false, message: 'Catatan tidak boleh kosong.' });
    return;
  }

  try {
    const createdNote = await prisma.aspirationNote.create({
      data: {
        aspirationId: id,
        authorId: req.user.id,
        note: note.trim(),
      },
      include: {
        author: {
          select: { id: true, fullName: true },
        },
      },
    });

    await recordAuditLog({
      userId: req.user.id,
      action: 'ASPIRATION_NOTE_ADDED',
      module: 'aspirations',
      targetId: id,
      req,
    });

    res.status(201).json({
      success: true,
      message: 'Catatan internal berhasil ditambahkan.',
      note: createdNote,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menambahkan catatan internal.' });
  }
}

