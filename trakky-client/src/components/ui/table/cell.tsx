import { formatStringDate } from '@/lib/text-formatter';
import { Row, Cell, flexRender } from '@tanstack/react-table';
import { Dictionary, GetCategoryIcon } from './icons';

function renderCell<TData>(
  row: Row<TData>,
  cell: Cell<TData, unknown>,
  iconMapping: Dictionary<string> | undefined,
  filtersOnly: boolean
) {
  if (cell.id.includes('edit') && filtersOnly) {
    return null;
  }

  if (cell.id.includes('type')) {
    return (
      <div className="flex flex-row align-middle gap-x-2 justify-start">
        <div>
          {iconMapping &&
            GetCategoryIcon({
              key: row.getValue('type'),
              mapping: iconMapping,
              show_default: true,
            })}
        </div>
        <div className="flex flex-col">
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
          <div className="text-xxs font-thin text-muted-foreground">
            {formatStringDate(row.getValue('date'))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row align-middle gap-1">
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </div>
  );
}

export default renderCell;
