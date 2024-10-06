import db from './db';

async function localDataIsValid() {
  try {
    const hasPayments = (await db.payments.count()) > 0;
    const hasBudgets = (await db.budgets.count()) > 0;
    const hasOwners = (await db.owners.count()) > 0;
    const hasCategories = (await db.categories.count()) > 0;

    return hasPayments && hasBudgets && hasOwners && hasCategories;
  } catch {
    return false;
  }
}

export async function resetLocalDb() {
  await db.delete();
  await db.open();

  return true;
}

export async function dexieAction<T>(action: Promise<T>) {
  if (!(await localDataIsValid())) {
    await resetLocalDb();
  }

  const response = await action;

  return response;
}
