import { describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";

const testEnv = {
  NODE_ENV: "test" as const,
  API_PORT: 4001,
  API_HOST: "127.0.0.1",
  JWT_SECRET: "test-secret-123",
  FRONTEND_URL: "http://localhost:3000",
  DATA_SOURCE: "in-memory" as const
};

describe("dikidi-clone-api", () => {
  it("returns health endpoint payload", async () => {
    const app = createApp(testEnv);

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/health"
    });

    expect(response.statusCode).toBe(200);
    expect(response.json().ok).toBe(true);
  });

  it("creates a booking", async () => {
    const app = createApp(testEnv);

    const payload = {
      businessId: "4f2afadb-d4a0-4ee7-8b65-0f0f1f21ab44",
      serviceId: "6c2435be-b9fd-40a6-a719-1734fbd8465c",
      staffId: "0ad7f7ab-1f68-4d39-804f-84e6f7fcf2ea",
      client: {
        fullName: "Иван Иванов",
        phone: "+79998887766"
      },
      startAt: new Date(Date.now() + 3600_000).toISOString()
    };

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/bookings",
      payload
    });

    expect(response.statusCode).toBe(201);
    expect(response.json().status).toBe("created");
  });
});
