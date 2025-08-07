interface CensusApiParams {
    get: string;
    for: string;
    time: string;
    sex?: string;
}
declare const _default: {
    getCensusData: (params: CensusApiParams) => Promise<string[][]>;
};
export default _default;
//# sourceMappingURL=api.d.ts.map