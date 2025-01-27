export default interface Expense {
  id: number;
  description: string;
  amount: number;
  tags: string[];
  date: Date;
  updatedAt: Date;
}
