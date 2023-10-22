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
import { Row, Table } from "@tanstack/react-table";
import { Label } from "@/components/ui/label.tsx";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group.tsx";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip.tsx";

export function ExportDropdownMenu({ table }: { table: Table<any> }) {
  const [format, setFormat] = useState<string>("json");

  function convertToCSV(arr: any) {
      const array = [Object.keys(arr[0])].concat(arr);

      return array
        .map((it) => {
          return Object.values(it).toString();
        })
        .join("\n");
  }

  const download = (rows: Row<any>[]) => {

    const texts = format === "csv"
      ? convertToCSV(rows.map((row: any) => row.original as Payment))
      : JSON.stringify(rows.map((row: any) => row.original as Payment));

    const file = new Blob([texts], {type: `text/${format}`});
    const element = document.createElement("a");
    element.href = URL.createObjectURL(file);
    element.download = "Payments Export " + new Date().toLocaleString("en-GB", {
      month: "short",
      year: "numeric",
    }) + `.${format}`;
    document.body.appendChild(element);
    element.click();
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger tabIndex={-1} className="rounded w-8 hover:text-green-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <DownloadIcon className="rounded w-8 h-8 p-1.5 cursor-pointer hover:text-green-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring " />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-36">
              <DropdownMenuLabel>
                <RadioGroup onValueChange={setFormat}
                            defaultValue={format}>
                  <RadioGroupFormat id={"json"} label={"JSON"}></RadioGroupFormat>
                  <RadioGroupFormat id={"csv"} label={"CSV"}></RadioGroupFormat>
                </RadioGroup>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <DownloadButton
                  text={"Export All"}
                  onClick={() => download(table.getFilteredRowModel().rows)}
                  disabled={false}
                />
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={
                  table.getPreFilteredRowModel().rows.length ==
                  table.getFilteredRowModel().rows.length
                }
              >
                <DownloadButton
                  text={"Export Filtered"}
                  onClick={() => download(table.getFilteredRowModel().rows)}
                  disabled={
                    table.getPreFilteredRowModel().rows.length ==
                    table.getFilteredRowModel().rows.length
                  }
                />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TooltipTrigger>
        <TooltipContent className="bg-slate-800 text-white">
          <p>Export</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>

  );
}

function RadioGroupFormat({ id, label }: { id: string, label: string }) {
  return (
    <div className="flex flex-row items-center space-x-2 ">
      <RadioGroupItem value={id} id={id} />
      <Label htmlFor="r1" className="font-thin md:font-light text-xs md:text-sm ">{label}</Label>
    </div>
  )
}

function DownloadButton({ onClick, disabled, text }: { onClick: () => void, disabled: boolean, text: string }) {
  return (
    <button
      className="w-full h-full border-none font-thin md:font-light text-xs md:text-sm"
      onClick={onClick} value="download"
      disabled={disabled}
    >{text}</button>
  )
}