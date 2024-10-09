import { Payment, Budget } from '@/models/dtos';

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

export function mockBudgets() {
  return budgets.sort(sortByDate) as unknown as Budget[];
}

export function mockOwners() {
  return [
    { id: 1, name: 'Donald' },
    { id: 2, name: 'Goofy' },
    { id: 3, name: 'Mickey' },
  ];
}

export function mockTypes() {
  return [
    { id: 1, name: 'Food' },
    { id: 2, name: 'General' },
    { id: 3, name: 'Personal' },
    { id: 4, name: 'Travel' },
    { id: 5, name: 'House' },
  ];
}

export function mockCategories() {
  return [
    { id: 1, name: 'Food', iconId: 1 },
    { id: 2, name: 'Travel', iconId: 8 },
    { id: 3, name: 'General', iconId: 3 },
    { id: 4, name: 'Personal', iconId: 5 },
    { id: 5, name: 'House', iconId: 4 },
  ];
}

export function mockIcons() {
  return [
    { id: 1, name: 'Utensils' },
    { id: 3, name: 'HandCoins' },
    { id: 4, name: 'HomeIcon' },
    { id: 5, name: 'Gift' },
    { id: 6, name: 'Fuel' },
    { id: 7, name: 'BabyIcon' },
    { id: 8, name: 'Plane' },
    { id: 9, name: 'HeartIcon' },
  ];
}
