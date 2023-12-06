import { ColumnDef } from "@tanstack/react-table";
import { Payment } from "@/infrastructure/payment.tsx";
import { formatDate, formatCurrency } from "@/lib/formatter.ts";
import { fuzzySort } from "@/lib/filters.ts";

export const ColumnDefinition: ColumnDef<Payment, number | string>[] = [
  {
    accessorKey: "date",
    header: "Date",
    enableColumnFilter: true,
    enableGlobalFilter: false,
    cell: ({ row }) => {
      const formatted = formatDate(row.getValue("date"));

      return <div className="text-right font-sm">{formatted}</div>;
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    filterFn: "fuzzy",
    sortingFn: fuzzySort,
    cell: ({ row }) => {
      return <div className="font-sm">{row.getValue("type")}</div>;
    },
  },
  {
    accessorKey: "owner",
    header: "Owner",
    filterFn: "fuzzy",
    sortingFn: fuzzySort,
    cell: ({ row }) => {
      return <div className="font-sm">{row.getValue("owner")}</div>;
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = formatCurrency(amount);

      return <div className="text-right font-sm">{formatted}</div>;
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      return <div className="font-sm">{row.getValue("description")}</div>;
    },
  },
];

export const colSize = (id: string): number | string => {
  switch (id) {
    case "description":
      return "auto";
    case "date":
      return 80;
    case "type" || "owner":
      return 110;
    case "amount":
      return 115;
    default:
      return 100;
  }
};
