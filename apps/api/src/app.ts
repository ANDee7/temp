import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import Fastify from "fastify";
import { getEnv, type AppEnv } from "./config/env.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { bookingsRoutes } from "./modules/bookings/bookings.routes.js";
import { catalogRoutes } from "./modules/catalog/catalog.routes.js";
import { clientsRoutes } from "./modules/clients/clients.routes.js";
import { healthRoutes } from "./modules/health/health.routes.js";
import { staffRoutes } from "./modules/staff/staff.routes.js";

export function createApp(providedEnv?: AppEnv) {
  const env = providedEnv ?? getEnv();
  const app = Fastify({ logger: env.NODE_ENV !== "test" });

  app.register(cors, {
    origin: env.FRONTEND_URL
  });
  app.register(jwt, { secret: env.JWT_SECRET });

  app.get("/", async () => ({
    name: "dikidi-clone-api",
    version: "0.1.0",
    docs: "/api/v1/health"
  }));

  app.register(async (v1) => {
    v1.register(healthRoutes);
    v1.register(authRoutes);
    v1.register(catalogRoutes);
    v1.register(staffRoutes);
    v1.register(clientsRoutes);
    v1.register(bookingsRoutes);
  }, { prefix: "/api/v1" });

  return app;
}
