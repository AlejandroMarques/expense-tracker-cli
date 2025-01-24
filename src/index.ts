#!/usr/bin/env node
//Modules
import { Command } from "commander";

//Services
import ExpenseService from "./expenses/expenses.service.js";

//Adapters
import FileSystemVanilla from "./adapters/filesystem/filesystem-vanilla.adapter.js";
import JsonToCsvVanilla from "./adapters/json-csv/json-csv-vanilla.adapter.js";
import ConsoleLogger from "./adapters/logger/console-logger.adapter.js";

//DTOs
import AddExpenseDto from "./expenses/dtos/add-expense.dto.js";
import UpdateExpenseDto from "./expenses/dtos/update-expense.dto.js";
import OsVanillaAdapter from "./adapters/os/os-vanilla.adapter.js";

const main = () => {
  const jsonToCsvAdapter = new JsonToCsvVanilla();
  const fsAdapter = new FileSystemVanilla();
  const consoleLogger = new ConsoleLogger();
  const osAdapter = new OsVanillaAdapter();

  const expenseService = new ExpenseService(
    jsonToCsvAdapter,
    fsAdapter,
    consoleLogger,
    osAdapter
  );

  const program = new Command();

  program
    .name("expense-tracker")
    .description("CLI para gestionar gastos")
    .version("1.0.0");

  program
    .command("add")
    .description("Adds a new expense")
    .requiredOption("--description, -d <description>", "Expense description")
    .requiredOption("--amount, -a <amount>", "Expense Amount")
    .option("--tags, -t <tags...>", "Tags array", []) // Opción adicional para tags
    .action((options) => {
      const { description, amount, tags } = options;
      const expense: AddExpenseDto = {
        description,
        tags,
        amount: Number(amount),
      };
      expenseService.add(expense);
    });

  program
    .command("update")
    .description("Updates a new expense")
    .requiredOption("--id <id>", "Expense to update")
    .option("--description, -d <description>", "Expense description")
    .option("--amount, -a <amount>", "Expense Amount")
    .option("--tags, -t <tags...>", "Tags array", []) // Opción adicional para tags
    .action((options) => {
      const { id, description, amount, tags } = options;
      const expense: UpdateExpenseDto = {
        id: Number(id),
        description: description ?? undefined,
        tags: tags ?? undefined,
        amount: amount ? Number(amount) : undefined,
      };
      expenseService.update(expense);
    });

  program
    .command("list")
    .description("Get all expenses")
    .action(() => {
      expenseService.list();
    });

  program
    .command("summary")
    .description("Obtener un resumen de los gastos para un mes específico")
    .option("--month, -m <month>", "Summary month")
    .action((options) => {
      const { month } = options;
      expenseService.summary(Number(month));
    });

  program
    .command("delete")
    .description("Deletes a expense")
    .requiredOption("--id <id>", "Expense to delete")
    .action((options) => {
      const { id } = options;
      expenseService.delete(Number(id));
    });

    program
    .command("export")
    .description("Exports all expenses to CSV file")
    .action(() => {
      expenseService.export();
    });

  program.parse(process.argv);

  const options = program.opts();
};

main();
