import type { Client } from "@dikidi-clone/shared";
import type { ClientsRepository } from "../../db/repositories.js";
import type { UpsertClientInput } from "./clients.schemas.js";

export class ClientsService {
  constructor(private readonly repository: ClientsRepository) {}

  async upsert(input: UpsertClientInput): Promise<Client> {
    return this.repository.upsert(input);
  }

  async list() {
    return this.repository.list();
  }
}
