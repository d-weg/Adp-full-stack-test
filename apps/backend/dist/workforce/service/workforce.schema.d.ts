export declare const SEX_CODES: {
    readonly ALL: "0";
    readonly MALE: "1";
    readonly FEMALE: "2";
};
export type SexCode = typeof SEX_CODES[keyof typeof SEX_CODES];
export interface WorkforceQueryParams {
    state: string;
    time: string;
    sex?: SexCode;
}
export interface QWIResponse {
    Emp: string;
    state: string;
    time: string;
    sex: string;
}
export interface WorkforceData {
    employeeCount: number;
    state: string;
    quarter: string;
    sex: SexCode;
    maleEmployment?: number;
    femaleEmployment?: number;
    failed?: boolean;
    error?: string;
}
export interface StateFailure {
    state: string;
    error: string;
}
export interface WorkforceResponse {
    data: WorkforceData[];
    failures: StateFailure[];
    totalStates: number;
    successfulStates: number;
}
//# sourceMappingURL=workforce.schema.d.ts.map