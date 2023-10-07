"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTableColumnHeader } from "./columns-header"

export type Payment = {
  id: string
  amount: string
  type: "general" | "personal" | "house" | "transport"
  owner: "Ray" | "Micia"
  description: string,
}

export const columns: ColumnDef<Payment>[] = [
    {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-8 w-8 p-0 focus-visible:outline-none focus-visible:ring-none">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment Id
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
        return (
         <DataTableColumnHeader column={column} title="Type" />
        )
      },
    cell: ({ row }) => {
        return <div className="font-medium" {...{
          style: {
            maxWidth: "40px",
          },
        }}>{row.getValue("type")}</div>
    },
  },
  {
    accessorKey: "owner",
    header: ({ column }) => {
        return (
         <DataTableColumnHeader column={column} title="Owner" />
        )
      },
    cell: ({ row }) => {
        return <div className="font-medium"  {...{
          style: {
            maxWidth: "40px",
          },
        }}>{row.getValue("owner")}</div>
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
        return (
            <DataTableColumnHeader column={column} title="Amount" />
        )
      },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const formatted = new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP",
      }).format(amount)
 
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => {
        return (
            <DataTableColumnHeader column={column} title="Description" />
        )
      },
    cell: ({ row }) => {
      return <div className="font-medium" {...{
        style: {
          // maxWidth: "10000px",
        },
      }}>{row.getValue("description")}</div>
    },
  },
]
