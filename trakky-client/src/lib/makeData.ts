import { Payment, Budget, Backup } from '@/models/dtos';

import payments from './mockPayments.json';
import budgets from './mockBudgets.json';

interface ImportedData {
  date: string;
}

const sortByDate = (a: ImportedData, b: ImportedData) => {
  const dateA = new Date(a.date);
  const dateB = new Date(b.date);
  return dateB.getTime() - dateA.getTime(); // Sorts in descending order
};

export function mockPayments() {
  return payments.sort(sortByDate) as unknown as Payment[];
}

export function makeBudgets() {
  return budgets.sort(sortByDate) as unknown as Budget[];
}

export function makeOwners() {
  return [
    { id: 1, name: 'Donald' },
    { id: 2, name: 'Goofy' },
  ];
}

export function makeTypes() {
  return [
    { id: 1, name: 'Food' },
    { id: 2, name: 'General' },
    { id: 3, name: 'Personal' },
    { id: 4, name: 'Travel' },
  ];
}

export function mockBackup() {
  return {
    payments: mockPayments(),
    budgets: makeBudgets(),
    owners: makeOwners(),
    types: makeTypes(),
  } as unknown as Backup;
}
