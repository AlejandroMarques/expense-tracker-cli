import { Command } from "commander";
import ExpenseService from "../../expenses/expenses.service.js";
import BaseCommand from "../base-command.js";

export default class ExportExpensesCommand extends BaseCommand {
  constructor(private readonly expenseService: ExpenseService) {
    super();
  }

  execute(): void {
    this.expenseService.export();
  }

  setup(program: Command): void {
    program
    .command("export")
    .description("Exports all expenses to CSV file")
    .action(() => this.execute());
  }
}