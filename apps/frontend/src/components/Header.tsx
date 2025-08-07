import statesData from "@/utils/constants/states.json";

const { states } = statesData;

interface HeaderProps {
  selectedStates: string[];
  selectedQuarter: string;
}

export default function Header({ selectedStates, selectedQuarter }: HeaderProps) {
  const getStateName = (stateCode: string) => {
    if (stateCode === "ALL") return "All States";
    const state = states.find((s) => s.code === stateCode);
    return state?.name || stateCode;
  };

  return (
    <header className="mb-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Employment Data for {selectedQuarter}
      </h1>
      <div className="flex items-center gap-2">
        <span className="font-medium text-gray-700">States:</span>
        <div className="flex flex-wrap gap-1">
          {selectedStates.map((state, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500 text-white"
            >
              {getStateName(state)}
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}