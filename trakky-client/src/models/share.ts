import { DebitorBalance } from './debitor-balance';

export interface Share {
  totalAmount: number;
  shareAmount: number;
  debitorBalances: DebitorBalance[];
}
