import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { CatalogService } from "./catalog.service.js";

export function createCatalogRoutes(catalogService: CatalogService) {
  return async function catalogRoutes(app: FastifyInstance) {
    app.get("/catalog/business/:slug", async (request, reply) => {
      const params = z.object({ slug: z.string().min(3) }).parse(request.params);
      const business = await catalogService.getBusinessBySlug(params.slug);

      if (!business) {
        return reply.code(404).send({ message: "Business not found" });
      }

      return reply.send(business);
    });

    app.get("/catalog/business/:slug/services", async (request, reply) => {
      const params = z.object({ slug: z.string().min(3) }).parse(request.params);
      const business = await catalogService.getBusinessBySlug(params.slug);

      if (!business) {
        return reply.code(404).send({ message: "Business not found" });
      }

      const services = await catalogService.listServices(business.id);
      return reply.send(services);
    });
  };
}
