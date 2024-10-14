interface Balance {
  amount: number;
}

export interface OwedBalance extends Balance {
  id: number;
  to: string;
}

export interface DebitorBalance {
  name: string;
  owed: OwedBalance[];
}
