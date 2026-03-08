import type { StaffRepository } from "../../db/repositories.js";

export class StaffService {
  constructor(private readonly repository: StaffRepository) {}

  async listByBusiness(businessId: string) {
    return this.repository.listByBusiness(businessId);
  }

  async getScheduleForDate(staffId: string, date: string, weekday: number) {
    const override = await this.repository.getDateOverride(staffId, date);
    if (override) {
      if (override.isDayOff) {
        return null;
      }

      if (typeof override.startMinute === "number" && typeof override.endMinute === "number") {
        return {
          startMinute: override.startMinute,
          endMinute: override.endMinute
        };
      }
    }

    return this.repository.getWorkingHours(staffId, weekday);
  }
}
