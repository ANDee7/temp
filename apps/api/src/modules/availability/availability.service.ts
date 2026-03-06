import type { BookingsRepository } from "../../db/repositories.js";
import { CatalogService } from "../catalog/catalog.service.js";
import { StaffService } from "../staff/staff.service.js";
import type { AvailabilityQuery } from "./availability.schemas.js";
import { DateTime } from "luxon";

type DayWorkingHours = {
  startHour: number;
  endHour: number;
};

type StaffAvailability = {
  staffId: string;
  staffName: string;
  slots: Array<{
    startAt: string;
    endAt: string;
    startAtLocal: string;
  }>;
};

const DEFAULT_WORKING_HOURS: Record<number, DayWorkingHours> = {
  1: { startHour: 10, endHour: 20 },
  2: { startHour: 10, endHour: 20 },
  3: { startHour: 10, endHour: 20 },
  4: { startHour: 10, endHour: 20 },
  5: { startHour: 10, endHour: 20 },
  6: { startHour: 10, endHour: 20 },
  7: { startHour: 10, endHour: 18 }
};

export class AvailabilityNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AvailabilityNotFoundError";
  }
}

export class AvailabilityValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AvailabilityValidationError";
  }
}

export class AvailabilityService {
  constructor(
    private readonly catalogService: CatalogService,
    private readonly staffService: StaffService,
    private readonly bookingsRepository: BookingsRepository
  ) {}

  async getAvailabilityBySlug(input: { slug: string; query: AvailabilityQuery }) {
    const business = await this.catalogService.getBusinessBySlug(input.slug);
    if (!business) {
      throw new AvailabilityNotFoundError("Business not found");
    }

    const services = await this.catalogService.listServices(business.id);
    const service = services.find((entry) => entry.id === input.query.serviceId);
    if (!service) {
      throw new AvailabilityNotFoundError("Service not found");
    }

    const dayStart = DateTime.fromISO(`${input.query.date}T00:00:00`, {
      zone: business.timezone
    }).startOf("day");

    if (!dayStart.isValid) {
      throw new AvailabilityValidationError("Invalid date or timezone");
    }

    const dayWorkingHours = DEFAULT_WORKING_HOURS[dayStart.weekday];
    const dayEnd = dayStart.plus({ days: 1 });
    const allStaff = await this.staffService.listByBusiness(business.id);

    let availableStaff = allStaff.filter((member) => member.serviceIds.includes(service.id));
    if (input.query.staffId) {
      availableStaff = availableStaff.filter((member) => member.id === input.query.staffId);
      if (availableStaff.length === 0) {
        throw new AvailabilityNotFoundError("Staff not found for selected service");
      }
    }

    const nowUtc = DateTime.utc();
    const availability: StaffAvailability[] = [];

    for (const member of availableStaff) {
      const windowStart = dayStart.set({
        hour: dayWorkingHours.startHour,
        minute: 0,
        second: 0,
        millisecond: 0
      });
      const windowEnd = dayStart.set({
        hour: dayWorkingHours.endHour,
        minute: 0,
        second: 0,
        millisecond: 0
      });

      const bookings = await this.bookingsRepository.listByStaffInRange({
        staffId: member.id,
        startAt: windowStart.toUTC().toJSDate(),
        endAt: dayEnd.toUTC().toJSDate()
      });

      const slots: StaffAvailability["slots"] = [];
      let cursor = windowStart;

      while (cursor.plus({ minutes: service.durationMin }) <= windowEnd) {
        const slotStartUtc = cursor.toUTC();
        const slotEndUtc = cursor.plus({ minutes: service.durationMin }).toUTC();
        const isPast = slotStartUtc <= nowUtc;

        const hasCollision = bookings.some((booking) => {
          if (booking.status === "cancelled") {
            return false;
          }
          const bookingStartUtc = DateTime.fromISO(booking.startAt, { zone: "utc" });
          const bookingEndUtc = DateTime.fromISO(booking.endAt, { zone: "utc" });
          return slotStartUtc < bookingEndUtc && bookingStartUtc < slotEndUtc;
        });

        if (!isPast && !hasCollision) {
          slots.push({
            startAt: slotStartUtc.toISO(),
            endAt: slotEndUtc.toISO(),
            startAtLocal: cursor.toFormat("HH:mm")
          });
        }

        cursor = cursor.plus({ minutes: input.query.stepMin });
      }

      availability.push({
        staffId: member.id,
        staffName: member.fullName,
        slots
      });
    }

    return {
      businessId: business.id,
      businessSlug: business.slug,
      timezone: business.timezone,
      date: input.query.date,
      serviceId: service.id,
      serviceDurationMin: service.durationMin,
      stepMin: input.query.stepMin,
      availability
    };
  }
}
