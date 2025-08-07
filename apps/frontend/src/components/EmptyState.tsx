interface EmptyStateProps {
  className?: string;
}

export default function EmptyState({ className = "bg-white rounded-lg shadow-md p-6" }: EmptyStateProps) {
  return (
    <div className={className}>
      <div className="text-center py-8">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No data found</h3>
        <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria.</p>
      </div>
    </div>
  );
}