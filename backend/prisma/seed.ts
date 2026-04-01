import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.meeting.deleteMany();
  await prisma.prayerTime.deleteMany();



  // Seed Meetings (today's meetings)
  const today = new Date();
  const makeTime = (h: number, m: number) => {
    const d = new Date(today);
    d.setHours(h, m, 0, 0);
    return d;
  };

  await prisma.meeting.createMany({
    data: [
      {
        title: "Cloud Infrastructure Sync",
        location: "Ruang Quantum - Lt. 4",
        locationType: "physical",
        startTime: makeTime(14, 0),
        endTime: makeTime(15, 0),
        status: "in_progress",
        attendees: 5,
      },
      {
        title: "Q3 Growth Strategy",
        location: "Ruang Rapat Horizon",
        locationType: "physical",
        startTime: makeTime(15, 30),
        endTime: makeTime(16, 30),
        status: "confirmed",
        attendees: 8,
      },
      {
        title: "Security Audit Review",
        location: "Virtual - Microsoft Teams",
        locationType: "virtual",
        startTime: makeTime(16, 45),
        endTime: makeTime(17, 30),
        status: "pending",
        attendees: 4,
      },
      {
        title: "Marketing Sync",
        location: "Room 402",
        locationType: "physical",
        startTime: makeTime(9, 0),
        endTime: makeTime(10, 30),
        status: "confirmed",
        attendees: 6,
      },
    ],
  });



  // Seed Prayer Times for Cilandak Barat, Jakarta Selatan
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  // Jadwal sholat Cilandak Barat, Jakarta Selatan - Maret 2026 (Muslim Pro)
  await prisma.prayerTime.create({
    data: {
      date: todayDate,
      subuh: "04:41",
      dzuhur: "12:01",
      ashar: "15:14",
      maghrib: "18:02",
      isya: "19:10",
      city: "Cilandak Barat, Jakarta Selatan",
    },
  });

  console.log("Seed data inserted successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
