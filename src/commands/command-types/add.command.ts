import { Command } from 'commander';
import BaseCommand from '../base-command.js';
import ExpenseService from '../../expenses/expenses.service.js';
import AddExpenseDto from '../../expenses/dtos/add-expense.dto.js';

export default class AddExpenseCommand extends BaseCommand {
  constructor(private readonly expenseService: ExpenseService) {
    super();
  }

  execute(options: AddExpenseDto): void {
    const { description, amount, tags } = options;
    const expense: AddExpenseDto = {
      description,
      tags,
      amount: Number(amount),
    };
    this.expenseService.add(expense);
  }

  setup(program: Command): void {
    program
    .command("add")
    .description("Adds a new expense")
    .requiredOption("--description, -d <description>", "Expense description")
    .requiredOption("--amount, -a <amount>", "Expense Amount")
    .option("--tags, -t <tags...>", "Tags array", [])
    .action((options) => this.execute(options));
  }
}