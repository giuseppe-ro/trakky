/* eslint-disable @typescript-eslint/no-explicit-any */
import { Column, Table } from '@tanstack/react-table';
import {
  DebouncedInput,
  DebouncedSelect,
} from '@/components/ui/table/debounce-input';
import {
  convertFilterDateFormat,
  formatDateMonth,
  isValidDate,
} from '@/lib/text-formatter';

export function Filter<TData>({
  column,
  table,
}: {
  column: Column<any>;
  table: Table<TData>;
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  const sortedUniqueValues = () => {
    const uniqueValues = column.getFacetedUniqueValues();

    if (typeof firstValue === 'number') return [];
    if (isValidDate(firstValue)) {
      return Array.from(uniqueValues.keys()).reduce(
        (acc: { key: string; value: string }[], date: string) => {
          const formattedDate = formatDateMonth(date);
          if (!acc.some((obj) => obj.key === formattedDate)) {
            acc.push({
              key: formattedDate,
              value: convertFilterDateFormat(date),
            });
          }
          return acc;
        },
        []
      );
    }

    return Array.from(column.getFacetedUniqueValues().keys()).sort();
  };

  if (typeof firstValue === 'number') {
    return (
      <div className="flex space-x-0.5">
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
          value={(columnFilterValue as [number, number])?.[0] ?? ''}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [value, old?.[1]])
          }
          placeholder="Min"
          className="h-6 text-center sm:text-left rounded-none font-thin w-[100%] sm:w-1/2 placeholder:text-xs focus:bg-secondary shadow bg-primary-foreground pl-1 focus:outline-none"
        />
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
          value={(columnFilterValue as [number, number])?.[1] ?? ''}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [old?.[0], value])
          }
          placeholder="Max"
          className="hidden sm:flex h-6 rounded-none font-thin w-1/2 placeholder:text-xs focus:bg-secondary shadow bg-primary-foreground pl-1 focus:outline-none"
        />
      </div>
    );
  }

  if (isValidDate(firstValue)) {
    return (
      <div className="flex space-x-0.5">
        <DebouncedSelect
          options={sortedUniqueValues()}
          value={(columnFilterValue ?? '') as string}
          onChange={(value) => {
            column.setFilterValue(value === 'All' ? '' : value);
          }}
          className="h-6"
        />
      </div>
    );
  }

  return (
    <div>
      <datalist id={`${column.id}list`}>
        {sortedUniqueValues()
          .slice(0, 5000)
          .map((value: string) => (
            <option value={value} key={value} aria-label={value} />
          ))}
      </datalist>
      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? '') as string}
        onChange={(value) => column.setFilterValue(value)}
        placeholder=""
        className="h-6 rounded-none w-full shadow focus:bg-secondary bg-primary-foreground font-thin text-primary/50 selection:bg-primary-foreground pl-2 focus:outline-none"
        list={`${column.id}list`}
      />
    </div>
  );
}

export default Filter;
