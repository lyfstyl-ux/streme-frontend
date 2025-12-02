import { SortOption } from "./TokenGrid";
import { TrendingUp, Clock, Users, Sparkles } from "lucide-react";

interface SortButtonsProps {
  sortBy: SortOption;
  onSortChange: (option: SortOption) => void;
  isMiniView?: boolean;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "trending", label: "Trending" },
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  // { value: "crowdfunds", label: "Crowdfunds" },
];

const SORT_OPTIONS_STANDARD: { value: SortOption; label: string }[] = [
  { value: "trending", label: "Trending" },
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "stakers", label: "Most Stakers" },
  // { value: "crowdfunds", label: "Crowdfunds" },
];

function IconFor({ option }: { option: SortOption }) {
  switch (option) {
    case "trending":
      return <TrendingUp className="w-4 h-4" />;
    case "newest":
      return <Sparkles className="w-4 h-4" />;
    case "oldest":
      return <Clock className="w-4 h-4" />;
    case "stakers":
      return <Users className="w-4 h-4" />;
    default:
      return <span className="w-4 h-4 inline-block" />;
  }
}

export function SortButtons({
  sortBy,
  onSortChange,
  isMiniView = false,
}: SortButtonsProps) {
  const options = isMiniView ? SORT_OPTIONS : SORT_OPTIONS_STANDARD;

  return (
    <div className="join w-full">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onSortChange(option.value)}
          className={`btn btn-sm join-item ${isMiniView ? "flex-1" : ""} ${
            sortBy === option.value ? "btn-primary" : "btn-ghost"
          }`}
        >
          <span className="inline-flex items-center gap-2">
            <span className="text-sm leading-none">
              <IconFor option={option.value} />
            </span>
            <span>{option.label}</span>
          </span>
        </button>
      ))}
    </div>
  );
}
