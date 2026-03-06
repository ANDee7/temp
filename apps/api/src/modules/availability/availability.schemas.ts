import { z } from "zod";

export const AvailabilityParamsSchema = z.object({
  slug: z.string().min(3)
});

export const AvailabilityQuerySchema = z.object({
  serviceId: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  staffId: z.string().uuid().optional(),
  stepMin: z.coerce.number().int().min(10).max(60).default(30)
});

export type AvailabilityParams = z.infer<typeof AvailabilityParamsSchema>;
export type AvailabilityQuery = z.infer<typeof AvailabilityQuerySchema>;
