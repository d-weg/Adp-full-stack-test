"use server";

import { EmploymentData, FilterState, StateFailure } from "@/types/census";
import { getWorkforceData } from "@/services/api";

export async function fetchEmploymentData(filters: FilterState): Promise<{
  data: EmploymentData[];
  failures: StateFailure[];
  totalStates: number;
  successfulStates: number;
}> {
  try {
    if (filters.breakdownBySex && filters.selectedStates.length > 1) {
      const promises = filters.selectedStates.map((state) =>
        getWorkforceData({
          ...filters,
          selectedStates: [state],
        })
      );

      const results = await Promise.all(promises);
      const allFailures = results.flatMap((result) => result.failures || []);
      const totalStates = results.reduce(
        (sum, result) => sum + (result.totalStates || 0),
        0
      );
      const successfulStates = results.reduce(
        (sum, result) => sum + (result.successfulStates || 0),
        0
      );

      return {
        data: results.flatMap((result) =>
          result.data.map((item) => ({
            state: item.state,
            stateCode: item.state,
            totalEmployment: item.employeeCount,
            maleEmployment: item.maleEmployment,
            femaleEmployment: item.femaleEmployment,
            failed: item.failed,
            error: item.error,
          }))
        ),
        failures: allFailures,
        totalStates,
        successfulStates,
      };
    }

    const result = await getWorkforceData(filters);
    return {
      data: result.data.map((item) => ({
        state: item.state,
        stateCode: item.state,
        totalEmployment: item.employeeCount,
        maleEmployment: item.maleEmployment,
        femaleEmployment: item.femaleEmployment,
        failed: item.failed,
        error: item.error,
      })),
      failures: result.failures || [],
      totalStates: result.totalStates || 0,
      successfulStates: result.successfulStates || 0,
    };
  } catch (error) {
    console.error("Error fetching employment data:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "An error occurred while fetching data"
    );
  }
}
