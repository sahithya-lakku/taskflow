import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ADMIN_EMAIL = 'sahithyalakku1234@gmail.com';
const ADMIN_PASSWORD = '23BCE20136';

async function main() {
  const hashed = await bcrypt.hash(ADMIN_PASSWORD, 12);
  const existing = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } });

  if (existing) {
    await prisma.user.update({ where: { email: ADMIN_EMAIL }, data: { role: 'SUPER_ADMIN', password: hashed, suspended: false } });
    console.log('Updated existing SUPER_ADMIN user');
  } else {
    const user = await prisma.user.create({
      data: {
        name: 'Platform Super Admin',
        email: ADMIN_EMAIL,
        password: hashed,
        role: 'SUPER_ADMIN',
      },
    });
    await prisma.profile.create({ data: { userId: user.id, title: 'Super Admin', skills: ['Governance', 'Operations'] } });
    console.log('Created SUPER_ADMIN user');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
