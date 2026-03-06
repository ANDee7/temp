import { DateTime } from "luxon";
import { beforeEach, describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import { mockBookings, mockClients } from "../src/db/in-memory-store.js";

const testEnv = {
  NODE_ENV: "test" as const,
  API_PORT: 4001,
  API_HOST: "127.0.0.1",
  JWT_SECRET: "test-secret-123",
  FRONTEND_URL: "http://localhost:3000",
  DATA_SOURCE: "in-memory" as const
};

describe("dikidi-clone-api", () => {
  beforeEach(() => {
    mockBookings.length = 0;
    mockClients.length = 0;
  });

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

  it("returns availability and excludes booked slots", async () => {
    const app = createApp(testEnv);
    const date = DateTime.now().setZone("Europe/Moscow").plus({ days: 1 }).toISODate();

    expect(date).toBeTruthy();

    const availabilityResponse = await app.inject({
      method: "GET",
      url: `/api/v1/availability/business/beauty-lab-moscow?serviceId=6c2435be-b9fd-40a6-a719-1734fbd8465c&staffId=0ad7f7ab-1f68-4d39-804f-84e6f7fcf2ea&date=${date}&stepMin=30`
    });

    expect(availabilityResponse.statusCode).toBe(200);
    const availabilityPayload = availabilityResponse.json();
    const firstSlot = availabilityPayload.availability[0]?.slots[0]?.startAt;
    expect(firstSlot).toBeTruthy();

    const createResponse = await app.inject({
      method: "POST",
      url: "/api/v1/bookings",
      payload: {
        businessId: "4f2afadb-d4a0-4ee7-8b65-0f0f1f21ab44",
        serviceId: "6c2435be-b9fd-40a6-a719-1734fbd8465c",
        staffId: "0ad7f7ab-1f68-4d39-804f-84e6f7fcf2ea",
        client: {
          fullName: "Петр Петров",
          phone: "+79997776655"
        },
        startAt: firstSlot
      }
    });

    expect(createResponse.statusCode).toBe(201);

    const secondAvailabilityResponse = await app.inject({
      method: "GET",
      url: `/api/v1/availability/business/beauty-lab-moscow?serviceId=6c2435be-b9fd-40a6-a719-1734fbd8465c&staffId=0ad7f7ab-1f68-4d39-804f-84e6f7fcf2ea&date=${date}&stepMin=30`
    });

    expect(secondAvailabilityResponse.statusCode).toBe(200);
    const secondPayload = secondAvailabilityResponse.json();
    const nextSlots = secondPayload.availability[0].slots.map((entry: { startAt: string }) => entry.startAt);
    expect(nextSlots).not.toContain(firstSlot);
  });
});
