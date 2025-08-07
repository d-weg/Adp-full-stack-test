import { FastifyRequest, FastifyReply, FastifyPluginCallback } from "fastify";
import { RouterConfig } from "../../utils";
import WorkforceService from "../service/workforce.service";
import {
  WorkforceQuerySchema,
  WorkforceResponseSchema,
  WorkforceErrorSchema,
  WorkforceQueryType,
} from "./workforce.controller.schema";

const plugin: FastifyPluginCallback = (app, _opts, next) => {
  app.get(
    "",
    {
      schema: {
        querystring: WorkforceQuerySchema,
        response: {
          200: WorkforceResponseSchema,
          400: WorkforceErrorSchema,
          500: WorkforceErrorSchema,
        },
      },
    },
    async (
      request: FastifyRequest<{ Querystring: WorkforceQueryType }>,
      reply: FastifyReply
    ) => {
      try {
        const { states, time, breakdownBySex } = request.query;

        const data = await WorkforceService.getWorkforceData(
          states,
          time,
          breakdownBySex
        );

        return reply.send(data);
      } catch (error) {
        return reply.status(500).send({
          error:
            error instanceof Error ? error.message : "Internal server error",
        });
      }
    }
  );

  next();
};

export const workforceRouter: RouterConfig = [
  plugin,
  { prefix: "v1/workforce" },
];
