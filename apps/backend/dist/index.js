"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const helmet_1 = __importDefault(require("@fastify/helmet"));
const swagger_1 = __importDefault(require("@fastify/swagger"));
const swagger_ui_1 = __importDefault(require("@fastify/swagger-ui"));
const workforce_1 = require("./workforce");
const PORT = Number(process.env.PORT) || 3001;
const HOST = process.env.HOST || "0.0.0.0";
const start = async () => {
    const app = (0, fastify_1.default)({
        requestTimeout: 30000,
        logger: true,
    });
    try {
        app.register(cors_1.default, {
            origin: true,
        });
        app.register(helmet_1.default);
        await app.register(swagger_1.default, {
            openapi: {
                openapi: "3.0.0",
                info: {
                    title: "ADP Backend API",
                    description: "API documentation for ADP Backend",
                    version: "0.1.0",
                },
            },
        });
        await app.register(swagger_ui_1.default, {
            routePrefix: "/docs",
            uiConfig: {
                docExpansion: "full",
                deepLinking: false,
            },
            staticCSP: true,
        });
        app.listen({ port: PORT, host: HOST });
        await app.register(...workforce_1.workforceRouter);
        await app.ready();
        app.log.info(`Server running on port ${PORT}`);
    }
    catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};
start();
//# sourceMappingURL=index.js.map