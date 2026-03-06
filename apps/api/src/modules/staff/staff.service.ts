import { mockStaff } from "../../db/in-memory-store.js";

export class StaffService {
  listByBusiness(businessId: string) {
    return mockStaff.filter((staff) => staff.businessId === businessId);
  }
}
