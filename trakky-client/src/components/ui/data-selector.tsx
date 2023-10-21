import { Selection } from "@/components/ui/select.tsx";

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
      <div
        data-aos="fade-right"
        data-aos-easing="ease-out-cubic"
        data-aos-duration="500"
        data-aos-delay="100"
        className="sticky top-20 z-50"
      >
        <Selection
          value={selectedYear}
          onChange={onYearChange}
          options={availableYears}
          {...{
            className: "rounded-md w-full overscroll-contain bg-gray-950",
          }}
        />
      </div>
    )
  );
}
