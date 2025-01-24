import { Command } from 'commander';
import BaseCommand from '../base-command.js';
import ExpenseService from '../../expenses/expenses.service.js';
import UpdateExpenseDto from '../../expenses/dtos/update-expense.dto.js';

export default class DeleteExpenseCommand extends BaseCommand {
  constructor(private readonly expenseService: ExpenseService) {
    super();
  }

  execute(options: UpdateExpenseDto): void {
    const { id } = options;
    this.expenseService.delete(Number(id));
  }

  setup(program: Command): void {
    program
    .command("delete")
    .description("Deletes a expense")
    .requiredOption("--id <id>", "Expense to delete")
    .action((options) => this.execute(options));
  }
}
