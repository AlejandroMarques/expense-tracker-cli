export default interface UpdateExpenseDto {
  id: number;
  description?: string;
  amount?: number;
  tags?: string[];
}