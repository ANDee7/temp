import type { FastifyInstance } from "fastify";
import { ZodError } from "zod";
import { UpsertClientInputSchema } from "./clients.schemas.js";
import { ClientsService } from "./clients.service.js";

const clientsService = new ClientsService();

export async function clientsRoutes(app: FastifyInstance) {
  app.get("/clients", async () => clientsService.list());

  app.post("/clients", async (request, reply) => {
    try {
      const payload = UpsertClientInputSchema.parse(request.body);
      const client = clientsService.upsert(payload);
      return reply.code(201).send(client);
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.code(400).send({ message: "Validation error", issues: error.issues });
      }
      throw error;
    }
  });
}
