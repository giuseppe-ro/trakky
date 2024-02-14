import { Selection } from '@/components/ui/select';
import { FadeRight } from '@/components/animations/fade';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { demoMode, StorageKey } from '@/constants';

function YearSelection({
  availableYears,
  selectedYear,
  onYearChange,
}: {
  availableYears: string[];
  selectedYear: string | null;
  onYearChange: (year: string) => void;
}) {
  const changeYear = (year: string) => {
    localStorage.setItem(StorageKey.SelectedYear, year);
    onYearChange(year);
  };

  const year = (): string | null => {
    const storedYear = localStorage.getItem(StorageKey.SelectedYear);
    if (storedYear !== null) {
      return storedYear;
    }

    return selectedYear;
  };

  useEffect(() => {
    const storedYear = localStorage.getItem(StorageKey.SelectedYear);

    if (storedYear) {
      try {
        onYearChange(storedYear);
      } catch (e) {
        localStorage.removeItem(StorageKey.SelectedYear);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    availableYears.length > 0 && (
      <FadeRight
        className={cn(`sticky top-20 z-30 px-2 md:px-0`, demoMode && 'top-24')}
      >
        <Selection
          value={year()}
          onChange={changeYear}
          options={availableYears}
          {...{
            className: 'rounded-md w-full overscroll-contain bg-gray-950 ',
          }}
        />
      </FadeRight>
    )
  );
}

export default YearSelection;
