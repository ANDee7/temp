import { z } from "zod";

export const UpsertClientInputSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(6),
  email: z.string().email().optional()
});

export type UpsertClientInput = z.infer<typeof UpsertClientInputSchema>;
