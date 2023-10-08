import { Column } from "@tanstack/react-table"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import React from "react";

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
      <div className={cn("flex justify-center w-full space-x-2", className)} >
        <Button
            tabIndex="-1"
            variant="link"
            className="focus-visible:outline-none w-full rounded-none focus-visible:ring-none"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {title}
          </Button>
      </div>
    )
  }
  