import WorkforceService from "./workforce.service";
import { CensusApi } from "../../services";
import { SEX_CODES } from "./workforce.schema";

jest.mock("../../services", () => ({
  CensusApi: {
    getCensusData: jest.fn(),
  },
}));

jest.mock("../../utils/constants/states.json", () => ({
  states: [
    { code: "01", name: "Alabama" },
    { code: "02", name: "Alaska" },
    { code: "06", name: "California" },
  ],
}));

const mockCensusApi = CensusApi as jest.Mocked<typeof CensusApi>;

describe("WorkforceService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getWorkforceData", () => {
    it("should return successful data for a single state", async () => {
      mockCensusApi.getCensusData.mockResolvedValue({
        employeeCount: 12345,
        state: "Alabama",
        quarter: "2023-Q1",
        sex: SEX_CODES.ALL,
      });

      const result = await WorkforceService.getWorkforceData(["01"], "2023-Q1");

      expect(result).toEqual({
        data: [
          {
            employeeCount: 12345,
            state: "Alabama",
            quarter: "2023-Q1",
            sex: SEX_CODES.ALL,
          },
        ],
        failures: [],
        totalStates: 1,
        successfulStates: 1,
      });

      expect(mockCensusApi.getCensusData).toHaveBeenCalledWith({
        get: "Emp",
        for: "state:01",
        time: "2023-Q1",
        sex: SEX_CODES.ALL,
      });
    });

    it('should return data for all states when "ALL" is specified', async () => {
      mockCensusApi.getCensusData
        .mockResolvedValueOnce({ employeeCount: 10000, state: "Alabama", quarter: "2023-Q1", sex: SEX_CODES.ALL })
        .mockResolvedValueOnce({ employeeCount: 20000, state: "Alaska", quarter: "2023-Q1", sex: SEX_CODES.ALL })
        .mockResolvedValueOnce({ employeeCount: 30000, state: "California", quarter: "2023-Q1", sex: SEX_CODES.ALL });

      const result = await WorkforceService.getWorkforceData("ALL", "2023-Q1");

      expect(result).toEqual({
        data: [
          {
            employeeCount: 10000,
            state: "Alabama",
            quarter: "2023-Q1",
            sex: SEX_CODES.ALL,
          },
          {
            employeeCount: 20000,
            state: "Alaska",
            quarter: "2023-Q1",
            sex: SEX_CODES.ALL,
          },
          {
            employeeCount: 30000,
            state: "California",
            quarter: "2023-Q1",
            sex: SEX_CODES.ALL,
          },
        ],
        failures: [],
        totalStates: 3,
        successfulStates: 3,
      });

      expect(mockCensusApi.getCensusData).toHaveBeenCalledTimes(3);
    });

    it("should handle API errors and return failed data", async () => {
      mockCensusApi.getCensusData.mockResolvedValue({
        employeeCount: 0,
        state: "Alabama",
        quarter: "2023-Q1",
        sex: SEX_CODES.ALL,
        failed: true,
        error: "Census API request failed: Network error",
      });

      const result = await WorkforceService.getWorkforceData(["01"], "2023-Q1");

      expect(result).toEqual({
        data: [
          {
            employeeCount: 0,
            state: "Alabama",
            quarter: "2023-Q1",
            sex: SEX_CODES.ALL,
            failed: true,
            error: "Census API request failed: Network error",
          },
        ],
        failures: [
          {
            state: "Alabama",
            error: "Census API request failed: Network error",
          },
        ],
        totalStates: 1,
        successfulStates: 0,
      });
    });

    it("should handle empty data responses", async () => {
      mockCensusApi.getCensusData.mockResolvedValue({
        employeeCount: 0,
        state: "Alabama",
        quarter: "2023-Q1",
        sex: SEX_CODES.ALL,
        failed: true,
        error: "No data available for this state",
      });

      const result = await WorkforceService.getWorkforceData(["01"], "2023-Q1");

      expect(result).toEqual({
        data: [
          {
            employeeCount: 0,
            state: "Alabama",
            quarter: "2023-Q1",
            sex: SEX_CODES.ALL,
            failed: true,
            error: "No data available for this state",
          },
        ],
        failures: [
          {
            state: "Alabama",
            error: "No data available for this state",
          },
        ],
        totalStates: 1,
        successfulStates: 0,
      });
    });

    it("should handle sex breakdown and aggregate data correctly", async () => {
      mockCensusApi.getCensusData
        .mockResolvedValueOnce({ employeeCount: 5000, state: "Alabama", quarter: "2023-Q1", sex: SEX_CODES.MALE }) // Male
        .mockResolvedValueOnce({ employeeCount: 7000, state: "Alabama", quarter: "2023-Q1", sex: SEX_CODES.FEMALE }); // Female

      const result = await WorkforceService.getWorkforceData(
        ["01"],
        "2023-Q1",
        true
      );

      expect(result).toEqual({
        data: [
          {
            employeeCount: 12000,
            state: "Alabama",
            quarter: "2023-Q1",
            sex: SEX_CODES.ALL,
            maleEmployment: 5000,
            femaleEmployment: 7000,
          },
        ],
        failures: [],
        totalStates: 1,
        successfulStates: 1,
      });

      expect(mockCensusApi.getCensusData).toHaveBeenCalledWith({
        get: "Emp",
        for: "state:01",
        time: "2023-Q1",
        sex: SEX_CODES.MALE,
      });

      expect(mockCensusApi.getCensusData).toHaveBeenCalledWith({
        get: "Emp",
        for: "state:01",
        time: "2023-Q1",
        sex: SEX_CODES.FEMALE,
      });
    });

    it("should handle partial failures in sex breakdown", async () => {
      mockCensusApi.getCensusData
        .mockResolvedValueOnce({ employeeCount: 5000, state: "Alabama", quarter: "2023-Q1", sex: SEX_CODES.MALE }) // Male success
        .mockResolvedValueOnce({ employeeCount: 0, state: "Alabama", quarter: "2023-Q1", sex: SEX_CODES.FEMALE, failed: true, error: "API Error" }); // Female failure

      const result = await WorkforceService.getWorkforceData(
        ["01"],
        "2023-Q1",
        true
      );

      expect(result).toEqual({
        data: [
          {
            employeeCount: 0,
            state: "Alabama",
            quarter: "2023-Q1",
            sex: SEX_CODES.ALL,
            maleEmployment: undefined,
            femaleEmployment: undefined,
            failed: true,
            error: "API Error",
          },
        ],
        failures: [
          {
            state: "Alabama",
            error: "API Error",
          },
        ],
        totalStates: 1,
        successfulStates: 0,
      });
    });

    it("should handle mixed success and failure states", async () => {
      mockCensusApi.getCensusData
        .mockResolvedValueOnce({ employeeCount: 10000, state: "Alabama", quarter: "2023Q1", sex: SEX_CODES.ALL }) // Alabama success
        .mockResolvedValueOnce({ employeeCount: 0, state: "Alaska", quarter: "2023Q1", sex: SEX_CODES.ALL, failed: true, error: "Network timeout" }); // Alaska failure

      const result = await WorkforceService.getWorkforceData(
        ["01", "02"],
        "2023Q1"
      );

      expect(result).toEqual({
        data: [
          {
            employeeCount: 10000,
            state: "Alabama",
            quarter: "2023Q1",
            sex: SEX_CODES.ALL,
          },
          {
            employeeCount: 0,
            state: "Alaska",
            quarter: "2023Q1",
            sex: SEX_CODES.ALL,
            failed: true,
            error: "Network timeout",
          },
        ],
        failures: [
          {
            state: "Alaska",
            error: "Network timeout",
          },
        ],
        totalStates: 2,
        successfulStates: 1,
      });
    });

    it("should handle undefined data response", async () => {
      mockCensusApi.getCensusData.mockResolvedValue({
        employeeCount: 0,
        state: "Alabama",
        quarter: "2023Q1",
        sex: SEX_CODES.ALL,
        failed: true,
        error: "No data available for this state",
      });

      const result = await WorkforceService.getWorkforceData(["01"], "2023Q1");

      expect(result.data[0].failed).toBe(true);
      expect(result.data[0].error).toBe("No data available for this state");
      expect(result.failures).toHaveLength(1);
      expect(result.successfulStates).toBe(0);
    });

    it("should parse integer employee counts correctly", async () => {
      mockCensusApi.getCensusData.mockResolvedValue({
        employeeCount: 12345,
        state: "Alabama",
        quarter: "2023-Q1",
        sex: SEX_CODES.ALL,
      });

      const result = await WorkforceService.getWorkforceData(["01"], "2023-Q1");

      expect(result.data[0].employeeCount).toBe(12345);
      expect(typeof result.data[0].employeeCount).toBe("number");
    });

    it("should default breakdownBySex parameter to false", async () => {
      mockCensusApi.getCensusData.mockResolvedValue({
        employeeCount: 12345,
        state: "Alabama",
        quarter: "2023-Q1",
        sex: SEX_CODES.ALL,
      });

      const result = await WorkforceService.getWorkforceData(["01"], "2023-Q1");

      expect(mockCensusApi.getCensusData).toHaveBeenCalledWith({
        get: "Emp",
        for: "state:01",
        time: "2023-Q1",
        sex: SEX_CODES.ALL,
      });
      expect(mockCensusApi.getCensusData).toHaveBeenCalledTimes(1);
    });

    it("should calculate state count correctly for ALL states", async () => {
      mockCensusApi.getCensusData
        .mockResolvedValueOnce({ employeeCount: 10000, state: "Alabama", quarter: "2023-Q1", sex: SEX_CODES.ALL })
        .mockResolvedValueOnce({ employeeCount: 20000, state: "Alaska", quarter: "2023-Q1", sex: SEX_CODES.ALL })
        .mockResolvedValueOnce({ employeeCount: 30000, state: "California", quarter: "2023-Q1", sex: SEX_CODES.ALL });

      const result = await WorkforceService.getWorkforceData("ALL", "2023-Q1");

      expect(result.totalStates).toBe(3);
      expect(result.successfulStates).toBe(3);
    });

    it("should calculate state count correctly for array of states", async () => {
      mockCensusApi.getCensusData
        .mockResolvedValueOnce({ employeeCount: 10000, state: "Alabama", quarter: "2023-Q1", sex: SEX_CODES.ALL })
        .mockResolvedValueOnce({ employeeCount: 20000, state: "Alaska", quarter: "2023-Q1", sex: SEX_CODES.ALL });

      const result = await WorkforceService.getWorkforceData(["01", "02"], "2023-Q1");

      expect(result.totalStates).toBe(2);
      expect(result.successfulStates).toBe(2);
    });
  });
});
