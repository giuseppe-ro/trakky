import { Payment } from "@/infrastructure/payment.tsx";
import { Budget } from "@/infrastructure/budget.tsx";
import payments from "./mockPayments.json";
import budgets from "./mockBudgets.json";
import { Backup } from "@/infrastructure/backup.tsx";

export function mockBackup() {
  return [{
    payments: mockPayments(),
    budgets: makeBudgets(),
    owners: makeOwners(),
    types: makeTypes(),
  } ]as unknown as Backup[];
}

export function mockPayments() {
  return payments as Payment[];
}

export function makeBudgets() {
  return budgets as unknown as Budget[];
}

export function makeOwners() {
  return [
    { id: 1, name: "Donald" },
    { id: 2, name: "Goofy" },
  ];
}

export function makeTypes() {
  return [
    { id: 1, name: "Food" },
    { id: 2, name: "General" },
    { id: 3, name: "Personal" },
    { id: 4, name: "Travel" },
  ];
}
