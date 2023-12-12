import { ColumnDef } from "@tanstack/react-table";
import { Payment } from "@/infrastructure/payment.tsx";
import { formatCurrency, formatDate } from "@/lib/formatter.ts";
import { fuzzySort } from "@/lib/filters.ts";
import { EditCell } from "@/app/expenses/components/edit-cell.tsx";
import { PaymentForm } from "@/app/expenses/components/payment-form.tsx";

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
    header: "User",
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
  {
    id: 'edit',
    header: () => null,
    cell: ({ row }) => {
      return (
        <td>
          <EditCell id={(row.original as Payment).id}>
            <PaymentForm
              editValues={row.original as Payment}
              refresh={() => void 0}
              title={"Edit Transaction"}
            ></PaymentForm>
          </EditCell>
        </td>
      )
    },
  },
];

export const colSize = (id: string): number | string => {
  switch (id) {
    case "description":
      return "auto";
    case "edit":
      return 20;
    case "date":
      return 90;
    case "type" || "owner":
      return 110;
    case "amount":
      return 115;
    default:
      return 100;
  }
};
