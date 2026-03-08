import { z } from "zod";

export const ServiceCategorySchema = z.enum([
  "hair",
  "nails",
  "brows",
  "massage",
  "spa",
  "other"
]);

export const ServiceSchema = z.object({
  id: z.string().uuid(),
  businessId: z.string().uuid(),
  name: z.string().min(2),
  category: ServiceCategorySchema,
  durationMin: z.number().int().positive(),
  price: z.number().nonnegative(),
  currency: z.string().length(3).default("RUB"),
  isActive: z.boolean().default(true)
});

export const StaffSchema = z.object({
  id: z.string().uuid(),
  businessId: z.string().uuid(),
  fullName: z.string().min(2),
  role: z.string().min(2),
  serviceIds: z.array(z.string().uuid())
});

export const BusinessSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().min(3),
  name: z.string().min(2),
  city: z.string().min(2),
  timezone: z.string().min(2),
  phone: z.string().min(6),
  description: z.string().optional()
});

export const ClientSchema = z.object({
  id: z.string().uuid(),
  fullName: z.string().min(2),
  phone: z.string().min(6),
  email: z.string().email().optional()
});

export const BookingStatusSchema = z.enum([
  "created",
  "confirmed",
  "cancelled",
  "completed",
  "no_show"
]);

export const BookingSchema = z.object({
  id: z.string().uuid(),
  businessId: z.string().uuid(),
  serviceId: z.string().uuid(),
  staffId: z.string().uuid(),
  clientId: z.string().uuid(),
  startAt: z.string().datetime(),
  endAt: z.string().datetime(),
  status: BookingStatusSchema,
  notes: z.string().max(500).optional()
});

export const CreateBookingInputSchema = z.object({
  businessId: z.string().uuid(),
  serviceId: z.string().uuid(),
  staffId: z.string().uuid(),
  client: z.object({
    fullName: z.string().min(2),
    phone: z.string().min(6),
    email: z.string().email().optional()
  }),
  startAt: z.string().datetime(),
  notes: z.string().max(500).optional()
});

export type ServiceCategory = z.infer<typeof ServiceCategorySchema>;
export type Service = z.infer<typeof ServiceSchema>;
export type Staff = z.infer<typeof StaffSchema>;
export type Business = z.infer<typeof BusinessSchema>;
export type Client = z.infer<typeof ClientSchema>;
export type BookingStatus = z.infer<typeof BookingStatusSchema>;
export type Booking = z.infer<typeof BookingSchema>;
export type CreateBookingInput = z.infer<typeof CreateBookingInputSchema>;
