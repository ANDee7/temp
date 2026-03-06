import { mockBusinesses, mockServices } from "../../db/in-memory-store.js";

export class CatalogService {
  getBusinessBySlug(slug: string) {
    return mockBusinesses.find((business) => business.slug === slug) ?? null;
  }

  listServices(businessId: string) {
    return mockServices.filter((service) => service.businessId === businessId && service.isActive);
  }
}
