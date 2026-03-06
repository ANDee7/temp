import type { Booking, CreateBookingInput } from "@dikidi-clone/shared";
import { BookingSchema } from "@dikidi-clone/shared";
import { v4 as uuidv4 } from "uuid";
import { mockBookings, mockServices } from "../../db/in-memory-store.js";
import { ClientsService } from "../clients/clients.service.js";

const clientsService = new ClientsService();

function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
  return aStart < bEnd && bStart < aEnd;
}

export class BookingsService {
  createBooking(input: CreateBookingInput): Booking {
    const service = mockServices.find((entry) => entry.id === input.serviceId);
    if (!service) {
      throw new Error("Service not found");
    }

    const startAt = new Date(input.startAt);
    const endAt = new Date(startAt.getTime() + service.durationMin * 60000);

    const hasCollision = mockBookings.some((booking) => {
      if (booking.staffId !== input.staffId) {
        return false;
      }
      if (booking.status === "cancelled") {
        return false;
      }
      return overlaps(startAt, endAt, new Date(booking.startAt), new Date(booking.endAt));
    });

    if (hasCollision) {
      throw new Error("Time slot is already booked for selected specialist");
    }

    const client = clientsService.upsert(input.client);

    const created: Booking = BookingSchema.parse({
      id: uuidv4(),
      businessId: input.businessId,
      serviceId: input.serviceId,
      staffId: input.staffId,
      clientId: client.id,
      startAt: startAt.toISOString(),
      endAt: endAt.toISOString(),
      status: "created",
      notes: input.notes
    });

    mockBookings.push(created);
    return created;
  }

  listByBusiness(businessId: string): Booking[] {
    return mockBookings.filter((booking) => booking.businessId === businessId);
  }
}
