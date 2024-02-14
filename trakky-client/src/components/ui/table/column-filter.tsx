/* eslint-disable @typescript-eslint/no-explicit-any */
import { Column, Table } from '@tanstack/react-table';
import { useMemo } from 'react';
import {
  DebouncedInput,
  DebouncedSelect,
} from '@/components/ui/table/debounce-input';
import {
  convertFilterDateFormat,
  formatDateMonth,
  isValidDate,
} from '@/lib/formatter';

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

  const sortedUniqueValues = useMemo(() => {
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
  }, [column, firstValue]);

  if (typeof firstValue === 'number') {
    return (
      <div>
        <div className="flex space-x-0.5">
          <DebouncedInput
            type="number"
            min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
            max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
            value={(columnFilterValue as [number, number])?.[0] ?? ''}
            onChange={(value) =>
              column.setFilterValue((old: [number, number]) => [
                value,
                old?.[1],
              ])
            }
            placeholder="Min"
            className="rounded-none w-1/2 placeholder-slate-700 placeholder:text-xs selection:bg-slate-700 focus:bg-slate-700  shadow bg-slate-800 pl-1 focus:outline-none"
          />
          <DebouncedInput
            type="number"
            min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
            max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
            value={(columnFilterValue as [number, number])?.[1] ?? ''}
            onChange={(value) =>
              column.setFilterValue((old: [number, number]) => [
                old?.[0],
                value,
              ])
            }
            placeholder="Max"
            className="rounded-none w-1/2 placeholder-slate-700 placeholder:text-xs selection:bg-slate-700 focus:bg-slate-700  shadow bg-slate-800 pl-1 focus:outline-none"
          />
        </div>
      </div>
    );
  }

  if (isValidDate(firstValue)) {
    return (
      <div className="overflow-auto">
        <div className="flex space-x-0.5">
          <DebouncedSelect
            options={sortedUniqueValues}
            value={(columnFilterValue ?? '') as string}
            onChange={(value) => {
              column.setFilterValue(value === 'All' ? '' : value);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <datalist className="bg-slate-900" id={`${column.id}list`}>
        {sortedUniqueValues.slice(0, 5000).map((value: string) => (
          <option
            className="border-slate-900 red"
            value={value}
            key={value}
            aria-label={value}
          />
        ))}
      </datalist>
      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? '') as string}
        onChange={(value) => column.setFilterValue(value)}
        placeholder=""
        className="rounded-none w-full shadow bg-slate-800 text-slate-400 selection:bg-slate-700 pl-2 focus:bg-slate-700 focus:outline-none"
        list={`${column.id}list`}
      />
    </>
  );
}

export default Filter;
