"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.workforceRouter = void 0;
const workforce_service_1 = __importDefault(require("../service/workforce.service"));
const workforce_controller_schema_1 = require("./workforce.controller.schema");
const plugin = (app, _opts, next) => {
    app.get("", {
        schema: {
            querystring: workforce_controller_schema_1.WorkforceQuerySchema,
            response: {
                200: workforce_controller_schema_1.WorkforceResponseSchema,
                400: workforce_controller_schema_1.WorkforceErrorSchema,
                500: workforce_controller_schema_1.WorkforceErrorSchema,
            },
        },
    }, async (request, reply) => {
        try {
            const { states, time, breakdownBySex } = request.query;
            const data = await workforce_service_1.default.getWorkforceData(states, time, breakdownBySex);
            return reply.send(data);
        }
        catch (error) {
            return reply.status(500).send({
                error: error instanceof Error ? error.message : "Internal server error",
            });
        }
    });
    next();
};
exports.workforceRouter = [
    plugin,
    { prefix: "v1/workforce" },
];
//# sourceMappingURL=workforce.controller.js.map