import { Command } from "commander";
import ExpenseService from "../../expenses/expenses.service.js";
import BaseCommand from "../base-command.js";

export default class SummaryExpensesCommand extends BaseCommand {
  constructor(private readonly expenseService: ExpenseService) {
    super();
  }

  execute(options:any): void {
    const { month } = options;
    this.expenseService.summary(Number(month));
  }

  setup(program: Command): void {
    program
    .command("summary")
    .description("Get summary of all expenses or just one month")
    .option("--month, -m <month>", "Summary month")
    .action((options) => this.execute(options));
  }
}
