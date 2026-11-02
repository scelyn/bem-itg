import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function testConnection() {
  console.log('================================================================');
  console.log('   UJI KONEKSI TEKNIS SUPABASE POSTGRESQL (PRISMA 6)            ');
  console.log('================================================================\n');

  const databaseUrl = process.env.DATABASE_URL;
  const directUrl = process.env.DIRECT_URL;

  console.log('1. Memeriksa Variabel Lingkungan (.env):');
  if (!databaseUrl || databaseUrl.startsWith('file:')) {
    console.error('   ✗ DATABASE_URL belum diatur ke PostgreSQL (saat ini masih kosong atau SQLite).');
    console.log('   Silakan isi DATABASE_URL dengan connection string Supabase pooler di file .env.');
    process.exit(1);
  } else {
    // Mask password in log
    const maskedDb = databaseUrl.replace(/:([^:@]+)@/, ':****@');
    console.log(`   ✓ DATABASE_URL terdeteksi: ${maskedDb}`);
  }

  if (!directUrl) {
    console.warn('   ⚠ DIRECT_URL belum diatur. Untuk migrasi Supabase yang stabil, direkomendasikan');
    console.warn('     mengisi DIRECT_URL dengan port 5432 (direct connection).');
  } else {
    const maskedDirect = directUrl.replace(/:([^:@]+)@/, ':****@');
    console.log(`   ✓ DIRECT_URL terdeteksi: ${maskedDirect}`);
  }

  console.log('\n2. Menguji Koneksi Aplikasi (DATABASE_URL Pooler):');
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  });

  try {
    const startTime = Date.now();
    await prisma.$connect();
    const duration = Date.now() - startTime;
    console.log(`   ✓ Handshake DATABASE_URL berhasil dalam ${duration}ms!`);

    // Execute test query
    const result: any = await prisma.$queryRaw`SELECT version(), current_database(), current_user;`;
    console.log('   ✓ Query diagnostik berhasil dieksekusi:');
    if (result && result[0]) {
      console.log(`     - Database : ${result[0].current_database}`);
      console.log(`     - User     : ${result[0].current_user}`);
      console.log(`     - Versi PG : ${result[0].version.split(' ')[0]} ${result[0].version.split(' ')[1]}`);
    }
  } catch (err: any) {
    console.error('\n✗ GAGAL TERHUBUNG KE SUPABASE VIA DATABASE_URL:');
    console.error(`   Pesan error: ${err.message}`);
    console.log('\nTips perbaikan:');
    console.log('1. Pastikan password database Supabase benar (bukan password akun email Supabase).');
    console.log('2. Jika password mengandung karakter khusus (@, #, !, %), encode ke URL-encoded format.');
    console.log('3. Pastikan project Supabase tidak dalam keadaan paused / sleeping.');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }

  // Test directUrl if present
  if (directUrl) {
    console.log('\n3. Menguji Koneksi Migrasi & DDL (DIRECT_URL):');
    const directPrisma = new PrismaClient({
      datasources: {
        db: {
          url: directUrl,
        },
      },
    });

    try {
      const startDirect = Date.now();
      await directPrisma.$connect();
      const directDuration = Date.now() - startDirect;
      console.log(`   ✓ Handshake DIRECT_URL berhasil dalam ${directDuration}ms!`);
    } catch (directErr: any) {
      console.warn(`   ⚠ DIRECT_URL belum dapat terhubung: ${directErr.message}`);
      if (directUrl.includes('db.') && directUrl.includes('.supabase.co')) {
        console.warn('   💡 Host direct "db.[project-ref].supabase.co" hanya mendukung IPv6.');
        console.warn('      Jika jaringan internet Anda menggunakan IPv4, ganti DIRECT_URL');
        console.warn('      menggunakan Session Mode Pooler di port 5432:');
        console.warn('      postgresql://postgres.[project-ref]:[PASSWORD]@aws-0-[region].pooler.supabase.com:5432/postgres');
      }
    } finally {
      await directPrisma.$disconnect();
    }
  }

  console.log('\n================================================================');
  console.log('STATUS: Database Supabase PostgreSQL SIAP untuk migrasi schema.');
  console.log('================================================================');
}

testConnection();
