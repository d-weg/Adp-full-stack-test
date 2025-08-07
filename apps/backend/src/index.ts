import fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { workforceRouter } from "./workforce";

const PORT = Number(process.env.PORT) || 8000;
const HOST = process.env.HOST || "0.0.0.0";

const start = async () => {
  const app = fastify({
    requestTimeout: 30000,
    logger: true,
  });
  try {
    app.register(cors, {
      origin: true,
    });

    app.register(helmet);

    await app.register(swagger, {
      openapi: {
        openapi: "3.0.0",
        info: {
          title: "ADP Backend API",
          description: "API documentation for ADP Backend",
          version: "0.1.0",
        },
      },
    });

    await app.register(swaggerUi, {
      routePrefix: "/docs",
      uiConfig: {
        docExpansion: "full",
        deepLinking: false,
      },
      staticCSP: true,
    });

    app.listen({ port: PORT, host: HOST });

    await app.register(...workforceRouter);

    await app.ready();

    app.log.info(`Server running on port ${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
