import {
  WorkforceData,
  WorkforceResponse,
  StateFailure,
  SEX_CODES,
} from "./workforce.schema";
import { CensusApi } from "../../services";
import statesData from "../../utils/constants/states.json";

const getData = async (
  states: string | string[],
  time: string,
  breakdownBySex: boolean
): Promise<{ parsedData: WorkforceData[]; failures: StateFailure[] }> => {
  const stateArray =
    states === "ALL" ? statesData.states.map((state) => state.code) : states;

  const failures: StateFailure[] = [];

  const statePromises = (Array.isArray(stateArray) ? stateArray : [stateArray]).map(async (state: string) => {
    if (breakdownBySex) {
      const [maleResponse, femaleResponse] = await Promise.all([
        CensusApi.getCensusData({
          get: "Emp",
          for: `state:${state}`,
          time,
          sex: SEX_CODES.MALE,
        }),
        CensusApi.getCensusData({
          get: "Emp",
          for: `state:${state}`,
          time,
          sex: SEX_CODES.FEMALE,
        }),
      ]);

      if (maleResponse.failed || femaleResponse.failed) {
        const error = maleResponse.error || femaleResponse.error!;
        failures.push({ state: maleResponse.state, error });
        return {
          employeeCount: 0,
          state: maleResponse.state,
          quarter: maleResponse.quarter,
          sex: SEX_CODES.ALL,
          maleEmployment: undefined,
          femaleEmployment: undefined,
          failed: true,
          error,
        };
      }

      return {
        employeeCount:
          maleResponse.employeeCount + femaleResponse.employeeCount,
        state: maleResponse.state,
        quarter: maleResponse.quarter,
        sex: SEX_CODES.ALL,
        maleEmployment: maleResponse.employeeCount,
        femaleEmployment: femaleResponse.employeeCount,
      };
    }

    const response = await CensusApi.getCensusData({
      get: "Emp",
      for: `state:${state}`,
      time,
      sex: SEX_CODES.ALL,
    });

    if (response.failed) {
      failures.push({ state: response.state, error: response.error! });
    }
    return response;
  });

  const parsedData = await Promise.all(statePromises);

  return { parsedData, failures };
};

const getWorkforceData = async (
  states: string | string[],
  time: string,
  breakdownBySex: boolean = false
): Promise<WorkforceResponse> => {
  const stateCount =
    states === "ALL" ? statesData.states.length : states.length;

  const { parsedData, failures } = await getData(states, time, breakdownBySex);

  return {
    data: parsedData,
    failures,
    totalStates: stateCount,
    successfulStates: stateCount - failures.length,
  };
};

export default {
  getWorkforceData,
};
