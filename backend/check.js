const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.meeting.findMany().then(m => console.dir(m, {depth: null})).finally(() => prisma.$disconnect());
