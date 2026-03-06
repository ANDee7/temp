import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  API_PORT: z.coerce.number().int().positive().default(4000),
  API_HOST: z.string().default("0.0.0.0"),
  JWT_SECRET: z.string().min(8).default("dev-secret-change-me"),
  FRONTEND_URL: z.string().url().default("http://localhost:3000")
});

export type AppEnv = z.infer<typeof EnvSchema>;

export function getEnv(source: NodeJS.ProcessEnv = process.env): AppEnv {
  return EnvSchema.parse(source);
}
