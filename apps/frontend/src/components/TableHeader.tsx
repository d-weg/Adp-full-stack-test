import SortIcon from './SortIcon';

type SortField = 'state' | 'totalEmployment' | 'maleEmployment' | 'femaleEmployment';
type SortDirection = 'asc' | 'desc';

interface TableHeaderProps {
  showSexBreakdown: boolean;
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
}

export default function TableHeader({ showSexBreakdown, sortField, sortDirection, onSort }: TableHeaderProps) {
  return (
    <thead className="bg-gray-50 sticky top-0 z-10">
      <tr>
        <th
          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
          onClick={() => onSort('state')}
        >
          <div className="flex items-center space-x-1">
            <span>State</span>
            <SortIcon field="state" currentSortField={sortField} sortDirection={sortDirection} />
          </div>
        </th>
        {showSexBreakdown && (
          <>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => onSort('maleEmployment')}
            >
              <div className="flex items-center space-x-1">
                <span>Male</span>
                <SortIcon field="maleEmployment" currentSortField={sortField} sortDirection={sortDirection} />
              </div>
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => onSort('femaleEmployment')}
            >
              <div className="flex items-center space-x-1">
                <span>Female</span>
                <SortIcon field="femaleEmployment" currentSortField={sortField} sortDirection={sortDirection} />
              </div>
            </th>
          </>
        )}
        <th
          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
          onClick={() => onSort('totalEmployment')}
        >
          <div className="flex items-center space-x-1">
            <span>Total Employment</span>
            <SortIcon field="totalEmployment" currentSortField={sortField} sortDirection={sortDirection} />
          </div>
        </th>
      </tr>
    </thead>
  );
}