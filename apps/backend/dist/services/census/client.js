"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
const states_json_1 = __importDefault(require("../../utils/constants/states.json"));
const CENSUS_API_BASE = "https://api.census.gov/data/timeseries/qwi/sa";
const cenusClient = (0, utils_1.createHttpClient)({
    baseUrl: CENSUS_API_BASE,
    timeout: 15000,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});
const getStateName = (stateCode) => {
    const state = states_json_1.default.states.find((s) => s.code === stateCode);
    return state ? state.name : stateCode;
};
const getCensusData = async (params) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
            searchParams.append(key, value);
        }
    });
    const queryString = decodeURIComponent(searchParams.toString());
    const stateCode = params.for.replace("state:", "");
    const stateName = getStateName(stateCode);
    try {
        const rawData = await cenusClient.get(`?${queryString}`);
        const data = rawData.length > 1 ? rawData.slice(1) : rawData;
        if (!data || data.length < 1) {
            const errorMessage = "No data available for this state";
            return {
                employeeCount: 0,
                state: stateName,
                quarter: params.time,
                sex: params.sex,
                failed: true,
                error: errorMessage,
            };
        }
        return {
            employeeCount: parseInt(data[0][0], 10),
            state: stateName,
            quarter: data[0][1],
            sex: params.sex,
        };
    }
    catch (error) {
        const errorMessage = `Census API request failed: ${error instanceof Error ? error.message : "Unknown error"}`;
        console.error("Census API request failed:", queryString);
        return {
            employeeCount: 0,
            state: stateName,
            quarter: params.time,
            sex: params.sex,
            failed: true,
            error: errorMessage,
        };
    }
};
exports.default = {
    getCensusData,
};
//# sourceMappingURL=client.js.map