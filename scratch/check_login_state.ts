import { prisma } from '../server/src/config/database';

async function diagnose() {
  console.log('=== AUDIT LOGIN END-TO-END DIAGNOSTIC ===\n');

  try {
    console.log('1. Menguji koneksi database Supabase...');
    await prisma.$connect();
    console.log('   ✓ Terhubung ke database.\n');

    console.log('2. Memeriksa tabel roles di Supabase:');
    const roles = await prisma.role.findMany();
    console.log(`   Ditemukan ${roles.length} roles:`, roles.map((r) => r.id));

    console.log('\n3. Memeriksa tabel permissions & role_permissions:');
    const permCount = await prisma.permission.count();
    const rolePermCount = await prisma.rolePermission.count();
    console.log(`   Total permissions: ${permCount}`);
    console.log(`   Total role_permissions: ${rolePermCount}`);

    console.log('\n4. Memeriksa data users di Supabase:');
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        roleId: true,
        isActive: true,
        passwordHash: true,
      },
    });
    console.log(`   Total users: ${users.length}`);

    for (const u of users) {
      console.log(`   - User: "${u.username}", Email: "${u.email}", Role: "${u.roleId}", Active: ${u.isActive}`);
      console.log(`     Hash format valid: ${u.passwordHash?.startsWith('$2')}, Hash length: ${u.passwordHash?.length}`);
    }

    if (users.length > 0) {
      const firstUser = users[0];
      console.log(`\n5. Menguji query login prisma.user.findFirst untuk username "${firstUser.username}":`);

      // Test exact match
      const foundExact = await prisma.user.findFirst({
        where: {
          OR: [
            { username: firstUser.username },
            { email: firstUser.email },
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

      if (!foundExact) {
        console.log('   ✗ GAGAL: User tidak ditemukan dengan query exact.');
      } else {
        console.log('   ✓ User berhasil ditemukan dengan query Prisma.');
        console.log(`   Role object: ${foundExact.role ? 'Ada' : 'NULL'}`);
        if (foundExact.role) {
          console.log(`   Permissions count: ${foundExact.role.permissions?.length ?? 'UNDEFINED'}`);
        }
      }

      // Test with case variations
      const upperUsername = firstUser.username.toUpperCase();
      console.log(`\n6. Menguji case sensitivity untuk "${upperUsername}":`);
      const foundUpper = await prisma.user.findFirst({
        where: {
          OR: [
            { username: upperUsername },
            { email: upperUsername },
          ],
        },
      });
      console.log(`   Hasil pencarian uppercase "${upperUsername}": ${foundUpper ? 'DITEMUKAN' : 'TIDAK DITEMUKAN (Case Sensitive!)'}`);
    }

  } catch (err: any) {
    console.error('DIAGNOSTIC ERROR:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

diagnose();

