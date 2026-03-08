import { PrismaClient } from "@prisma/client";
import type { Booking, Business, Client, Service, Staff } from "@dikidi-clone/shared";
import { BookingSchema, BusinessSchema, ClientSchema, ServiceSchema, StaffSchema } from "@dikidi-clone/shared";
import { v4 as uuidv4 } from "uuid";
import {
  mockBookings,
  mockBusinesses,
  mockClients,
  mockStaffScheduleOverrides,
  mockStaffWorkingHours,
  mockServices,
  mockStaff
} from "./in-memory-store.js";

export interface CatalogRepository {
  getBusinessBySlug(slug: string): Promise<Business | null>;
  listServices(businessId: string): Promise<Service[]>;
}

export interface StaffRepository {
  listByBusiness(businessId: string): Promise<Staff[]>;
  getWorkingHours(staffId: string, weekday: number): Promise<{
    startMinute: number;
    endMinute: number;
  } | null>;
  getDateOverride(staffId: string, date: string): Promise<{
    isDayOff: boolean;
    startMinute?: number;
    endMinute?: number;
  } | null>;
}

export interface ClientsRepository {
  upsert(input: { fullName: string; phone: string; email?: string }): Promise<Client>;
  list(): Promise<Client[]>;
}

export interface BookingsRepository {
  getServiceById(serviceId: string): Promise<Service | null>;
  hasCollision(input: { staffId: string; startAt: Date; endAt: Date }): Promise<boolean>;
  listByStaffInRange(input: { staffId: string; startAt: Date; endAt: Date }): Promise<Booking[]>;
  create(input: {
    businessId: string;
    serviceId: string;
    staffId: string;
    clientId: string;
    startAt: Date;
    endAt: Date;
    notes?: string;
  }): Promise<Booking>;
  listByBusiness(businessId: string): Promise<Booking[]>;
}

export class InMemoryCatalogRepository implements CatalogRepository {
  async getBusinessBySlug(slug: string): Promise<Business | null> {
    return mockBusinesses.find((business) => business.slug === slug) ?? null;
  }

  async listServices(businessId: string): Promise<Service[]> {
    return mockServices.filter((service) => service.businessId === businessId && service.isActive);
  }
}

export class InMemoryStaffRepository implements StaffRepository {
  async listByBusiness(businessId: string): Promise<Staff[]> {
    return mockStaff.filter((staff) => staff.businessId === businessId);
  }

  async getWorkingHours(staffId: string, weekday: number): Promise<{
    startMinute: number;
    endMinute: number;
  } | null> {
    const workingHours = mockStaffWorkingHours.find(
      (entry) => entry.staffId === staffId && entry.weekday === weekday
    );
    return workingHours
      ? {
          startMinute: workingHours.startMinute,
          endMinute: workingHours.endMinute
        }
      : null;
  }

  async getDateOverride(staffId: string, date: string): Promise<{
    isDayOff: boolean;
    startMinute?: number;
    endMinute?: number;
  } | null> {
    const override = mockStaffScheduleOverrides.find(
      (entry) => entry.staffId === staffId && entry.date === date
    );
    return override
      ? {
          isDayOff: override.isDayOff,
          startMinute: override.startMinute,
          endMinute: override.endMinute
        }
      : null;
  }
}

export class InMemoryClientsRepository implements ClientsRepository {
  async upsert(input: { fullName: string; phone: string; email?: string }): Promise<Client> {
    const existing = mockClients.find((client) => client.phone === input.phone);
    if (existing) {
      existing.fullName = input.fullName;
      existing.email = input.email;
      return existing;
    }

    const created: Client = {
      id: uuidv4(),
      fullName: input.fullName,
      phone: input.phone,
      email: input.email
    };
    mockClients.push(created);
    return created;
  }

  async list(): Promise<Client[]> {
    return [...mockClients];
  }
}

export class InMemoryBookingsRepository implements BookingsRepository {
  async getServiceById(serviceId: string): Promise<Service | null> {
    return mockServices.find((entry) => entry.id === serviceId) ?? null;
  }

  async hasCollision(input: { staffId: string; startAt: Date; endAt: Date }): Promise<boolean> {
    return mockBookings.some((booking) => {
      if (booking.staffId !== input.staffId) {
        return false;
      }
      if (booking.status === "cancelled") {
        return false;
      }
      return input.startAt < new Date(booking.endAt) && new Date(booking.startAt) < input.endAt;
    });
  }

  async listByStaffInRange(input: { staffId: string; startAt: Date; endAt: Date }): Promise<Booking[]> {
    return mockBookings.filter((booking) => {
      if (booking.staffId !== input.staffId) {
        return false;
      }
      if (booking.status === "cancelled") {
        return false;
      }
      const bookingStart = new Date(booking.startAt);
      const bookingEnd = new Date(booking.endAt);
      return bookingStart < input.endAt && input.startAt < bookingEnd;
    });
  }

  async create(input: {
    businessId: string;
    serviceId: string;
    staffId: string;
    clientId: string;
    startAt: Date;
    endAt: Date;
    notes?: string;
  }): Promise<Booking> {
    const created = BookingSchema.parse({
      id: uuidv4(),
      businessId: input.businessId,
      serviceId: input.serviceId,
      staffId: input.staffId,
      clientId: input.clientId,
      startAt: input.startAt.toISOString(),
      endAt: input.endAt.toISOString(),
      status: "created",
      notes: input.notes
    });
    mockBookings.push(created);
    return created;
  }

