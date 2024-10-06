import axios from 'axios';
import { Backup } from '@/models/dtos';
import {
  mockPayments,
  mockBudgets,
  mockOwners,
  mockTypes,
} from '@/lib/makeData';

axios.defaults.headers.post['Content-Type'] = 'application/json';

async function GetLocalBackup() {
  const backup = {
    payments: mockPayments(),
    budgets: mockBudgets(),
    owners: mockOwners(),
    types: mockTypes(),
  } as unknown as Backup;

  return { data: backup, error: null };
}

export default GetLocalBackup;
