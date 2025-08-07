'use client';

import { useQuery } from '@tanstack/react-query';
import { FilterState } from '@/types/census';
import { fetchEmploymentData as fetchEmploymentDataAction } from '@/actions/census';

export function useEmploymentData(filters: FilterState) {
  const {
    data: result,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['employmentData', filters],
    queryFn: () => fetchEmploymentDataAction(filters),
    enabled: true,
    staleTime: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return {
    data: result?.data || [],
    loading: isLoading,
    error: error?.message || null,
    failures: result?.failures || [],
    totalStates: result?.totalStates || 0,
    successfulStates: result?.successfulStates || 0,
    fetchEmploymentData: refetch,
  };
}