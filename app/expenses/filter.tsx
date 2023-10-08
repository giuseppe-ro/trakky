import { Column, Table } from "@tanstack/table-core"
import React from "react"

export function DebouncedInput({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
  }: {
    value: string | number | Date
    onChange: (value: string | number | Date) => void
    debounce?: number
  } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
    const [value, setValue] = React.useState(initialValue)
  
    React.useEffect(() => {
      setValue(initialValue)
    }, [initialValue])
  
    React.useEffect(() => {
      const timeout = setTimeout(() => {
        onChange(value)
      }, debounce)
  
      return () => clearTimeout(timeout)
    }, [value])
  
    return (
        <FilterInput
            value={value}
            onChange={onChange}
            {...props}
        ></FilterInput>
    )
  }

function FilterInput({
        value,
        onChange,
        disabled=false,
        ...props
    }: {
    value?: undefined | string | number | (string & readonly string[]) | (number & readonly string[]) | (Date & string) | (Date & number) | (Date & readonly string[])
    onChange?: (value: string | number) => void
    disabled?: boolean
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
    return disabled === false && onChange !== undefined ? (
        <input className="outline-none" {...props} value={value} onChange={e => onChange(e.target.value)}
               {...{
                   style: {
                       minWidth: "100%",
                       maxWidth: "100%",
                   },
               }}/>
    ) :
        <input className="outline-none" {...props} disabled></input>
}

export function Filter({
      column,
      table,
    }: {
      column: Column<any, unknown>
      table: Table<any>
    }) {
      const firstValue = table
        .getPreFilteredRowModel()
        .flatRows[0]?.getValue(column.id)
    
      const columnFilterValue = column.getFilterValue()
    
      const sortedUniqueValues = React.useMemo(
        () =>
          typeof firstValue === 'number'
            ? []
            : Array.from(column.getFacetedUniqueValues().keys()).sort(),
              [column, firstValue]
      )

    function isValidDate(date: unknown) {
        return Object.prototype.toString.call(date) === "[object Date]";
    }
    
      return typeof firstValue === 'number' ? (
            <DebouncedInput
              type="number"
              value={(columnFilterValue as [number, number])?.[1] ?? ''}
              onChange={value =>
                column.setFilterValue((old: [number, number]) => [value, old?.[1]])
              }
              placeholder={""}
              className="border shadow rounded px-2 mx-2 mb-2"
            />
      ) : isValidDate(firstValue) ? (
        <>
            <FilterInput disabled={true}/>
        </>
      ) : (
          <>
              <datalist id={column.id + 'list'}>
                  {sortedUniqueValues.slice(0, 5000).map((value: any) => (
                      <option value={value} key={value} />
                  ))}
              </datalist>
              <DebouncedInput
                  type="text"
                  value={(columnFilterValue ?? '') as string}
                  onChange={value => column.setFilterValue(value)}
                  placeholder=""
                  className={"px-2 focus-visible:outline-none focus-visible:ring-none"}
                  list={column.id + 'list'}
              />
          </>
      )
    }