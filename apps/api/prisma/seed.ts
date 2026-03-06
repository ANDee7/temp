import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const businessId = "4f2afadb-d4a0-4ee7-8b65-0f0f1f21ab44";
const staff1Id = "0ad7f7ab-1f68-4d39-804f-84e6f7fcf2ea";
const staff2Id = "8062f8db-bc18-47c1-9503-89f9af813f20";
const service1Id = "6c2435be-b9fd-40a6-a719-1734fbd8465c";
const service2Id = "1b89f1f0-92a2-4519-b10e-02ef8ecf0d67";

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
