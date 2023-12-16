import { Selection } from "@/components/ui/select.tsx";
import { FadeRight } from "@/components/animations/fade.tsx";
import { useEffect } from "react";

export function YearSelection({
  availableYears,
  selectedYear,
  onYearChange,
}: {
  availableYears: string[];
  selectedYear: string | null;
  onYearChange: (year: string) => void;
}) {

  const changeYear = (year: string) => {
    localStorage.setItem("selected_year", year);
    onYearChange(year);
  }

  const year = (): string | null => {
    const storedYear = localStorage.getItem("selected_year");
    if (storedYear !== null) {
      return storedYear;
    }

    return selectedYear;
  }

  useEffect(() => {
    const year = localStorage.getItem("selected_year");

    if (year) {
      try {
        console.log("setting year:", year)
        onYearChange(year);
      } catch (e) {
        localStorage.removeItem("selected_year")
        console.log(e);
      }
    }
  }, []);

  return (
    availableYears.length > 0 && (
      <FadeRight className="sticky top-20 z-50 px-2 md:px-0">
        <Selection
          value={year()}
          onChange={changeYear}
          options={availableYears}
          {...{
            className: "rounded-md w-full overscroll-contain bg-gray-950 ",
          }}
        />
      </FadeRight>
    )
  );
}
