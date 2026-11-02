import { prisma } from '../config/database';
import { hashPassword } from '../utils/password';

async function run() {
  const args = process.argv.slice(2);
  const getArg = (flag: string) => {
    const idx = args.indexOf(flag);
    return idx !== -1 && args[idx + 1] ? args[idx + 1] : undefined;
  };

  const username = getArg('--username') || process.env.ADMIN_USERNAME;
  const email = getArg('--email') || process.env.ADMIN_EMAIL;
  const password = getArg('--password') || process.env.ADMIN_PASSWORD;
  const fullName = getArg('--name') || process.env.ADMIN_NAME || 'Super Administrator KOLEKTIVA';
  const roleId = (getArg('--role') || process.env.ADMIN_ROLE || 'super_admin').toLowerCase();

  if (!username || !email || !password) {
    console.log(`
Usage:
  npx tsx server/src/scripts/createAdminCli.ts --username <username> --email <email> --password <password> [--name "<name>"] [--role <super_admin|admin|editor>]

Or set environment variables:
  ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME, ADMIN_ROLE
    `);
    process.exit(1);
  }

  const validRoles = ['super_admin', 'admin', 'editor'];
  if (!validRoles.includes(roleId)) {
    console.error(`Invalid role: ${roleId}. Must be one of: ${validRoles.join(', ')}`);
    process.exit(1);
  }

  console.log(`Checking existing account for username '${username}' or email '${email}'...`);

  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ username }, { email }],
    },
  });

  const passwordHash = await hashPassword(password);

  if (existing) {
    const updated = await prisma.user.update({
      where: { id: existing.id },
      data: {
        passwordHash,
        roleId,
        fullName,
        isActive: true,
      },
    });
    console.log(`✓ Existing user '${updated.username}' updated with new password and role '${updated.roleId}'.`);
  } else {
    const created = await prisma.user.create({
      data: {
        username: username.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        fullName,
        passwordHash,
        roleId,
        isActive: true,
      },
    });
    console.log(`✓ New user '${created.username}' created successfully with role '${created.roleId}'.`);
  }
}

run()
  .catch((err) => {
    console.error('Error creating admin:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

