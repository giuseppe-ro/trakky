import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DownloadIcon } from "@radix-ui/react-icons";
import { Payment } from "@/infrastructure/payment.tsx";
import { Table } from "@tanstack/react-table";
import { Link } from "react-router-dom";

export function ExportDropdownMenu({ table }: { table: Table<any> }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <DownloadIcon className="rounded w-8 h-8 p-1.5 cursor-pointer hover:text-green-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring " />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Export</DropdownMenuLabel>
        <DropdownMenuItem>
          <Link
            className="w-full h-full"
            to={`data:text/json;charset=utf-8,${encodeURIComponent(
              JSON.stringify(
                table
                  .getPreFilteredRowModel()
                  .rows.map((row: any) => row.original as Payment),
              ),
            )}`}
            download="data.json"
          >
            {`All`}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={
            table.getPreFilteredRowModel().rows.length ==
            table.getFilteredRowModel().rows.length
          }
        >
          <Link
            className="w-full h-full"
            to={`data:text/json;charset=utf-8,${encodeURIComponent(
              JSON.stringify(
                table
                  .getFilteredRowModel()
                  .rows.map((row: any) => row.original as Payment),
              ),
            )}`}
            download="data.json"
          >
            {`Filtered`}
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
