import { createHttpClient } from "../../utils";
import { SexCode } from "../../workforce/service/workforce.schema";
import statesData from "../../utils/constants/states.json";

const CENSUS_API_BASE = process.env.CENSUS_API_BASE || "https://api.census.gov/data/timeseries/qwi/sa";

const cenusClient = createHttpClient({
  baseUrl: CENSUS_API_BASE,
  timeout: 15000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

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

const getStateName = (stateCode: string): string => {
  const state = statesData.states.find((s) => s.code === stateCode);
  return state ? state.name : stateCode;
};

const getCensusData = async (
  params: CensusApiParams
): Promise<CensusApiResult> => {
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
        sex: params.sex as SexCode,
        failed: true,
        error: errorMessage,
      };
    }

    return {
      employeeCount: parseInt(data[0][0], 10),
      state: stateName,
      quarter: data[0][1],
      sex: params.sex as SexCode,
    };
  } catch (error) {
    console.log("error", error);
    const errorMessage = `Census API request failed: ${
      error instanceof Error ? error.message : "Unknown error"
    }`;
    console.error("Census API request failed:", queryString);

    return {
      employeeCount: 0,
      state: stateName,
      quarter: params.time,
      sex: params.sex as SexCode,
      failed: true,
      error: errorMessage,
    };
  }
};

export default {
  getCensusData,
};
