export interface EmploymentData {
  state: string;
  stateCode: string;
  totalEmployment: number;
  maleEmployment?: number;
  femaleEmployment?: number;
  failed?: boolean;
  error?: string;
}

export interface FilterState {
  selectedStates: string[];
  selectedQuarter: string;
  selectedSex: string[];
  breakdownBySex: boolean;
}

export interface ApiResponse {
  data: EmploymentData[];
  loading: boolean;
  error: string | null;
  failures?: StateFailure[];
  totalStates?: number;
  successfulStates?: number;
}

export interface WorkforceApiItem {
  employeeCount: number;
  state: string;
  quarter: string;
  sex: '0' | '1' | '2';
  maleEmployment?: number;
  femaleEmployment?: number;
  failed?: boolean;
  error?: string;
}

export interface StateFailure {
  state: string;
  error: string;
}

export interface WorkforceApiResponse {
  data: WorkforceApiItem[];
  failures: StateFailure[];
  totalStates: number;
  successfulStates: number;
}

export const QUARTERS = [
  '2023-Q4',
  '2023-Q3',
  '2023-Q2',
  '2023-Q1',
  '2022-Q4',
  '2022-Q3',
  '2022-Q2',
  '2022-Q1',
  '2021-Q4',
  '2021-Q3',
  '2021-Q2',
  '2021-Q1',
  '2020-Q4',
  '2020-Q3',
  '2020-Q2',
  '2020-Q1',
];

export const SEX_OPTIONS = [
  { code: '0', name: 'All' },
  { code: '1', name: 'Male' },
  { code: '2', name: 'Female' }
];

