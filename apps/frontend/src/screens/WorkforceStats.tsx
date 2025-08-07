"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Filters from "@/components/Filters";
import EmploymentTable from "@/components/EmploymentTable";
import { useEmploymentData } from "@/hooks/useEmploymentData";
import { FilterState } from "@/types/census";

export default function WorkforceStats() {
  const [filters, setFilters] = useState<FilterState>({
    selectedStates: ["ALL"],
    selectedQuarter: "2023-Q4",
    selectedSex: [],
    breakdownBySex: false,
  });

  const {
    data,
    loading,
    error,
    failures,
    totalStates,
    successfulStates,
  } = useEmploymentData(filters);

  return (
    <>
      <Header
        selectedQuarter={filters.selectedQuarter}
        selectedStates={filters.selectedStates}
      />

      <Filters
        filters={filters}
        onFiltersChange={setFilters}
      />

      <EmploymentTable
        data={data}
        showSexBreakdown={filters.breakdownBySex}
        loading={loading}
        error={error}
        failures={failures}
        totalStates={totalStates}
        successfulStates={successfulStates}
      />
    </>
  );
}
