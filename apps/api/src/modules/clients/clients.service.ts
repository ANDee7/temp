import type { Client } from "@dikidi-clone/shared";
import { v4 as uuidv4 } from "uuid";
import { mockClients } from "../../db/in-memory-store.js";
import type { UpsertClientInput } from "./clients.schemas.js";

export class ClientsService {
  upsert(input: UpsertClientInput): Client {
    const existing = mockClients.find((client) => client.phone === input.phone);

    if (existing) {
      existing.fullName = input.fullName;
      existing.email = input.email;
      return existing;
    }

    const created: Client = {
      id: uuidv4(),
      fullName: input.fullName,
      phone: input.phone,
      email: input.email
    };
    mockClients.push(created);
    return created;
  }

  list() {
    return [...mockClients];
  }
}
