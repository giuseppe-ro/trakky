import { Selection } from '@/components/ui/select';
import { FadeRight } from '@/components/ui/animations/fade';
import { useEffect } from 'react';
import { StorageKey } from '@/constants';

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
  onMonthChange?: (month: string) => void;
}) {
  const showMonth = onMonthChange != null;

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
    onMonthChange!(month);
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

    if (storedMonth && storedYear && availableYears && onMonthChange != null) {
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
      <FadeRight>
        <div className="flex w-full gap-x-3 mt-0">
          <Selection
            value={year()}
            onChange={changeYear}
            options={Array.from(availableYears.keys())}
            {...{
              className: `rounded-md ${showMonth ? 'w-[50%]' : 'w-full'} 
              text-base sm:text-sm p-4 sm:p-2 min-w-[164px] border 
              overscroll-contain bg-select-primary hover:bg-select-foreground 
              h-10`,
            }}
          />
          {showMonth && (
            <Selection
              value={month()}
              onChange={changeMonth}
              options={availableYears.get(selectedYear) ?? []}
              {...{
                className:
                  'rounded-md w-[50%] text-base sm:text-sm p-4 sm:p-2 min-w-[164px] border overscroll-contain bg-select-primary hover:bg-select-foreground h-10',
              }}
            />
          )}
        </div>
      </FadeRight>
    )
  );
}

YearSelection.defaultProps = {
  onMonthChange: null,
};

export default YearSelection;
