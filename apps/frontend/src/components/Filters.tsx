"use client";

import { FilterState, QUARTERS, SEX_OPTIONS } from "@/types/census";
import statesData from "@/utils/constants/states.json";
import Select from "./Select";

const { states } = statesData;

interface FiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export default function Filters({ filters, onFiltersChange }: FiltersProps) {
  const quarterOptions = QUARTERS.map((quarter) => ({
    code: quarter,
    name: quarter,
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <Select
          label="State(s)"
          options={[{ code: "ALL", name: "All States" }, ...states]}
          selectedValues={
            filters.selectedStates.length === 0
              ? ["ALL"]
              : filters.selectedStates
          }
          onChange={(values) => {
            if (
              !filters.selectedStates.includes("ALL") ===
                values.includes("ALL") ||
              values.length === 0
            ) {
              onFiltersChange({ ...filters, selectedStates: ["ALL"] });
              return;
            }

            const filteredValues = values.filter((v) => v !== "ALL");

            onFiltersChange({ ...filters, selectedStates: filteredValues });
          }}
          placeholder="All States"
          multiple={true}
        />

        <Select
          label="Quarter"
          options={quarterOptions}
          selectedValues={[filters.selectedQuarter]}
          onChange={(values) =>
            onFiltersChange({ ...filters, selectedQuarter: values[0] })
          }
          placeholder="Select Quarter"
          multiple={false}
        />

        <div className="flex flex-col justify-end h-full">
          <label className="flex items-center h-10">
            <input
              type="checkbox"
              className="form-checkbox h-4 w-4 text-blue-600 rounded mr-2"
              checked={filters.breakdownBySex}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  breakdownBySex: e.target.checked,
                })
              }
            />
            <span className="text-sm font-medium text-gray-700">
              Breakdown by Sex
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
