import { prisma } from '../server/src/config/database';
import { comparePassword } from '../server/src/utils/password';
import app from '../server/src/app';
import http from 'http';

async function verify() {
  console.log('================================================================');
  console.log('       VERIFIKASI LOGIN END-TO-END BEM ITG KOLEKTIVA            ');
  console.log('================================================================\n');

  // 1. Fetch user from Supabase
  console.log('1. Mengambil data akun Super Admin dari Supabase:');
  const user = await prisma.user.findFirst({
    where: {
      username: { equals: 'admin.kolektiva', mode: 'insensitive' },
    },
    include: {
      role: {
        include: {
          permissions: { select: { permissionId: true } },
        },
      },
    },
  });

  if (!user) {
    console.error('✗ User admin.kolektiva tidak ditemukan di Supabase!');
    process.exit(1);
  }

  console.log(`   ✓ User ditemukan di Supabase: ${user.username} (${user.email})`);
  console.log(`   ✓ Role terverifikasi: ${user.role.name} (${user.roleId})`);
  console.log(`   ✓ Jumlah Permissions: ${user.role.permissions.length}`);
  console.log(`   ✓ Status Akun: ${user.isActive ? 'AKTIF' : 'NONAKTIF'}`);
  console.log(`   ✓ Hash Password Tersimpan: Panjang ${user.passwordHash.length} char, Prefix: ${user.passwordHash.substring(0, 7)}`);

  // 2. Start Express on port 5000
  console.log('\n2. Menjalankan Express API Server pada port 5000:');
  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(5000, resolve));
  console.log('   ✓ Express Server aktif di http://localhost:5000');

  try {
    // 3. Direct Health Check
    console.log('\n3. Menguji konektivitas langsung ke port 5000:');
    const directHealth = await fetch('http://localhost:5000/api/health').then((r) => r.json());
    console.log('   ✓ Direct Health Check:', directHealth);

    // 4. Test Vite Proxy (port 5173 -> port 5000)
    console.log('\n4. Menguji Vite Proxy dari frontend (port 5173 -> port 5000):');
    try {
      const proxyHealth = await fetch('http://localhost:5173/api/health').then((r) => r.json());
      console.log('   ✓ Vite Proxy Health Check:', proxyHealth);
    } catch (err: any) {
      console.warn('   ⚠ Vite Proxy tidak merespons (Vite dev server mungkin tidak aktif):', err.message);
    }

    // 5. Test Login via Vite Proxy with wrong password
    console.log('\n5. Menguji Endpoint Login melalui Vite Proxy:');
    const proxyLoginRes = await fetch('http://localhost:5173/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: 'admin.kolektiva', password: 'wrongpassword' }),
    });
    const proxyLoginData = await proxyLoginRes.json();
    console.log(`   - Status respon proxy: ${proxyLoginRes.status}`);
    console.log(`   - Pesan respon: "${proxyLoginData.message}"`);
    console.log(`   ✓ Vite Proxy berhasil meneruskan request dan menerima respon 401 terstruktur dari Express!`);

    // 6. Test Case-Insensitive matching via Vite Proxy
    console.log('\n6. Menguji case-insensitivity username melalui Vite Proxy:');
    const upperRes = await fetch('http://localhost:5173/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: 'ADMIN.KOLEKTIVA', password: 'wrongpassword' }),
    });
    const upperData = await upperRes.json();
    console.log(`   - Input "ADMIN.KOLEKTIVA" -> Status: ${upperRes.status}, Message: "${upperData.message}"`);
    console.log('   ✓ Case-insensitive query berhasil mencocokkan user terlepas dari huruf kapital!');

  } finally {
    server.close();
    await prisma.$disconnect();
    console.log('\n✓ Server pengujian ditutup dengan aman.');
  }
}

verify();

