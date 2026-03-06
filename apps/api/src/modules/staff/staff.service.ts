import type { StaffRepository } from "../../db/repositories.js";

export class StaffService {
  constructor(private readonly repository: StaffRepository) {}

  async listByBusiness(businessId: string) {
    return this.repository.listByBusiness(businessId);
  }
}
