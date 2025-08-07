import { EmploymentData } from '@/types/census';

interface TableRowProps {
  row: EmploymentData;
  index: number;
  showSexBreakdown: boolean;
  formatNumber: (num: number) => string;
}

export default function TableRow({ row, index, showSexBreakdown, formatNumber }: TableRowProps) {
  return (
    <tr key={`${row.stateCode}-${index}`} className={`hover:bg-gray-50 ${row.failed ? 'bg-red-50' : ''}`}>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        <div className="flex items-center space-x-2">
          <span className={row.failed ? 'text-red-600' : ''}>{row.state}</span>
          {row.failed && (
            <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        {row.failed && row.error && (
          <div className="text-xs text-red-500 mt-1">{row.error}</div>
        )}
      </td>
      {showSexBreakdown && (
        <>
          <td className={`px-6 py-4 whitespace-nowrap text-sm ${row.failed ? 'text-red-400' : 'text-gray-900'}`}>
            {row.failed ? 'Failed' : (row.maleEmployment ? formatNumber(row.maleEmployment) : 'N/A')}
          </td>
          <td className={`px-6 py-4 whitespace-nowrap text-sm ${row.failed ? 'text-red-400' : 'text-gray-900'}`}>
            {row.failed ? 'Failed' : (row.femaleEmployment ? formatNumber(row.femaleEmployment) : 'N/A')}
          </td>
        </>
      )}
      <td className={`px-6 py-4 whitespace-nowrap text-sm ${row.failed ? 'text-red-400' : 'text-gray-900'}`}>
        {row.failed ? 'Failed' : formatNumber(row.totalEmployment)}
      </td>
    </tr>
  );
}