"use client";

import { useState } from "react";
import { EmploymentData, StateFailure } from "@/types/census";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import EmptyState from "./EmptyState";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";

interface EmploymentTableProps {
  data: EmploymentData[];
  showSexBreakdown: boolean;
  loading: boolean;
  error: string | null;
  failures?: StateFailure[];
  totalStates?: number;
  successfulStates?: number;
}

type SortField =
  | "state"
  | "totalEmployment"
  | "maleEmployment"
  | "femaleEmployment";
type SortDirection = "asc" | "desc";

export default function EmploymentTable({
  data,
  showSexBreakdown,
  loading,
  error,
  failures = [],
  totalStates = 0,
  successfulStates = 0,
}: EmploymentTableProps) {
  const [sortField, setSortField] = useState<SortField>("state");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedData = [...data].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    switch (sortField) {
      case "state":
        aValue = a.state;
        bValue = b.state;
        break;
      case "totalEmployment":
        aValue = a.totalEmployment;
        bValue = b.totalEmployment;
        break;
      case "maleEmployment":
        aValue = a.maleEmployment || 0;
        bValue = b.maleEmployment || 0;
        break;
      case "femaleEmployment":
        aValue = a.femaleEmployment || 0;
        bValue = b.femaleEmployment || 0;
        break;
      default:
        aValue = a.state;
        bValue = b.state;
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      const comparison = aValue.localeCompare(bValue);
      return sortDirection === "asc" ? comparison : -comparison;
    }

    const comparison = (aValue as number) - (bValue as number);
    return sortDirection === "asc" ? comparison : -comparison;
  });

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (data.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto max-h-[70vh]">
          <table className="min-w-full divide-y divide-gray-200">
            <TableHeader
              showSexBreakdown={showSexBreakdown}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
          </table>
        </div>
        <div className="overflow-x-auto overflow-y-auto max-h-[60vh]">
          <table className="min-w-full divide-y divide-gray-200">
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedData.map((row, index) => (
                <TableRow
                  key={`${row.stateCode}-${index}`}
                  row={row}
                  index={index}
                  showSexBreakdown={showSexBreakdown}
                  formatNumber={formatNumber}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
