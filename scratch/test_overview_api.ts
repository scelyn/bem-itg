import { prisma } from '../server/src/config/database';
import { signToken } from '../server/src/utils/jwt';
import app from '../server/src/app';
import http from 'http';

async function testOverviewApi() {
  console.log('=== TEST OVERVIEW METRICS API (SUPABASE BACKEND) ===\n');

  // Find super admin
  const user = await prisma.user.findFirst({
    where: { roleId: 'super_admin' },
  });

  if (!user) {
    console.error('Super admin not found!');
    return;
  }

  const token = signToken({
    id: user.id,
    username: user.username,
    email: user.email,
    fullName: user.fullName,
    roleId: user.roleId as any,
    permissions: ['all'],
  });

  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(5002, resolve));
  console.log('✓ Test server listening on 5002');

  try {
    const res = await fetch('http://127.0.0.1:5002/api/stats/metrics', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(`Response status: ${res.status}`);
    const data = await res.json();
    console.log('API Response data:', JSON.stringify(data, null, 2));

    if (data.success && data.metrics) {
      console.log('\n✓ METRICS VERIFIED:');
      console.log(`  - Total Users: ${data.metrics.totalUsers}`);
      console.log(`  - Total Aspirations: ${data.metrics.totalAspirations}`);
      console.log(`  - Pending Aspirations: ${data.metrics.pendingAspirations}`);
      console.log(`  - Total News: ${data.metrics.totalNews}`);
      console.log(`  - Total Documents: ${data.metrics.totalDocuments}`);
      console.log(`  - Active Period: ${data.metrics.activePeriod?.name} (${data.metrics.activePeriod?.id})`);
      console.log(`  - Recent Audit Logs Count: ${data.recentAuditLogs?.length}`);
    }
  } finally {
    server.close();
    await prisma.$disconnect();
  }
}

testOverviewApi();