  async listByBusiness(businessId: string): Promise<Booking[]> {
    return mockBookings.filter((booking) => booking.businessId === businessId);
  }
}

export class PrismaCatalogRepository implements CatalogRepository {
  constructor(private readonly prismaClient: PrismaClient) {}

  async getBusinessBySlug(slug: string): Promise<Business | null> {
    const business = await this.prismaClient.business.findUnique({ where: { slug } });
    return business ? BusinessSchema.parse(business) : null;
  }

  async listServices(businessId: string): Promise<Service[]> {
    const services = await this.prismaClient.service.findMany({
      where: { businessId, isActive: true },
      orderBy: { name: "asc" }
    });

    return services.map((service) =>
      ServiceSchema.parse({
        ...service,
        price: Number(service.price)
      })
    );
  }
}

export class PrismaStaffRepository implements StaffRepository {
  constructor(private readonly prismaClient: PrismaClient) {}

  async listByBusiness(businessId: string): Promise<Staff[]> {
    const staff = await this.prismaClient.staff.findMany({
      where: { businessId },
      include: { services: true },
      orderBy: { fullName: "asc" }
    });

    return staff.map((member) =>
      StaffSchema.parse({
        id: member.id,
        businessId: member.businessId,
        fullName: member.fullName,
        role: member.role,
        serviceIds: member.services.map((link) => link.serviceId)
      })
    );
  }

  async getWorkingHours(staffId: string, weekday: number): Promise<{
    startMinute: number;
    endMinute: number;
  } | null> {
    const workingHours = await this.prismaClient.staffWorkingHours.findUnique({
      where: {
        staffId_weekday: {
          staffId,
          weekday
        }
      }
    });

    return workingHours
      ? {
          startMinute: workingHours.startMinute,
          endMinute: workingHours.endMinute
        }
      : null;
  }

  async getDateOverride(staffId: string, date: string): Promise<{
    isDayOff: boolean;
    startMinute?: number;
    endMinute?: number;
  } | null> {
    const override = await this.prismaClient.staffScheduleOverride.findUnique({
      where: {
        staffId_date: {
          staffId,
          date: new Date(`${date}T00:00:00.000Z`)
        }
      }
    });

    return override
      ? {
          isDayOff: override.isDayOff,
          startMinute: override.startMinute ?? undefined,
          endMinute: override.endMinute ?? undefined
        }
      : null;
  }
}

export class PrismaClientsRepository implements ClientsRepository {
  constructor(private readonly prismaClient: PrismaClient) {}

  async upsert(input: { fullName: string; phone: string; email?: string }): Promise<Client> {
    const client = await this.prismaClient.client.upsert({
      where: { phone: input.phone },
      update: {
        fullName: input.fullName,
        email: input.email
      },
      create: {
        fullName: input.fullName,
        phone: input.phone,
        email: input.email
      }
    });

    return ClientSchema.parse(client);
  }

  async list(): Promise<Client[]> {
    const clients = await this.prismaClient.client.findMany({
      orderBy: { fullName: "asc" }
    });
    return clients.map((client) => ClientSchema.parse(client));
  }
}

export class PrismaBookingsRepository implements BookingsRepository {
  constructor(private readonly prismaClient: PrismaClient) {}

  async getServiceById(serviceId: string): Promise<Service | null> {
    const service = await this.prismaClient.service.findUnique({ where: { id: serviceId } });
    return service
      ? ServiceSchema.parse({
          ...service,
          price: Number(service.price)
        })
      : null;
  }

  async hasCollision(input: { staffId: string; startAt: Date; endAt: Date }): Promise<boolean> {
    const booking = await this.prismaClient.booking.findFirst({
      where: {
        staffId: input.staffId,
        status: { not: "cancelled" },
        startAt: { lt: input.endAt },
        endAt: { gt: input.startAt }
      }
    });
    return Boolean(booking);
  }

  async listByStaffInRange(input: { staffId: string; startAt: Date; endAt: Date }): Promise<Booking[]> {
    const bookings = await this.prismaClient.booking.findMany({
      where: {
        staffId: input.staffId,
        status: { not: "cancelled" },
        startAt: { lt: input.endAt },
        endAt: { gt: input.startAt }
      },
      orderBy: { startAt: "asc" }
    });

    return bookings.map((booking) =>
      BookingSchema.parse({
        ...booking,
        startAt: booking.startAt.toISOString(),
        endAt: booking.endAt.toISOString()
      })
    );
  }

  async create(input: {
    businessId: string;
    serviceId: string;
    staffId: string;
    clientId: string;
    startAt: Date;
    endAt: Date;
    notes?: string;
  }): Promise<Booking> {
    const booking = await this.prismaClient.booking.create({
      data: {
        businessId: input.businessId,
        serviceId: input.serviceId,
        staffId: input.staffId,
        clientId: input.clientId,
        startAt: input.startAt,
        endAt: input.endAt,
        status: "created",
        notes: input.notes
      }
    });

    return BookingSchema.parse({
      ...booking,
      startAt: booking.startAt.toISOString(),
      endAt: booking.endAt.toISOString()
    });
  }

  async listByBusiness(businessId: string): Promise<Booking[]> {
    const bookings = await this.prismaClient.booking.findMany({
      where: { businessId },
      orderBy: { startAt: "asc" }
    });

    return bookings.map((booking) =>
      BookingSchema.parse({
        ...booking,
        startAt: booking.startAt.toISOString(),
        endAt: booking.endAt.toISOString()
      })
    );
  }
}
