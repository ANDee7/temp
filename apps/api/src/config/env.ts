import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  API_PORT: z.coerce.number().int().positive().default(4000),
  API_HOST: z.string().default("0.0.0.0"),
  JWT_SECRET: z.string().min(8).default("dev-secret-change-me"),
  FRONTEND_URL: z.string().url().default("http://localhost:3000"),
  DATA_SOURCE: z.enum(["in-memory", "prisma"]).default("in-memory"),
  DATABASE_URL: z.string().optional()
}).superRefine((env, ctx) => {
  if (env.DATA_SOURCE === "prisma" && !env.DATABASE_URL) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "DATABASE_URL is required when DATA_SOURCE=prisma",
      path: ["DATABASE_URL"]
    });
  }
});

export type AppEnv = z.infer<typeof EnvSchema>;

export function getEnv(source: NodeJS.ProcessEnv = process.env): AppEnv {
  return EnvSchema.parse(source);
}
