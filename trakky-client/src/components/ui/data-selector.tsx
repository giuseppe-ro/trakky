import { Selection } from '@/components/ui/select';
import { FadeRight } from '@/components/ui/animations/fade';
import { useEffect } from 'react';
import { demoMode, StorageKey } from '@/constants';
import { twMerge } from 'tailwind-merge';

function YearSelection({
  availableYears,
  selectedYear,
  onYearChange,
  onMonthChange,
  selectedMonth,
}: {
  availableYears: Map<string, string[]> | undefined;
  selectedYear: string | null;
  selectedMonth: string | null;
  onYearChange: (year: string) => void;
  onMonthChange: (month: string) => void;
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

  const changeMonth = (month: string) => {
    localStorage.setItem(StorageKey.SelectedMonth, month);
    onMonthChange(month);
  };

  const month = (): string | null => {
    let newMonth: string | null;

    const storedMonth = localStorage.getItem(StorageKey.SelectedMonth);
    if (storedMonth !== null) {
      newMonth = storedMonth;
    } else {
      newMonth = selectedMonth;
    }

    const availableMonths = availableYears?.get(selectedYear ?? 'All Years');

    if (!availableMonths || !availableMonths.includes(newMonth ?? '')) {
      return 'All Months';
    }

    return newMonth;
  };

  useEffect(() => {
    const storedYear = localStorage.getItem(StorageKey.SelectedYear);
    const storedMonth = localStorage.getItem(StorageKey.SelectedMonth);

    if (storedYear) {
      try {
        onYearChange(storedYear);
      } catch (e) {
        localStorage.removeItem(StorageKey.SelectedYear);
      }
    }

    if (storedMonth && storedYear && availableYears) {
      const availableMonths = availableYears?.get(storedYear);

      if (availableMonths && availableMonths.includes(storedMonth)) {
        try {
          onMonthChange(storedMonth);
        } catch (e) {
          localStorage.removeItem(StorageKey.SelectedMonth);
        }
      } else {
        onMonthChange('All Months');
        localStorage.setItem(StorageKey.SelectedMonth, 'All Months');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear]);

  return (
    selectedYear &&
    availableYears &&
    Array.from(availableYears.keys()).length > 0 && (
      <FadeRight
        className={twMerge(
          `sticky top-20 z-30 px-2 md:px-0`,
          demoMode && 'top-24'
        )}
      >
        <div className="flex w-full gap-x-3 mt-4">
          <Selection
            value={year()}
            onChange={changeYear}
            options={Array.from(availableYears.keys())}
            {...{
              className:
                'rounded-lg w-[50%] min-w-[164px] border border-secondary-foreground/10 overscroll-contain bg-secondary/50 hover:bg-secondary h-10',
            }}
          />
          <Selection
            value={month()}
            onChange={changeMonth}
            options={availableYears.get(selectedYear) ?? []}
            {...{
              className:
                'rounded-lg w-[50%] min-w-[164px] border border-secondary-foreground/10 overscroll-contain bg-secondary/50 hover:bg-secondary h-10',
            }}
          />
        </div>
      </FadeRight>
    )
  );
}

export default YearSelection;
