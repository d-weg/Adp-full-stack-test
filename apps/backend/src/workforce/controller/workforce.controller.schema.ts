import { Type, Static } from '@sinclair/typebox';

export const WorkforceQuerySchema = Type.Object({
  states: Type.Union([
    Type.Literal('ALL'),
    Type.Array(Type.String({ minLength: 2, maxLength: 3 }))
  ]),
  time: Type.String({ pattern: '^[0-9]{4}-Q[1-4]$' }),
  breakdownBySex: Type.Optional(Type.Boolean())
});

export const WorkforceResponseSchema = Type.Object({
  data: Type.Array(
    Type.Object({
      employeeCount: Type.Number(),
      state: Type.String(),
      quarter: Type.String(),
      sex: Type.Union([
        Type.Literal('0'),
        Type.Literal('1'),
        Type.Literal('2')
      ]),
      maleEmployment: Type.Optional(Type.Number()),
      femaleEmployment: Type.Optional(Type.Number()),
      failed: Type.Optional(Type.Boolean()),
      error: Type.Optional(Type.String())
    })
  ),
  failures: Type.Array(
    Type.Object({
      state: Type.String(),
      error: Type.String()
    })
  ),
  totalStates: Type.Number(),
  successfulStates: Type.Number()
});

export const WorkforceErrorSchema = Type.Object({
  error: Type.String()
});

export type WorkforceQueryType = Static<typeof WorkforceQuerySchema>;
export type WorkforceResponseType = Static<typeof WorkforceResponseSchema>;
export type WorkforceErrorType = Static<typeof WorkforceErrorSchema>;