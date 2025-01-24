import { Command } from 'commander';
import BaseCommand from '../base-command.js';
import ExpenseService from '../../expenses/expenses.service.js';
import UpdateExpenseDto from '../../expenses/dtos/update-expense.dto.js';

export default class UpdateExpenseCommand extends BaseCommand {
  constructor(private readonly expenseService: ExpenseService) {
    super();
  }

  execute(options: UpdateExpenseDto): void {
    const { id, description, amount, tags } = options;
    const expense: UpdateExpenseDto = {
      id: Number(id),
      description: description ?? undefined,
      tags: tags ?? undefined,
      amount: amount ? Number(amount) : undefined,
    };
    this.expenseService.update(expense);
  }

  setup(program: Command): void {
    program
    .command("update")
    .description("Updates a new expense")
    .requiredOption("--id <id>", "Expense to update")
    .option("--description, -d <description>", "Expense description")
    .option("--amount, -a <amount>", "Expense Amount")
    .option("--tags, -t <tags...>", "Tags array", [])
    .action((options) => this.execute(options));
  }
}