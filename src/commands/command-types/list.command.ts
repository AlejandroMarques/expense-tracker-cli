import { Command } from "commander";
import ExpenseService from "../../expenses/expenses.service.js";
import BaseCommand from "../base-command.js";

export default class ListExpensesCommand extends BaseCommand {
  constructor(private readonly expenseService: ExpenseService) {
    super();
  }

  execute(options: any): void {
    const { tags } = options;
    this.expenseService.list(tags);
  }

  setup(program: Command): void {
    program
    .command("list")
    .description("Get all expenses")
    .option("--tags, -t <tags...>", "Filter by tags", [])
    .action((options) => this.execute(options));
  }
}