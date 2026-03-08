import type { Booking, Business, Service, Staff } from "@dikidi-clone/shared";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export async function getBusiness(slug: string): Promise<Business | null> {
  const response = await fetch(`${API_URL}/api/v1/catalog/business/${slug}`, {
    next: { revalidate: 30 }
  });
  if (!response.ok) {
    return null;
  }
  return response.json() as Promise<Business>;
}

export async function getServices(slug: string): Promise<Service[]> {
  const response = await fetch(`${API_URL}/api/v1/catalog/business/${slug}/services`, {
    next: { revalidate: 30 }
  });
  if (!response.ok) {
    return [];
  }
  return response.json() as Promise<Service[]>;
}

export async function getStaff(slug: string): Promise<Staff[]> {
  const response = await fetch(`${API_URL}/api/v1/staff/business/${slug}`, {
    next: { revalidate: 30 }
  });
  if (!response.ok) {
    return [];
  }
  return response.json() as Promise<Staff[]>;
}

export type CreateBookingPayload = {
  businessId: string;
  serviceId: string;
  staffId: string;
  client: { fullName: string; phone: string; email?: string };
  startAt: string;
  notes?: string;
};

export async function createBooking(payload: CreateBookingPayload): Promise<Booking> {
  const response = await fetch(`${API_URL}/api/v1/bookings`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => ({}));
    const errorMessage = errorPayload.message ?? "Failed to create booking";
    throw new Error(errorMessage);
  }

  return response.json() as Promise<Booking>;
}
