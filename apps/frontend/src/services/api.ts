import { createHttpClient } from "@/utils/http";
import { FilterState, WorkforceApiResponse } from "@/types/census";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const httpClient = createHttpClient({
  baseUrl: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getWorkforceData(
  filters: FilterState
): Promise<WorkforceApiResponse> {
  const params = new URLSearchParams();

  // Handle state selection
  if (filters.selectedStates.length === 0) {
    // Send "ALL" when empty array (all states selected)
    params.append("states", "ALL");
    params.append("time", filters.selectedQuarter);
    params.append("breakdownBySex", filters.breakdownBySex.toString());
    return httpClient.get(`/v1/workforce?${params.toString()}`);
  }

  // Send each selected state as separate parameter to create array
  filters.selectedStates.forEach((state) => {
    params.append("states", state);
  });

  params.append("time", filters.selectedQuarter);
  params.append("breakdownBySex", filters.breakdownBySex.toString());

  return httpClient.get(`/v1/workforce?${params.toString()}`);
}
