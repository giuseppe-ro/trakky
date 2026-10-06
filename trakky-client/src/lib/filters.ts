/* eslint-disable @typescript-eslint/no-explicit-any */
import { FilterFn, SortingFn, sortingFns } from '@tanstack/react-table';
import {
  compareItems,
  RankingInfo,
  rankItem,
} from '@tanstack/match-sorter-utils';

export const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);

  addMeta({
    itemRank,
  });

  return itemRank.passed;
};

export const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
  let dir = 0;

  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      rowA.columnFiltersMeta[columnId]?.itemRank!,
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      rowB.columnFiltersMeta[columnId]?.itemRank!
    );
  }

  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
};

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}
