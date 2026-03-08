import type { FastifyInstance } from "fastify";

export async function healthRoutes(app: FastifyInstance) {
  app.get("/health", async () => ({
    ok: true,
    service: "dikidi-clone-api",
    timestamp: new Date().toISOString()
  }));
}
