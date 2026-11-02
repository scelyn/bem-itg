import app from './app';
import { env } from './config/env';
import { prisma } from './config/database';

const PORT = env.PORT;

async function bootstrap() {
  try {
    // Verify database connection with retry for cloud resilience
    let retries = 3;
    while (retries > 0) {
      try {
        await prisma.$connect();
        console.log('✓ Database connection established successfully via Prisma.');
        break;
      } catch (err: any) {
        retries--;
        console.warn(`[Database] Connection attempt failed (${err.message}). Retrying... (${retries} left)`);
        if (retries === 0) throw err;
        await new Promise((r) => setTimeout(r, 2000));
      }
    }

    const server = app.listen(PORT, () => {
      console.log(`🚀 BEM ITG KOLEKTIVA Backend Server running on http://localhost:${PORT}`);
      console.log(`   API Base URL: http://localhost:${PORT}/api`);
      console.log(`   Environment : ${env.NODE_ENV}`);
    });

    const shutdown = async (signal: string) => {
      console.log(`Received ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        await prisma.$disconnect();
        console.log('Prisma disconnected. Server closed.');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    console.error('Fatal error starting backend server:', error);
    process.exit(1);
  }
}

bootstrap();

