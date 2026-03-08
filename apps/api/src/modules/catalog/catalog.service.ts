import type { CatalogRepository } from "../../db/repositories.js";

export class CatalogService {
  constructor(private readonly repository: CatalogRepository) {}

  async getBusinessBySlug(slug: string) {
    return this.repository.getBusinessBySlug(slug);
  }

  async listServices(businessId: string) {
    return this.repository.listServices(businessId);
  }
}
