import { Column } from "@tanstack/react-table"
import { cn } from "@/lib/utils"

interface DataTableColumnHeaderProps<TData, TValue>
    extends React.HTMLAttributes<HTMLDivElement> {
    column: Column<TData, TValue>
    title: string
}
  
  export function DataTableColumnHeader<TData, TValue>({
    column,
    title,
    className,
  }: DataTableColumnHeaderProps<TData, TValue>) {
    if (!column.getCanSort()) {
      return <div className={cn(className)}>{title}</div>
    }
  
    return (
      <div className={cn("flex justify-center w-full space-x-2", className)}>
        <button
            tabindex="-1"
            className="h-8 w-8 p-0 focus-visible:outline-none focus-visible:ring-none"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {title}
          </button>
      </div>
    )
  }
  