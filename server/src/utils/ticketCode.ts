import { prisma } from '../config/database';

/**
 * Generates the next sequential ticket code for aspirations, e.g. "ASP-2026-001".
 */
export async function generateAspirationTicketCode(): Promise<string> {
  const currentYear = new Date().getFullYear();
  const prefix = `ASP-${currentYear}-`;

  // Count existing aspirations for the current year
  const count = await prisma.aspiration.count({
    where: {
      ticketCode: {
        startsWith: prefix,
      },
    },
  });

  const nextNumber = (count + 1).toString().padStart(3, '0');
  let candidate = `${prefix}${nextNumber}`;

  // Ensure collision safety
  let existing = await prisma.aspiration.findUnique({
    where: { ticketCode: candidate },
  });

  let offset = 1;
  while (existing) {
    const fallbackNum = (count + 1 + offset).toString().padStart(3, '0');
    candidate = `${prefix}${fallbackNum}`;
    existing = await prisma.aspiration.findUnique({
      where: { ticketCode: candidate },
    });
    offset++;
  }

  return candidate;
}

