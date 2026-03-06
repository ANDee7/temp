import type { FastifyInstance } from "fastify";
import { ZodError } from "zod";
import {
  AvailabilityParamsSchema,
  AvailabilityQuerySchema
} from "./availability.schemas.js";
import {
  AvailabilityNotFoundError,
  AvailabilityService,
  AvailabilityValidationError
} from "./availability.service.js";

export function createAvailabilityRoutes(availabilityService: AvailabilityService) {
  return async function availabilityRoutes(app: FastifyInstance) {
    app.get("/availability/business/:slug", async (request, reply) => {
      try {
        const params = AvailabilityParamsSchema.parse(request.params);
        const query = AvailabilityQuerySchema.parse(request.query);

        const payload = await availabilityService.getAvailabilityBySlug({
          slug: params.slug,
          query
        });

        return reply.send(payload);
      } catch (error) {
        if (error instanceof ZodError) {
          return reply.code(400).send({ message: "Validation error", issues: error.issues });
        }
        if (error instanceof AvailabilityValidationError) {
          return reply.code(400).send({ message: error.message });
        }
        if (error instanceof AvailabilityNotFoundError) {
          return reply.code(404).send({ message: error.message });
        }
        throw error;
      }
    });
  };
}
