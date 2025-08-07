"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
const CENSUS_API_BASE = "https://api.census.gov/data/timeseries/qwi/sa";
const cenusClient = (0, utils_1.createHttpClient)({
    baseUrl: CENSUS_API_BASE,
    timeout: 15000,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});
const getCensusData = async (params) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
            searchParams.append(key, value);
        }
    });
    cenusClient.get("").then((res) => console.log(JSON.stringify(res, null, 2)));
    const endpoint = `?${searchParams.toString()}`;
    try {
        return await cenusClient.get(endpoint);
    }
    catch (error) {
        throw new Error(`Census API request failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
};
exports.default = {
    getCensusData,
};
//# sourceMappingURL=api.js.map