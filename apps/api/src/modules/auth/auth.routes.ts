import type { FastifyInstance } from "fastify";
import { ZodError } from "zod";
import { LoginInputSchema } from "./auth.schemas.js";
import { AuthService } from "./auth.service.js";

const authService = new AuthService();

export async function authRoutes(app: FastifyInstance) {
  app.post("/auth/login", async (request, reply) => {
    try {
      const payload = LoginInputSchema.parse(request.body);
      const authResult = authService.login(payload);

      if (!authResult) {
        return reply.code(401).send({ message: "Неверный номер телефона или пароль" });
      }

      const token = await reply.jwtSign({ sub: authResult.userId, role: authResult.role });

      return reply.send({
        accessToken: token,
        user: {
          id: authResult.userId,
          role: authResult.role
        }
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.code(400).send({ message: "Validation error", issues: error.issues });
      }
      throw error;
    }
  });
}
