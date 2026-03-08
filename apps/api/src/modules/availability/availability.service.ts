import type { BookingsRepository } from "../../db/repositories.js";
import { CatalogService } from "../catalog/catalog.service.js";
import { StaffService } from "../staff/staff.service.js";
import type { AvailabilityQuery } from "./availability.schemas.js";
import { DateTime } from "luxon";

type StaffAvailability = {
  staffId: string;
  staffName: string;
  slots: Array<{
    startAt: string;
    endAt: string;
    startAtLocal: string;
  }>;
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
      const schedule = await this.staffService.getScheduleForDate(
        member.id,
        input.query.date,
        dayStart.weekday
      );

      if (!schedule) {
        availability.push({
          staffId: member.id,
          staffName: member.fullName,
          slots: []
        });
        continue;
      }

      const windowStart = dayStart.plus({ minutes: schedule.startMinute });
      const windowEnd = dayStart.plus({ minutes: schedule.endMinute });

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
          const slotStartIso = slotStartUtc.toISO();
          const slotEndIso = slotEndUtc.toISO();
          if (!slotStartIso || !slotEndIso) {
            cursor = cursor.plus({ minutes: input.query.stepMin });
            continue;
          }

          slots.push({
            startAt: slotStartIso,
            endAt: slotEndIso,
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
