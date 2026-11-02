import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';
import { prisma } from '../config/database';

async function migrateData() {
  console.log('================================================================');
  console.log('    MIGRASI DATA DARI SQLITE LOKAL KE SUPABASE POSTGRESQL       ');
  console.log('================================================================\n');

  const sqlitePath = path.resolve(process.cwd(), 'server/prisma/dev.db');

  if (!fs.existsSync(sqlitePath)) {
    console.log(`[INFO] Database SQLite lokal tidak ditemukan di: ${sqlitePath}`);
    console.log('[INFO] Tidak ada data lokal yang perlu dimigrasikan.');
    return;
  }

  // Verify PostgreSQL connection first
  try {
    await prisma.$connect();
    console.log('✓ Koneksi ke PostgreSQL berhasil diverifikasi.\n');
  } catch (err: any) {
    console.error('✗ GAGAL TERHUBUNG KE POSTGRESQL!');
    console.error('Pastikan DATABASE_URL di .env telah diisi dengan connection string Supabase yang valid.');
    console.error(`Detail error: ${err.message}\n`);
    process.exit(1);
  }

  const db = new DatabaseSync(sqlitePath);
  console.log(`✓ Membuka database SQLite lokal: ${sqlitePath}\n`);

  try {
    // 1. ROLES
    const roles: any[] = db.prepare('SELECT * FROM roles').all();
    console.log(`Memindahkan ${roles.length} roles...`);
    for (const r of roles) {
      await prisma.role.upsert({
        where: { id: r.id },
        update: { name: r.name, description: r.description },
        create: {
          id: r.id,
          name: r.name,
          description: r.description,
          createdAt: new Date(r.createdAt),
          updatedAt: new Date(r.updatedAt),
        },
      });
    }

    // 2. PERMISSIONS
    const perms: any[] = db.prepare('SELECT * FROM permissions').all();
    console.log(`Memindahkan ${perms.length} permissions...`);
    for (const p of perms) {
      await prisma.permission.upsert({
        where: { id: p.id },
        update: { name: p.name, module: p.module, action: p.action, description: p.description },
        create: {
          id: p.id,
          name: p.name,
          module: p.module,
          action: p.action,
          description: p.description,
          createdAt: new Date(p.createdAt),
        },
      });
    }

    // 3. ROLE_PERMISSIONS
    const rolePerms: any[] = db.prepare('SELECT * FROM role_permissions').all();
    console.log(`Memindahkan ${rolePerms.length} role_permissions...`);
    for (const rp of rolePerms) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: rp.roleId,
            permissionId: rp.permissionId,
          },
        },
        update: {},
        create: {
          roleId: rp.roleId,
          permissionId: rp.permissionId,
        },
      });
    }

    // 4. CABINET_PERIODS
    const periods: any[] = db.prepare('SELECT * FROM cabinet_periods').all();
    console.log(`Memindahkan ${periods.length} cabinet_periods...`);
    for (const cp of periods) {
      await prisma.cabinetPeriod.upsert({
        where: { id: cp.id },
        update: {
          name: cp.name,
          startYear: Number(cp.startYear),
          endYear: Number(cp.endYear),
          isActive: Boolean(cp.isActive),
          theme: cp.theme,
          vision: cp.vision,
          mission: cp.mission,
        },
        create: {
          id: cp.id,
          name: cp.name,
          startYear: Number(cp.startYear),
          endYear: Number(cp.endYear),
          isActive: Boolean(cp.isActive),
          theme: cp.theme,
          vision: cp.vision,
          mission: cp.mission,
          createdAt: new Date(cp.createdAt),
          updatedAt: new Date(cp.updatedAt),
        },
      });
    }

    // 5. USERS
    const users: any[] = db.prepare('SELECT * FROM users').all();
    console.log(`Memindahkan ${users.length} users...`);
    for (const u of users) {
      await prisma.user.upsert({
        where: { id: u.id },
        update: {
          fullName: u.fullName,
          username: u.username,
          email: u.email,
          passwordHash: u.passwordHash,
          roleId: u.roleId,
          isActive: Boolean(u.isActive),
          avatarUrl: u.avatarUrl,
          lastLoginAt: u.lastLoginAt ? new Date(u.lastLoginAt) : null,
        },
        create: {
          id: u.id,
          fullName: u.fullName,
          username: u.username,
          email: u.email,
          passwordHash: u.passwordHash,
          roleId: u.roleId,
          isActive: Boolean(u.isActive),
          avatarUrl: u.avatarUrl,
          lastLoginAt: u.lastLoginAt ? new Date(u.lastLoginAt) : null,
          createdAt: new Date(u.createdAt),
          updatedAt: new Date(u.updatedAt),
        },
      });
    }

    // 6. CABINET_MEMBERS
    const members: any[] = db.prepare('SELECT * FROM cabinet_members').all();
    console.log(`Memindahkan ${members.length} cabinet_members...`);
    for (const m of members) {
      await prisma.cabinetMember.upsert({
        where: { id: m.id },
        update: {
          name: m.name,
          position: m.position,
          hierarchyLevel: m.hierarchyLevel,
          ministryId: m.ministryId,
          ministryName: m.ministryName,
          faculty: m.faculty,
          initial: m.initial,
          image: m.image,
          email: m.email,
          instagram: m.instagram,
          linkedin: m.linkedin,
          bio: m.bio,
          orderIndex: Number(m.orderIndex),
          isPlaceholder: Boolean(m.isPlaceholder),
          isActive: Boolean(m.isActive),
          cabinetPeriodId: m.cabinetPeriodId,
        },
        create: {
          id: m.id,
          name: m.name,
          position: m.position,
          hierarchyLevel: m.hierarchyLevel,
          ministryId: m.ministryId,
          ministryName: m.ministryName,
          faculty: m.faculty,
          initial: m.initial,
          image: m.image,
          email: m.email,
          instagram: m.instagram,
          linkedin: m.linkedin,
          bio: m.bio,
          orderIndex: Number(m.orderIndex),
          isPlaceholder: Boolean(m.isPlaceholder),
          isActive: Boolean(m.isActive),
          cabinetPeriodId: m.cabinetPeriodId,
          createdAt: new Date(m.createdAt),
          updatedAt: new Date(m.updatedAt),
        },
      });
    }

    // 7. ASPIRATIONS
    const aspirations: any[] = db.prepare('SELECT * FROM aspirations').all();
    console.log(`Memindahkan ${aspirations.length} aspirations...`);
    for (const a of aspirations) {
      await prisma.aspiration.upsert({
        where: { id: a.id },
        update: {
          title: a.title,
          body: a.body,
          category: a.category,
          urgency: a.urgency,
          isAnonymous: Boolean(a.isAnonymous),
          senderName: a.senderName,
          senderNim: a.senderNim,
          senderEmail: a.senderEmail,
          senderPhone: a.senderPhone,
          status: a.status,
        },
        create: {
          id: a.id,
          ticketCode: a.ticketCode,
          title: a.title,
          body: a.body,
          category: a.category,
          urgency: a.urgency,
          isAnonymous: Boolean(a.isAnonymous),
          senderName: a.senderName,
          senderNim: a.senderNim,
          senderEmail: a.senderEmail,
          senderPhone: a.senderPhone,
          status: a.status,
          createdAt: new Date(a.createdAt),
          updatedAt: new Date(a.updatedAt),
        },
      });
    }

    // 8. ASPIRATION_PIPELINE_STEPS
    const pipelineSteps: any[] = db.prepare('SELECT * FROM aspiration_pipeline_steps').all();
    console.log(`Memindahkan ${pipelineSteps.length} aspiration_pipeline_steps...`);
    for (const ps of pipelineSteps) {
      await prisma.aspirationPipelineStep.upsert({
        where: { id: ps.id },
        update: {
          stepNumber: Number(ps.stepNumber),
          title: ps.title,
          description: ps.description,
          status: ps.status,
          completedAt: ps.completedAt ? new Date(ps.completedAt) : null,
        },
        create: {
          id: ps.id,
          aspirationId: ps.aspirationId,
          stepNumber: Number(ps.stepNumber),
          title: ps.title,
          description: ps.description,
          status: ps.status,
          completedAt: ps.completedAt ? new Date(ps.completedAt) : null,
          createdAt: new Date(ps.createdAt),
          updatedAt: new Date(ps.updatedAt),
        },
      });
    }

    // 9. ASPIRATION_NOTES
    const notes: any[] = db.prepare('SELECT * FROM aspiration_notes').all();
    console.log(`Memindahkan ${notes.length} aspiration_notes...`);
    for (const n of notes) {
      await prisma.aspirationNote.upsert({
        where: { id: n.id },
        update: { note: n.note },
        create: {
          id: n.id,
          aspirationId: n.aspirationId,
          authorId: n.authorId,
          note: n.note,
          createdAt: new Date(n.createdAt),
          updatedAt: new Date(n.updatedAt),
        },
      });
    }

    // 10. NEWS_ARTICLES
    const articles: any[] = db.prepare('SELECT * FROM news_articles').all();
    console.log(`Memindahkan ${articles.length} news_articles...`);
    for (const art of articles) {
      await prisma.newsArticle.upsert({
        where: { id: art.id },
        update: {
          slug: art.slug,
          title: art.title,
          excerpt: art.excerpt,
          content: art.content,
          category: art.category,
          coverImage: art.coverImage,
          tags: art.tags,
          department: art.department,
          archiveNumber: art.archiveNumber,
          readTime: art.readTime,
          isFeatured: Boolean(art.isFeatured),
          status: art.status,
          publishedAt: art.publishedAt ? new Date(art.publishedAt) : null,
          authorId: art.authorId,
        },
        create: {
          id: art.id,
          slug: art.slug,
          title: art.title,
          excerpt: art.excerpt,
          content: art.content,
          category: art.category,
          coverImage: art.coverImage,
          tags: art.tags,
          department: art.department,
          archiveNumber: art.archiveNumber,
          readTime: art.readTime,
          isFeatured: Boolean(art.isFeatured),
          status: art.status,
          publishedAt: art.publishedAt ? new Date(art.publishedAt) : null,
          authorId: art.authorId,
          createdAt: new Date(art.createdAt),
          updatedAt: new Date(art.updatedAt),
        },
      });
    }

    // 11. LEGAL_DOCUMENTS
    const documents: any[] = db.prepare('SELECT * FROM legal_documents').all();
    console.log(`Memindahkan ${documents.length} legal_documents...`);
    for (const d of documents) {
      await prisma.legalDocument.upsert({
        where: { id: d.id },
        update: {
          documentNumber: d.documentNumber,
          title: d.title,
          description: d.description,
          category: d.category,
          categoryLabel: d.categoryLabel,
          year: d.year,
          fileUrl: d.fileUrl,
          fileSize: d.fileSize,
          fileFormat: d.fileFormat,
          verifiedStatus: d.verifiedStatus,
          status: d.status,
          cabinetPeriodId: d.cabinetPeriodId,
          uploadedById: d.uploadedById,
        },
        create: {
          id: d.id,
          documentNumber: d.documentNumber,
          title: d.title,
          description: d.description,
          category: d.category,
          categoryLabel: d.categoryLabel,
          year: d.year,
          fileUrl: d.fileUrl,
          fileSize: d.fileSize,
          fileFormat: d.fileFormat,
          verifiedStatus: d.verifiedStatus,
          status: d.status,
          cabinetPeriodId: d.cabinetPeriodId,
          uploadedById: d.uploadedById,
          createdAt: new Date(d.createdAt),
          updatedAt: new Date(d.updatedAt),
        },
      });
    }

    // 12. AUDIT_LOGS
    const logs: any[] = db.prepare('SELECT * FROM audit_logs').all();
    console.log(`Memindahkan ${logs.length} audit_logs...`);
    for (const l of logs) {
      await prisma.auditLog.upsert({
        where: { id: l.id },
        update: {},
        create: {
          id: l.id,
          userId: l.userId,
          action: l.action,
          module: l.module,
          targetId: l.targetId,
          details: l.details,
          ipAddress: l.ipAddress,
          userAgent: l.userAgent,
          createdAt: new Date(l.createdAt),
        },
      });
    }

    console.log('\n================================================================');
    console.log('✓ MIGRASI DATA DARI SQLITE KE POSTGRESQL SELESAI DENGAN SUKSES!');
    console.log('================================================================');
  } catch (error: any) {
    console.error('\n✗ Terjadi kesalahan saat migrasi data:', error.message);
    process.exit(1);
  } finally {
    db.close();
    await prisma.$disconnect();
  }
}

migrateData();

