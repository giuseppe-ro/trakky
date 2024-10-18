import {
  mockBudgets,
  mockCategories,
  mockOwners,
  mockPayments,
} from '@/lib/makeData';
import {
  Budget,
  Category,
  Owner,
  Payment,
  SharedExpenses,
} from '@/models/dtos';
import Dexie, { type EntityTable } from 'dexie';

const db = new Dexie('trakky-demo') as Dexie & {
  payments: EntityTable<Payment, 'id'>;
  sharedExpenses: EntityTable<SharedExpenses, 'Id'>;
  owners: EntityTable<Owner, 'id'>;
  budgets: EntityTable<Budget, 'id'>;
  categories: EntityTable<Category, 'id'>;
};

db.version(5).stores({
  payments: '++id, amount, type, owner, description, date',
  sharedExpenses: '++id, paymentId, ownerId, complete',
  owners: '++id, name',
  budgets: '++id, date, budget, maxBudget',
  categories: '++id, name, iconId',
});

db.on('populate', async () => {
  db.payments.bulkAdd(mockPayments());
  db.budgets.bulkAdd(mockBudgets());
  db.owners.bulkAdd(mockOwners());
  db.categories.bulkAdd(mockCategories());
});

export const resetLocalDb = async () => {
  try {
    await db.delete();
  } finally {
    await db.open();
  }
};

export default db;
