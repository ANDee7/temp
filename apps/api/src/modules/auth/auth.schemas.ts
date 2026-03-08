import { z } from "zod";

export const LoginInputSchema = z.object({
  phone: z.string().min(6),
  password: z.string().min(6)
});

export type LoginInput = z.infer<typeof LoginInputSchema>;
