import type { FastifyJWT } from "@fastify/jwt";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { sub: string; role: "owner" | "admin" | "staff" };
    user: { sub: string; role: "owner" | "admin" | "staff" };
  }
}
