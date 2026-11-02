import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial RBAC roles and permissions for BEM ITG KOLEKTIVA...');

  // 1. ROLES
  const roles = [
    {
      id: 'super_admin',
      name: 'Super Administrator',
      description: 'Akses penuh ke seluruh modul sistem, manajemen pengguna, konfigurasi RBAC, dan audit trail.',
    },
    {
      id: 'admin',
      name: 'Administrator',
      description: 'Pengelolaan operasional, verifikasi dokumen, penelaahan aspirasi, publikasi warta, dan struktur kabinet.',
    },
    {
      id: 'editor',
      name: 'Editor & Redaksi',
      description: 'Penyusunan warta berita, artikel opini, dan manajemen konten editorial.',
    },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { id: role.id },
      update: { name: role.name, description: role.description },
      create: role,
    });
  }
  console.log(`✓ Roles seeded: ${roles.length}`);

  // 2. PERMISSIONS
  const permissions = [
    // Users & Roles
    { id: 'users:create', name: 'Buat Pengguna', module: 'users', action: 'create', description: 'Membuat akun pengelola baru' },
    { id: 'users:read', name: 'Lihat Pengguna', module: 'users', action: 'read', description: 'Melihat daftar akun dan profil pengelola' },
    { id: 'users:update', name: 'Edit Pengguna', module: 'users', action: 'update', description: 'Memperbarui profil, status aktif, atau password pengguna' },
    { id: 'users:delete', name: 'Hapus Pengguna', module: 'users', action: 'delete', description: 'Menghapus atau menonaktifkan akun pengelola' },
    { id: 'users:manage_roles', name: 'Kelola Role & Akses', module: 'users', action: 'manage', description: 'Mengubah role dan hak akses akun' },

    // Aspirations
    { id: 'aspirations:read', name: 'Lihat Aspirasi', module: 'aspirations', action: 'read', description: 'Melihat seluruh aspirasi publik dan detail pengirim' },
    { id: 'aspirations:update_status', name: 'Ubah Status Aspirasi', module: 'aspirations', action: 'update', description: 'Memperbarui tahapan status aspirasi' },
    { id: 'aspirations:manage_pipeline', name: 'Kelola Pipeline Aspirasi', module: 'aspirations', action: 'manage', description: 'Memperbarui tahapan pipeline penanganan aspirasi' },
    { id: 'aspirations:add_notes', name: 'Tambah Catatan Internal', module: 'aspirations', action: 'create', description: 'Menambahkan catatan koordinasi internal komisi' },
    { id: 'aspirations:delete', name: 'Hapus Aspirasi', module: 'aspirations', action: 'delete', description: 'Menghapus arsip aspirasi yang tidak valid/spam' },

    // News
    { id: 'news:create', name: 'Tulis Berita', module: 'news', action: 'create', description: 'Menulis draf artikel warta baru' },
    { id: 'news:read', name: 'Lihat Berita Internal', module: 'news', action: 'read', description: 'Melihat seluruh draf dan artikel yang belum terbit' },
    { id: 'news:update', name: 'Sunting Berita', module: 'news', action: 'update', description: 'Menyunting konten berita dan artikel warta' },
    { id: 'news:publish', name: 'Publikasikan Berita', module: 'news', action: 'publish', description: 'Menerbitkan draf menjadi artikel publik aktif' },
    { id: 'news:delete', name: 'Hapus Berita', module: 'news', action: 'delete', description: 'Menghapus artikel warta dari portal' },

    // Legal Documents
    { id: 'documents:create', name: 'Unggah Dokumen', module: 'documents', action: 'create', description: 'Mengunggah berkas SK, PO, LPJ, dan SOP' },
    { id: 'documents:read', name: 'Lihat Dokumen', module: 'documents', action: 'read', description: 'Melihat arsip dokumen legal dan metadatanya' },
    { id: 'documents:update', name: 'Sunting Metadata Dokumen', module: 'documents', action: 'update', description: 'Memperbarui nomor surat, kategori, dan deskripsi' },
    { id: 'documents:verify', name: 'Verifikasi Dokumen', module: 'documents', action: 'update', description: 'Memberikan cap verifikasi keabsahan dokumen hukum' },
    { id: 'documents:delete', name: 'Hapus Dokumen', module: 'documents', action: 'delete', description: 'Menghapus berkas dokumen dari arsip resmi' },

    // Organization Structure
    { id: 'organization:create', name: 'Tambah Anggota Kabinet', module: 'organization', action: 'create', description: 'Menambahkan data fungsionaris kementerian' },
    { id: 'organization:read', name: 'Lihat Struktur Kabinet', module: 'organization', action: 'read', description: 'Melihat susunan kepengurusan kabinet' },
    { id: 'organization:update', name: 'Perbarui Data Pengurus', module: 'organization', action: 'update', description: 'Memperbarui jabatan, bio, atau kontak pengurus' },
    { id: 'organization:delete', name: 'Hapus Data Pengurus', module: 'organization', action: 'delete', description: 'Menghapus data fungsionaris dari kabinet aktif' },

    // System & Audit
    { id: 'audit:read', name: 'Audit Log Keamanan', module: 'system', action: 'read', description: 'Memeriksa jejak aktivitas dan riwayat autentikasi pengelola' },
    { id: 'system:configure', name: 'Konfigurasi Sistem', module: 'system', action: 'manage', description: 'Mengatur parameter portal, periode aktif, dan integrasi' },
  ];

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { id: permission.id },
      update: {
        name: permission.name,
        module: permission.module,
        action: permission.action,
        description: permission.description,
      },
      create: permission,
    });
  }
  console.log(`✓ Permissions seeded: ${permissions.length}`);

  // 3. ROLE-PERMISSION MAPPINGS
  // Super Admin: All permissions
  const superAdminPerms = permissions.map(p => p.id);

  // Admin: Operational & administrative permissions (no user management / system config)
  const adminPerms = [
    'users:read',
    'aspirations:read',
    'aspirations:update_status',
    'aspirations:manage_pipeline',
    'aspirations:add_notes',
    'aspirations:delete',
    'news:create',
    'news:read',
    'news:update',
    'news:publish',
    'news:delete',
    'documents:create',
    'documents:read',
    'documents:update',
    'documents:verify',
    'documents:delete',
    'organization:create',
    'organization:read',
    'organization:update',
    'organization:delete',
    'audit:read',
  ];

  // Editor: Editorial newsroom and read-only context
  const editorPerms = [
    'news:create',
    'news:read',
    'news:update',
    'aspirations:read',
    'documents:read',
    'organization:read',
  ];

  const roleMappings: { roleId: string; permissions: string[] }[] = [
    { roleId: 'super_admin', permissions: superAdminPerms },
    { roleId: 'admin', permissions: adminPerms },
    { roleId: 'editor', permissions: editorPerms },
  ];

  for (const mapping of roleMappings) {
    for (const permId of mapping.permissions) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: mapping.roleId,
            permissionId: permId,
          },
        },
        update: {},
        create: {
          roleId: mapping.roleId,
          permissionId: permId,
        },
      });
    }
  }
  console.log('✓ Role-Permission matrices mapped');

  // 4. ACTIVE CABINET PERIOD
  const cabinetPeriod = await prisma.cabinetPeriod.upsert({
    where: { id: '2026-2027' },
    update: {
      name: 'Kabinet KOLEKTIVA',
      startYear: 2026,
      endYear: 2027,
      isActive: true,
      theme: 'Sinergi Progresif, Integritas Inklusif',
      vision: 'Mewujudkan BEM ITG sebagai wadah perjuangan mahasiswa yang adaptif, berintegritas, dan solutif bagi kemajuan sivitas akademika dan masyarakat luas.',
      mission: '1. Mengakselerasi penyaluran aspirasi mahasiswa secara transparan dan akuntabel.\n2. Mengembangkan nalar intelektual, daya cipta riset, dan budaya kolaboratif lintas disiplin ilmu.\n3. Mewujudkan tata kelola organisasi yang transparan, modern, dan berbasis data.',
    },
    create: {
      id: '2026-2027',
      name: 'Kabinet KOLEKTIVA',
      startYear: 2026,
      endYear: 2027,
      isActive: true,
      theme: 'Sinergi Progresif, Integritas Inklusif',
      vision: 'Mewujudkan BEM ITG sebagai wadah perjuangan mahasiswa yang adaptif, berintegritas, dan solutif bagi kemajuan sivitas akademika dan masyarakat luas.',
      mission: '1. Mengakselerasi penyaluran aspirasi mahasiswa secara transparan dan akuntabel.\n2. Mengembangkan nalar intelektual, daya cipta riset, dan budaya kolaboratif lintas disiplin ilmu.\n3. Mewujudkan tata kelola organisasi yang transparan, modern, dan berbasis data.',
    },
  });
  console.log(`✓ Active Cabinet Period seeded: ${cabinetPeriod.name} (${cabinetPeriod.id})`);

  console.log('RBAC and foundation seed completed successfully.');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

