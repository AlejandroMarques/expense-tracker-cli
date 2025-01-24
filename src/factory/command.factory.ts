import { Command } from 'commander';

import ExpenseService from '../expenses/expenses.service.js';

import AddExpenseCommand from '../commands/command-types/add.command.js';

import UpdateExpenseCommand from '../commands/command-types/update.command.js';
import DeleteExpenseCommand from '../commands/command-types/delete.command.js';
import ExportExpensesCommand from '../commands/command-types/export.command.js';
import ListExpensesCommand from '../commands/command-types/list.command.js';
import SummaryExpensesCommand from '../commands/command-types/summary.command.js';

export default class CommandFactory {
  static setupCommands(program: Command, expenseService: ExpenseService): void {
    program
      .name("expense-tracker")
      .description("CLI to track your expenses")
      .version("1.0.0");

    const addCommand = new AddExpenseCommand(expenseService);
    addCommand.setup(program);

    const updateCommand = new UpdateExpenseCommand(expenseService);
    updateCommand.setup(program)

    const deleteCommand = new DeleteExpenseCommand(expenseService);
    deleteCommand.setup(program)

    const listCommand = new ListExpensesCommand(expenseService);
    listCommand.setup(program)

    const exportCommand = new ExportExpensesCommand(expenseService);
    exportCommand.setup(program)

    const summaryCommand = new SummaryExpensesCommand(expenseService);
    summaryCommand.setup(program)
  }
}