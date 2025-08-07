"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const workforce_schema_1 = require("./workforce.schema");
const services_1 = require("../../services");
const states_json_1 = __importDefault(require("../../utils/constants/states.json"));
const getData = async (states, time, breakdownBySex) => {
    const stateArray = states === "ALL" ? states_json_1.default.states.map((state) => state.code) : states;
    const parsedData = [];
    const failures = [];
    for (const state of stateArray) {
        if (breakdownBySex) {
            const [maleResponse, femaleResponse] = await Promise.all([
                services_1.CensusApi.getCensusData({
                    get: "Emp",
                    for: `state:${state}`,
                    time,
                    sex: workforce_schema_1.SEX_CODES.MALE,
                }),
                services_1.CensusApi.getCensusData({
                    get: "Emp",
                    for: `state:${state}`,
                    time,
                    sex: workforce_schema_1.SEX_CODES.FEMALE,
                }),
            ]);
            if (maleResponse.failed || femaleResponse.failed) {
                const error = maleResponse.error || femaleResponse.error;
                failures.push({ state: maleResponse.state, error });
                parsedData.push({
                    employeeCount: 0,
                    state: maleResponse.state,
                    quarter: maleResponse.quarter,
                    sex: workforce_schema_1.SEX_CODES.ALL,
                    maleEmployment: undefined,
                    femaleEmployment: undefined,
                    failed: true,
                    error,
                });
                continue;
            }
            parsedData.push({
                employeeCount: maleResponse.employeeCount + femaleResponse.employeeCount,
                state: maleResponse.state,
                quarter: maleResponse.quarter,
                sex: workforce_schema_1.SEX_CODES.ALL,
                maleEmployment: maleResponse.employeeCount,
                femaleEmployment: femaleResponse.employeeCount,
            });
            continue;
        }
        const response = await services_1.CensusApi.getCensusData({
            get: "Emp",
            for: `state:${state}`,
            time,
            sex: workforce_schema_1.SEX_CODES.ALL,
        });
        if (response.failed) {
            failures.push({ state: response.state, error: response.error });
        }
        parsedData.push(response);
    }
    return { parsedData, failures };
};
const getWorkforceData = async (states, time, breakdownBySex = false) => {
    const stateCount = states === "ALL" ? states_json_1.default.states.length : states.length;
    const { parsedData, failures } = await getData(states, time, breakdownBySex);
    return {
        data: parsedData,
        failures,
        totalStates: stateCount,
        successfulStates: stateCount - failures.length,
    };
};
exports.default = {
    getWorkforceData,
};
//# sourceMappingURL=workforce.service.js.map