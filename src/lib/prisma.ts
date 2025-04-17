import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

const prismaClientSingleton = () => {
  // Don't initialize Prisma during static builds
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return undefined;
  }

  if (!process.env.DATABASE_URL) {
    console.warn('DATABASE_URL is not set. Prisma client will not be initialized.');
    return undefined;
  }

  return new PrismaClient({
    log: ['query', 'error', 'warn']
  });
};

const prisma = global.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma; 