import { CreateBookingInputSchema } from "@dikidi-clone/shared";
import type { FastifyInstance } from "fastify";
import { ZodError, z } from "zod";
import { BookingsService } from "./bookings.service.js";

export function createBookingsRoutes(bookingsService: BookingsService) {
  return async function bookingsRoutes(app: FastifyInstance) {
    app.get("/bookings/business/:businessId", async (request) => {
      const params = z.object({ businessId: z.string().uuid() }).parse(request.params);
      return bookingsService.listByBusiness(params.businessId);
    });

    app.post("/bookings", async (request, reply) => {
      try {
        const payload = CreateBookingInputSchema.parse(request.body);
        const booking = await bookingsService.createBooking(payload);
        return reply.code(201).send(booking);
      } catch (error) {
        if (error instanceof ZodError) {
          return reply.code(400).send({ message: "Validation error", issues: error.issues });
        }
        if (error instanceof Error) {
          return reply.code(409).send({ message: error.message });
        }
        throw error;
      }
    });
  };
}
