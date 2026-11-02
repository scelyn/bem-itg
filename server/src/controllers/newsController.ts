import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { recordAuditLog } from '../utils/auditLogger';
import { AuthenticatedRequest } from '../types/auth';

/**
 * Public: List published news articles.
 */
export async function listPublicNews(req: Request, res: Response): Promise<void> {
  try {
    const { category, search, featured } = req.query;

    const where: Record<string, unknown> = {
      status: 'published',
    };

    if (category && category !== 'Semua') {
      where.category = String(category);
    }

    if (featured === 'true') {
      where.isFeatured = true;
    }

    if (search) {
      where.OR = [
        { title: { contains: String(search) } },
        { excerpt: { contains: String(search) } },
      ];
    }

    const articles = await prisma.newsArticle.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      include: {
        author: {
          select: { fullName: true, username: true },
        },
      },
    });

    res.json({
      success: true,
      count: articles.length,
      articles,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memuat warta berita.' });
  }
}

/**
 * Public: Get single news article by slug.
 */
export async function getPublicNewsBySlug(req: Request, res: Response): Promise<void> {
  const { slug } = req.params;

  try {
    const article = await prisma.newsArticle.findUnique({
      where: { slug },
      include: {
        author: {
          select: { fullName: true, username: true, roleId: true },
        },
      },
    });

    if (!article || article.status !== 'published') {
      res.status(404).json({ success: false, message: 'Artikel tidak ditemukan.' });
      return;
    }

    res.json({ success: true, article });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memuat artikel.' });
  }
}

/**
 * Protected: List all articles (draft, published, archived) for editors and admins.
 */
export async function listAdminNews(_req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const articles = await prisma.newsArticle.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        author: {
          select: { fullName: true, username: true, roleId: true },
        },
      },
    });

    res.json({ success: true, count: articles.length, articles });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memuat arsip redaksi.' });
  }
}

/**
 * Protected: Create news article.
 */
export async function createNewsArticle(req: AuthenticatedRequest, res: Response): Promise<void> {
  const {
    title,
    excerpt,
    content,
    category,
    coverImage,
    tags,
    department,
    archiveNumber,
    readTime,
    isFeatured = false,
    status = 'draft',
  } = req.body;

  if (!title || !content || !category) {
    res.status(400).json({
      success: false,
      message: 'Judul, konten, dan kategori artikel wajib diisi.',
    });
    return;
  }

  try {
    // Generate slug from title
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const timestamp = Date.now().toString().slice(-4);
    const slug = `${baseSlug}-${timestamp}`;

    const article = await prisma.newsArticle.create({
      data: {
        slug,
        title: title.trim(),
        excerpt: excerpt?.trim() || title.trim().slice(0, 150),
        content,
        category,
        coverImage,
        tags: Array.isArray(tags) ? tags.join(', ') : tags,
        department,
        archiveNumber,
        readTime: readTime || '3 min read',
        isFeatured: Boolean(isFeatured),
        status,
        publishedAt: status === 'published' ? new Date() : null,
        authorId: req.user?.id,
      },
    });

    await recordAuditLog({
      userId: req.user?.id,
      action: 'NEWS_CREATED',
      module: 'news',
      targetId: article.id,
      details: { title: article.title, status: article.status },
      req,
    });

    res.status(201).json({
      success: true,
      message: 'Artikel berita berhasil disimpan.',
      article,
    });
  } catch (error) {
    console.error('[Create News Error]', error);
    res.status(500).json({ success: false, message: 'Gagal membuat artikel baru.' });
  }
}

/**
 * Protected: Update news article.
 */
export async function updateNewsArticle(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const {
    title,
    excerpt,
    content,
    category,
    coverImage,
    tags,
    department,
    archiveNumber,
    readTime,
    isFeatured,
    status,
  } = req.body;

  try {
    const existing = await prisma.newsArticle.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, message: 'Artikel tidak ditemukan.' });
      return;
    }

    const wasPublished = existing.status === 'published';
    const nowPublishing = status === 'published';

    const updated = await prisma.newsArticle.update({
      where: { id },
      data: {
        ...(title && { title: title.trim() }),
        ...(excerpt && { excerpt: excerpt.trim() }),
        ...(content && { content }),
        ...(category && { category }),
        ...(coverImage !== undefined && { coverImage }),
        ...(tags !== undefined && { tags: Array.isArray(tags) ? tags.join(', ') : tags }),
        ...(department !== undefined && { department }),
        ...(archiveNumber !== undefined && { archiveNumber }),
        ...(readTime && { readTime }),
        ...(isFeatured !== undefined && { isFeatured }),
        ...(status && { status }),
        ...(!wasPublished && nowPublishing && { publishedAt: new Date() }),
      },
    });

    await recordAuditLog({
      userId: req.user?.id,
      action: 'NEWS_UPDATED',
      module: 'news',
      targetId: updated.id,
      details: { status: updated.status },
      req,
    });

    res.json({
      success: true,
      message: 'Artikel berhasil diperbarui.',
      article: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memperbarui artikel.' });
  }
}

/**
 * Protected: Delete news article.
 */
export async function deleteNewsArticle(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { id } = req.params;

  try {
    await prisma.newsArticle.delete({ where: { id } });

    await recordAuditLog({
      userId: req.user?.id,
      action: 'NEWS_DELETED',
      module: 'news',
      targetId: id,
      req,
    });

    res.json({ success: true, message: 'Artikel berhasil dihapus.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menghapus artikel.' });
  }
}

