"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkforceErrorSchema = exports.WorkforceResponseSchema = exports.WorkforceQuerySchema = void 0;
const typebox_1 = require("@sinclair/typebox");
exports.WorkforceQuerySchema = typebox_1.Type.Object({
    states: typebox_1.Type.Union([
        typebox_1.Type.Literal('ALL'),
        typebox_1.Type.Array(typebox_1.Type.String({ minLength: 2, maxLength: 3 }))
    ]),
    time: typebox_1.Type.String({ pattern: '^[0-9]{4}-Q[1-4]$' }),
    breakdownBySex: typebox_1.Type.Optional(typebox_1.Type.Boolean())
});
exports.WorkforceResponseSchema = typebox_1.Type.Object({
    data: typebox_1.Type.Array(typebox_1.Type.Object({
        employeeCount: typebox_1.Type.Number(),
        state: typebox_1.Type.String(),
        quarter: typebox_1.Type.String(),
        sex: typebox_1.Type.Union([
            typebox_1.Type.Literal('0'),
            typebox_1.Type.Literal('1'),
            typebox_1.Type.Literal('2')
        ]),
        maleEmployment: typebox_1.Type.Optional(typebox_1.Type.Number()),
        femaleEmployment: typebox_1.Type.Optional(typebox_1.Type.Number()),
        failed: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
        error: typebox_1.Type.Optional(typebox_1.Type.String())
    })),
    failures: typebox_1.Type.Array(typebox_1.Type.Object({
        state: typebox_1.Type.String(),
        error: typebox_1.Type.String()
    })),
    totalStates: typebox_1.Type.Number(),
    successfulStates: typebox_1.Type.Number()
});
exports.WorkforceErrorSchema = typebox_1.Type.Object({
    error: typebox_1.Type.String()
});
//# sourceMappingURL=workforce.controller.schema.js.map