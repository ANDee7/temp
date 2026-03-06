import type { Booking, Business, Client, Service, Staff } from "@dikidi-clone/shared";

const businessId = "4f2afadb-d4a0-4ee7-8b65-0f0f1f21ab44";
const staff1Id = "0ad7f7ab-1f68-4d39-804f-84e6f7fcf2ea";
const staff2Id = "8062f8db-bc18-47c1-9503-89f9af813f20";
const service1Id = "6c2435be-b9fd-40a6-a719-1734fbd8465c";
const service2Id = "1b89f1f0-92a2-4519-b10e-02ef8ecf0d67";

export const mockBusinesses: Business[] = [
  {
    id: businessId,
    slug: "beauty-lab-moscow",
    name: "Beauty Lab Moscow",
    city: "Moscow",
    timezone: "Europe/Moscow",
    phone: "+74950000000",
    description: "Студия красоты с онлайн-записью и CRM-процессами."
  }
];

export const mockServices: Service[] = [
  {
    id: service1Id,
    businessId,
    name: "Женская стрижка",
    category: "hair",
    durationMin: 60,
    price: 2500,
    currency: "RUB",
    isActive: true
  },
  {
    id: service2Id,
    businessId,
    name: "Маникюр + покрытие",
    category: "nails",
    durationMin: 90,
    price: 2200,
    currency: "RUB",
    isActive: true
  }
];

export const mockStaff: Staff[] = [
  {
    id: staff1Id,
    businessId,
    fullName: "Анна Ильина",
    role: "Senior Hair Stylist",
    serviceIds: [service1Id]
  },
  {
    id: staff2Id,
    businessId,
    fullName: "Екатерина Миронова",
    role: "Nail Master",
    serviceIds: [service2Id]
  }
];

export const mockClients: Client[] = [];

export const mockBookings: Booking[] = [];
