import { SexCode } from "../../workforce/service/workforce.schema";
interface CensusApiParams {
    get: string;
    for: string;
    time: string;
    sex?: string;
}
interface CensusApiResult {
    employeeCount: number;
    state: string;
    quarter: string;
    sex: SexCode;
    failed?: boolean;
    error?: string;
}
declare const _default: {
    getCensusData: (params: CensusApiParams) => Promise<CensusApiResult>;
};
export default _default;
//# sourceMappingURL=client.d.ts.map