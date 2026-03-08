import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const businessId = "4f2afadb-d4a0-4ee7-8b65-0f0f1f21ab44";
const staff1Id = "0ad7f7ab-1f68-4d39-804f-84e6f7fcf2ea";
const staff2Id = "8062f8db-bc18-47c1-9503-89f9af813f20";
const service1Id = "6c2435be-b9fd-40a6-a719-1734fbd8465c";
const service2Id = "1b89f1f0-92a2-4519-b10e-02ef8ecf0d67";
const scheduleOverrideDate = new Date("2099-12-31T00:00:00.000Z");

async function main() {
  await prisma.business.upsert({
    where: { slug: "beauty-lab-moscow" },
    update: {
      name: "Beauty Lab Moscow",
      city: "Moscow",
      timezone: "Europe/Moscow",
      phone: "+74950000000",
      description: "Студия красоты с онлайн-записью и CRM-процессами."
    },
    create: {
      id: businessId,
      slug: "beauty-lab-moscow",
      name: "Beauty Lab Moscow",
      city: "Moscow",
      timezone: "Europe/Moscow",
      phone: "+74950000000",
      description: "Студия красоты с онлайн-записью и CRM-процессами."
    }
  });

  await prisma.service.upsert({
    where: { id: service1Id },
    update: {
      businessId,
      name: "Женская стрижка",
      category: "hair",
      durationMin: 60,
      price: 2500,
      currency: "RUB",
      isActive: true
    },
    create: {
      id: service1Id,
      businessId,
      name: "Женская стрижка",
      category: "hair",
      durationMin: 60,
      price: 2500,
      currency: "RUB",
      isActive: true
    }
  });

  await prisma.service.upsert({
    where: { id: service2Id },
    update: {
      businessId,
      name: "Маникюр + покрытие",
      category: "nails",
      durationMin: 90,
      price: 2200,
      currency: "RUB",
      isActive: true
    },
    create: {
      id: service2Id,
      businessId,
      name: "Маникюр + покрытие",
      category: "nails",
      durationMin: 90,
      price: 2200,
      currency: "RUB",
      isActive: true
    }
  });

  await prisma.staff.upsert({
    where: { id: staff1Id },
    update: {
      businessId,
      fullName: "Анна Ильина",
      role: "Senior Hair Stylist"
    },
    create: {
      id: staff1Id,
      businessId,
      fullName: "Анна Ильина",
      role: "Senior Hair Stylist"
    }
  });

  await prisma.staff.upsert({
    where: { id: staff2Id },
    update: {
      businessId,
      fullName: "Екатерина Миронова",
      role: "Nail Master"
    },
    create: {
      id: staff2Id,
      businessId,
      fullName: "Екатерина Миронова",
      role: "Nail Master"
    }
  });

  await prisma.staffService.deleteMany({
    where: {
      OR: [{ staffId: staff1Id }, { staffId: staff2Id }]
    }
  });

  await prisma.staffService.createMany({
    data: [
      { staffId: staff1Id, serviceId: service1Id },
      { staffId: staff2Id, serviceId: service2Id }
    ],
    skipDuplicates: true
  });

  const workingHoursSeed = [
    { staffId: staff1Id, weekday: 1, startMinute: 10 * 60, endMinute: 20 * 60 },
    { staffId: staff1Id, weekday: 2, startMinute: 10 * 60, endMinute: 20 * 60 },
    { staffId: staff1Id, weekday: 3, startMinute: 10 * 60, endMinute: 20 * 60 },
    { staffId: staff1Id, weekday: 4, startMinute: 10 * 60, endMinute: 20 * 60 },
    { staffId: staff1Id, weekday: 5, startMinute: 10 * 60, endMinute: 20 * 60 },
    { staffId: staff1Id, weekday: 6, startMinute: 10 * 60, endMinute: 18 * 60 },
    { staffId: staff2Id, weekday: 1, startMinute: 12 * 60, endMinute: 21 * 60 },
    { staffId: staff2Id, weekday: 2, startMinute: 12 * 60, endMinute: 21 * 60 },
    { staffId: staff2Id, weekday: 3, startMinute: 12 * 60, endMinute: 21 * 60 },
    { staffId: staff2Id, weekday: 4, startMinute: 12 * 60, endMinute: 21 * 60 },
    { staffId: staff2Id, weekday: 5, startMinute: 12 * 60, endMinute: 21 * 60 }
  ];

  for (const row of workingHoursSeed) {
    await prisma.staffWorkingHours.upsert({
      where: {
        staffId_weekday: {
          staffId: row.staffId,
          weekday: row.weekday
        }
      },
      update: {
        startMinute: row.startMinute,
        endMinute: row.endMinute
      },
      create: row
    });
  }

  await prisma.staffScheduleOverride.upsert({
    where: {
      staffId_date: {
        staffId: staff1Id,
        date: scheduleOverrideDate
      }
    },
    update: {
      isDayOff: false,
      startMinute: 14 * 60,
      endMinute: 18 * 60,
      note: "Сокращенный график"
    },
    create: {
      staffId: staff1Id,
      date: scheduleOverrideDate,
      isDayOff: false,
      startMinute: 14 * 60,
      endMinute: 18 * 60,
      note: "Сокращенный график"
    }
  });

  await prisma.staffScheduleOverride.upsert({
    where: {
      staffId_date: {
        staffId: staff2Id,
        date: scheduleOverrideDate
      }
    },
    update: {
      isDayOff: true,
      startMinute: null,
      endMinute: null,
      note: "Отпуск"
    },
    create: {
      staffId: staff2Id,
      date: scheduleOverrideDate,
      isDayOff: true,
      note: "Отпуск"
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
