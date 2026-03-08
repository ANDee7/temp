import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import Fastify from "fastify";
import { getEnv, type AppEnv } from "./config/env.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import {
  InMemoryBookingsRepository,
  InMemoryCatalogRepository,
  InMemoryClientsRepository,
  InMemoryStaffRepository,
  PrismaBookingsRepository,
  PrismaCatalogRepository,
  PrismaClientsRepository,
  PrismaStaffRepository
} from "./db/repositories.js";
import { prisma } from "./db/prisma.js";
import { createAvailabilityRoutes } from "./modules/availability/availability.routes.js";
import { AvailabilityService } from "./modules/availability/availability.service.js";
import { createBookingsRoutes } from "./modules/bookings/bookings.routes.js";
import { BookingsService } from "./modules/bookings/bookings.service.js";
import { createCatalogRoutes } from "./modules/catalog/catalog.routes.js";
import { CatalogService } from "./modules/catalog/catalog.service.js";
import { createClientsRoutes } from "./modules/clients/clients.routes.js";
import { ClientsService } from "./modules/clients/clients.service.js";
import { healthRoutes } from "./modules/health/health.routes.js";
import { createStaffRoutes } from "./modules/staff/staff.routes.js";
import { StaffService } from "./modules/staff/staff.service.js";

export function createApp(providedEnv?: AppEnv) {
  const env = providedEnv ?? getEnv();
  const app = Fastify({ logger: env.NODE_ENV !== "test" });

  const usePrisma = env.DATA_SOURCE === "prisma";

  const catalogRepository = usePrisma
    ? new PrismaCatalogRepository(prisma)
    : new InMemoryCatalogRepository();
  const staffRepository = usePrisma
    ? new PrismaStaffRepository(prisma)
    : new InMemoryStaffRepository();
  const clientsRepository = usePrisma
    ? new PrismaClientsRepository(prisma)
    : new InMemoryClientsRepository();
  const bookingsRepository = usePrisma
    ? new PrismaBookingsRepository(prisma)
    : new InMemoryBookingsRepository();

  const catalogService = new CatalogService(catalogRepository);
  const staffService = new StaffService(staffRepository);
  const clientsService = new ClientsService(clientsRepository);
  const bookingsService = new BookingsService(bookingsRepository, clientsService);
  const availabilityService = new AvailabilityService(
    catalogService,
    staffService,
    bookingsRepository
  );

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
    v1.register(createCatalogRoutes(catalogService));
    v1.register(createStaffRoutes(catalogService, staffService));
    v1.register(createClientsRoutes(clientsService));
    v1.register(createBookingsRoutes(bookingsService));
    v1.register(createAvailabilityRoutes(availabilityService));
  }, { prefix: "/api/v1" });

  if (usePrisma) {
    app.addHook("onClose", async () => {
      await prisma.$disconnect();
    });
  }

  return app;
}
