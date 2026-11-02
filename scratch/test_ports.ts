import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

async function testPorts() {
  const basePooler = process.env.DATABASE_URL;
  if (!basePooler) return;

  console.log('Testing connection to port 6543 (Transaction Pooler)...');
  const prisma6543 = new PrismaClient({
    datasources: { db: { url: basePooler } },
  });
  try {
    const t0 = Date.now();
    await prisma6543.$connect();
    console.log(`✓ Port 6543 connected in ${Date.now() - t0}ms`);
    await prisma6543.$disconnect();
  } catch (e: any) {
    console.log(`✗ Port 6543 failed: ${e.message}`);
  }

  // Test port 5432 Session Pooler
  const sessionUrl = basePooler.replace(':6543/', ':5432/').replace('?pgbouncer=true', '');
  console.log('\nTesting connection to port 5432 (Session Pooler)...');
  const prisma5432 = new PrismaClient({
    datasources: { db: { url: sessionUrl } },
  });
  try {
    const t0 = Date.now();
    await prisma5432.$connect();
    console.log(`✓ Port 5432 connected in ${Date.now() - t0}ms`);
    await prisma5432.$disconnect();
  } catch (e: any) {
    console.log(`✗ Port 5432 failed: ${e.message}`);
  }
}

testPorts();

