import { createApp } from "./app.js";
import { getEnv } from "./config/env.js";

async function bootstrap() {
  const env = getEnv();
  const app = createApp(env);
  await app.listen({ host: env.API_HOST, port: env.API_PORT });
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
