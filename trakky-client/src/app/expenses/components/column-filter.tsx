import { Column } from "@tanstack/react-table";
import { Payment } from "@/infrastructure/payment.tsx";
import { useMemo } from "react";
import { DebouncedInput } from "@/app/expenses/components/debounce-input.tsx";

export function Filter({
  column,
  table,
}: {
  column: Column<Payment>;
  table: any;
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  const sortedUniqueValues = useMemo(
    () =>
      typeof firstValue === "number"
        ? []
        : Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column.getFacetedUniqueValues()],
  );

  return typeof firstValue === "number" ? (
    <div>
      <div className="flex space-x-1">
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
          value={(columnFilterValue as [number, number])?.[0] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [value, old?.[1]])
          }
          placeholder="Min"
          className="w-1/2 placeholder-slate-700 placeholder:text-xs selection:bg-slate-700 shadow bg-slate-900 pl-2 focus:outline-none"
        />
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
          value={(columnFilterValue as [number, number])?.[1] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [old?.[0], value])
          }
          placeholder="Max"
          className="w-1/2 placeholder-slate-700 placeholder:text-xs selection:bg-slate-700 shadow bg-slate-900 pl-2 focus:outline-none"
        />
      </div>
    </div>
  ) : (
    <>
      <datalist className="bg-slate-900" id={column.id + "list"}>
        {sortedUniqueValues.slice(0, 5000).map((value: any) => (
          <option className="border-slate-900 red" value={value} key={value} />
        ))}
      </datalist>
      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? "") as string}
        onChange={(value) => column.setFilterValue(value)}
        placeholder={""}
        className="w-full shadow bg-slate-900 text-slate-400 selection:bg-slate-700 pl-2 focus:outline-none"
        list={column.id + "list"}
      />
    </>
  );
}
