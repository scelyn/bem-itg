import { prisma } from '../server/src/config/database';
import { comparePassword } from '../server/src/utils/password';
import { signToken, verifyToken } from '../server/src/utils/jwt';
import app from '../server/src/app';
import http from 'http';

async function testExpressLogin() {
  console.log('=== TEST EXPRESS LOGIN END-TO-END ===\n');

  // 1. Check user in DB
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { username: { equals: 'admin.kolektiva', mode: 'insensitive' } },
        { email: { equals: 'admin.kolektiva', mode: 'insensitive' } },
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
    console.error('✗ User admin.kolektiva tidak ditemukan di Supabase!');
    return;
  }
  console.log(`✓ User ditemukan: ${user.username} (${user.email}), Role: ${user.roleId}`);
  console.log(`✓ Role object: ${user.role.name}, Permissions: ${user.role.permissions.length}`);

  // 2. Test JWT Signing
  console.log('\n2. Menguji pembuatan JWT token...');
  try {
    const token = signToken({
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      roleId: user.roleId as any,
      permissions: user.role.permissions.map((p) => p.permissionId),
    });
    console.log(`✓ JWT Token berhasil dibuat (length: ${token.length})`);

    const decoded = verifyToken(token);
    console.log(`✓ JWT Token berhasil diverifikasi: username=${decoded.username}, role=${decoded.roleId}`);
  } catch (err: any) {
    console.error('✗ JWT Error:', err.message);
  }

  // 3. Test HTTP login endpoint directly via Express
  console.log('\n3. Menguji HTTP endpoint login melalui Express Server:');
  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(5001, resolve));
  console.log('   Test Express server running on port 5001');

  try {
    // 3a. Test with wrong password
    const resBad = await fetch('http://127.0.0.1:5001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: 'admin.kolektiva', password: 'DefinitelyWrongPassword123!' }),
    });
    const dataBad = await resBad.json();
    console.log(`   - Login dengan password salah: Status ${resBad.status}, Message: "${dataBad.message}"`);

    // 3b. Test with uppercase username (case sensitivity check)
    const resUpper = await fetch('http://127.0.0.1:5001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: 'ADMIN.KOLEKTIVA', password: 'DefinitelyWrongPassword123!' }),
    });
    const dataUpper = await resUpper.json();
    console.log(`   - Login dengan uppercase "ADMIN.KOLEKTIVA": Status ${resUpper.status}, Message: "${dataUpper.message}"`);

    // 3c. Test with non-existent user
    const resNone = await fetch('http://127.0.0.1:5001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: 'nonexistent_user', password: 'SomePassword' }),
    });
    const dataNone = await resNone.json();
    console.log(`   - Login user tidak ada: Status ${resNone.status}, Message: "${dataNone.message}"`);

  } finally {
    server.close();
    await prisma.$disconnect();
  }
}

testExpressLogin();

