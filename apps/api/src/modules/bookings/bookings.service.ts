import type { Booking, CreateBookingInput } from "@dikidi-clone/shared";
import type { BookingsRepository } from "../../db/repositories.js";
import { ClientsService } from "../clients/clients.service.js";

export class BookingsService {
  constructor(
    private readonly repository: BookingsRepository,
    private readonly clientsService: ClientsService
  ) {}

  async createBooking(input: CreateBookingInput): Promise<Booking> {
    const service = await this.repository.getServiceById(input.serviceId);
    if (!service) {
      throw new Error("Service not found");
    }

    const startAt = new Date(input.startAt);
    const endAt = new Date(startAt.getTime() + service.durationMin * 60000);

    const hasCollision = await this.repository.hasCollision({
      staffId: input.staffId,
      startAt,
      endAt
    });

    if (hasCollision) {
      throw new Error("Time slot is already booked for selected specialist");
    }

    const client = await this.clientsService.upsert(input.client);

    return this.repository.create({
      businessId: input.businessId,
      serviceId: input.serviceId,
      staffId: input.staffId,
      clientId: client.id,
      startAt,
      endAt,
      notes: input.notes
    });
  }

  async listByBusiness(businessId: string): Promise<Booking[]> {
    return this.repository.listByBusiness(businessId);
  }
}
