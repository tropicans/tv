const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const meetings = await prisma.meeting.findMany();
  console.log(JSON.stringify(meetings, null, 2));
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
