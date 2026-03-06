import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { CatalogService } from "../catalog/catalog.service.js";
import { StaffService } from "./staff.service.js";

const catalogService = new CatalogService();
const staffService = new StaffService();

export async function staffRoutes(app: FastifyInstance) {
  app.get("/staff/business/:slug", async (request, reply) => {
    const params = z.object({ slug: z.string().min(3) }).parse(request.params);
    const business = catalogService.getBusinessBySlug(params.slug);

    if (!business) {
      return reply.code(404).send({ message: "Business not found" });
    }

    return reply.send(staffService.listByBusiness(business.id));
  });
}
