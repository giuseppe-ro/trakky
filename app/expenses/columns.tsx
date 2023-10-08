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
import {formatCurrency, formatDate} from "../utils/stringFormatter"

export type Payment = {
  id: string
  amount: string
  type: "general" | "personal" | "house" | "transport"
  owner: string
  description: string,
  date: Date
}

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "type",
    header: ({ column }) => {
        return (
         <DataTableColumnHeader column={column} title="Type" />
        )
      },
    cell: ({ row }) => {
        return <div className="font-medium">{row.getValue("type")}</div>
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
        return <div className="font-medium">{row.getValue("owner")}</div>
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
      const formatted = formatCurrency(amount)
 
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
      return <div className="font-medium">{row.getValue("description")}</div>
    },
  },
]
