import { PrismaClient, Role } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL env variable is not set. Cannot run seed script.');
  process.exit(1);
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Clearing old sample data...');

  await prisma.attachmentMeta.deleteMany({});
  await prisma.auditLog.deleteMany({});
  await prisma.action.deleteMany({});
  await prisma.reply.deleteMany({});
  await prisma.email.deleteMany({});
  await prisma.contact.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Creating default user...');

  await prisma.user.create({
    data: {
      email: 'neeraj.kumar@company.com',
      name: 'Neeraj Kumar',
      role: Role.MANAGER,
    },
  });

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });