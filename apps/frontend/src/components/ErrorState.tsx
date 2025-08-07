interface ErrorStateProps {
  error: string;
  className?: string;
}

export default function ErrorState({ error, className = "bg-white rounded-lg shadow-md p-6" }: ErrorStateProps) {
  return (
    <div className={className}>
      <div className="text-center py-8">
        <svg className="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading data</h3>
        <p className="mt-1 text-sm text-gray-500">{error}</p>
      </div>
    </div>
  );
}