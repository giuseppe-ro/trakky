import { DebitorBalance } from './debitor-balance';

export interface Share {
  amount: number;
  debitorBalances: DebitorBalance[];
}
