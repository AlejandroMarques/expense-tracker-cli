import { Command } from "commander";
import ExpenseService from "../../expenses/expenses.service.js";
import BaseCommand from "../base-command.js";

export default class ListExpensesCommand extends BaseCommand {
  constructor(private readonly expenseService: ExpenseService) {
    super();
  }

  execute(): void {
    this.expenseService.list();
  }

  setup(program: Command): void {
    program
    .command("list")
    .description("Get all expenses")
    .action(() => this.execute());
  }
}