import { Selection } from "@/components/ui/select.tsx";
import { FadeRight } from "@/components/animations/fade.tsx";

export function YearSelection({
  availableYears,
  selectedYear,
  onYearChange,
}: {
  availableYears: string[];
  selectedYear: string | null;
  onYearChange: (year: string) => void;
}) {
  return (
    availableYears.length > 0 && (
      <FadeRight className="sticky top-20 z-50">
        <Selection
          value={selectedYear}
          onChange={onYearChange}
          options={availableYears}
          {...{
            className: "rounded-md w-full overscroll-contain bg-gray-950",
          }}
        />
      </FadeRight>
    )
  );
}
