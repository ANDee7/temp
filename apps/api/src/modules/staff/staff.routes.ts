import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { CatalogService } from "../catalog/catalog.service.js";
import { StaffService } from "./staff.service.js";

export function createStaffRoutes(catalogService: CatalogService, staffService: StaffService) {
  return async function staffRoutes(app: FastifyInstance) {
    app.get("/staff/business/:slug", async (request, reply) => {
      const params = z.object({ slug: z.string().min(3) }).parse(request.params);
      const business = await catalogService.getBusinessBySlug(params.slug);

      if (!business) {
        return reply.code(404).send({ message: "Business not found" });
      }

      return reply.send(await staffService.listByBusiness(business.id));
    });
  };
}
