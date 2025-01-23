export default interface AddExpenseDto {
  description: string;
  amount: number;
  tags?: string[];
}
