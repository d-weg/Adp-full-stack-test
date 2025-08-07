import { Static } from '@sinclair/typebox';
export declare const WorkforceQuerySchema: import("@sinclair/typebox").TObject<{
    states: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"ALL">, import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>]>;
    time: import("@sinclair/typebox").TString;
    breakdownBySex: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
}>;
export declare const WorkforceResponseSchema: import("@sinclair/typebox").TObject<{
    data: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
        employeeCount: import("@sinclair/typebox").TNumber;
        state: import("@sinclair/typebox").TString;
        quarter: import("@sinclair/typebox").TString;
        sex: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"0">, import("@sinclair/typebox").TLiteral<"1">, import("@sinclair/typebox").TLiteral<"2">]>;
        maleEmployment: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        femaleEmployment: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        failed: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        error: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    }>>;
    failures: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
        state: import("@sinclair/typebox").TString;
        error: import("@sinclair/typebox").TString;
    }>>;
    totalStates: import("@sinclair/typebox").TNumber;
    successfulStates: import("@sinclair/typebox").TNumber;
}>;
export declare const WorkforceErrorSchema: import("@sinclair/typebox").TObject<{
    error: import("@sinclair/typebox").TString;
}>;
export type WorkforceQueryType = Static<typeof WorkforceQuerySchema>;
export type WorkforceResponseType = Static<typeof WorkforceResponseSchema>;
export type WorkforceErrorType = Static<typeof WorkforceErrorSchema>;
//# sourceMappingURL=workforce.controller.schema.d.ts.map