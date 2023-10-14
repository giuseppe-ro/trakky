export interface Payment {
  id: string;
  amount: number;
  type: string;
  owner: string;
  description: string;
  date: Date;
}