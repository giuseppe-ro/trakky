interface Balance {
  amount: number;
}

interface OwedBalance extends Balance {
  to: string;
}

export interface DebitorBalance {
  name: string;
  owed: OwedBalance[];
}
