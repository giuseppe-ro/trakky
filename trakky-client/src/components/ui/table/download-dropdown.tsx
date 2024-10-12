/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Row, Table } from '@tanstack/react-table';
import Label from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { downloadFile } from '@/lib/utils';
import { Payment } from '@/models/dtos';
import { ArrowDownToLine } from 'lucide-react';

function RadioGroupFormat({ id, label }: { id: string; label: string }) {
  return (
    <div className="flex flex-row items-center space-x-2 ">
      <RadioGroupItem value={id} id={id} />
      <Label
        htmlFor="r1"
        className="font-thin md:font-light text-xs md:text-sm "
      >
        {label}
      </Label>
    </div>
  );
}

function DownloadButton({
  onClick,
  disabled,
  text,
}: {
  onClick: () => void;
  disabled: boolean;
  text: string;
}) {
  return (
    <button
      className="w-full h-full border-none font-thin md:font-light text-xs md:text-sm"
      onClick={onClick}
      value="download"
      disabled={disabled}
      type="submit"
    >
      {text}
    </button>
  );
}

export function ExportDropdownMenu<TData>({
  table,
  name,
}: {
  table: Table<TData>;
  name: string;
}) {
  const noData = table.getPageCount() === 0;
  const [format, setFormat] = useState<string>('json');

  function convertToCSV(arr: any) {
    const array = [Object.keys(arr[0])].concat(arr);

    return array
      .map((it) => {
        return Object.values(it).toString();
      })
      .join('\n');
  }

  const download = (rows: Row<TData>[]) => {
    const texts =
      format === 'csv'
        ? convertToCSV(rows.map((row) => row.original as Payment))
        : JSON.stringify(rows.map((row) => row.original as Payment));

    downloadFile(texts, format, name);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          disabled={noData}
          tabIndex={-1}
          className="rounded text-green-500 px-4 sm:px-0 h-12 sm:h-8 hover:text-green-500/50 disabled:text-green-500/50  focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring "
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <ArrowDownToLine />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-36">
              <DropdownMenuLabel>
                <RadioGroup onValueChange={setFormat} defaultValue={format}>
                  <RadioGroupFormat id="json" label="JSON" />
                  <RadioGroupFormat id="csv" label="CSV" />
                </RadioGroup>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <DownloadButton
                  text="Export All"
                  onClick={() => download(table.getFilteredRowModel().rows)}
                  disabled={table.getRowModel().rows.length === 0}
                />
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={
                  table.getPreFilteredRowModel().rows.length ===
                  table.getFilteredRowModel().rows.length
                }
              >
                <DownloadButton
                  text="Export Filtered"
                  onClick={() => download(table.getFilteredRowModel().rows)}
                  disabled={
                    table.getPreFilteredRowModel().rows.length ===
                    table.getFilteredRowModel().rows.length
                  }
                />
              </DropdownMenuItem>
              <DropdownMenuItem disabled={!table.getIsSomeRowsSelected()}>
                <DownloadButton
                  text="Export Selected"
                  onClick={() => download(table.getSelectedRowModel().rows)}
                  disabled={!table.getIsSomeRowsSelected()}
                />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TooltipTrigger>
        <TooltipContent className="bg-secondary text-primary">
          Export
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default ExportDropdownMenu;
