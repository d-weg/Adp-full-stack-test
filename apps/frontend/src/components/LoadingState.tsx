interface LoadingStateProps {
  className?: string;
}

export default function LoadingState({ className = "bg-white rounded-lg shadow-md p-6" }: LoadingStateProps) {
  return (
    <div className={className}>
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}