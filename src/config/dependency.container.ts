import ExpenseService from '../expenses/expenses.service.js';
import FileSystemVanilla from '../adapters/filesystem/filesystem-vanilla.adapter.js';
import JsonToCsvVanilla from '../adapters/json-csv/json-csv-vanilla.adapter.js';
import ConsoleLogger from '../adapters/logger/console-logger.adapter.js';
import PathVanillaAdapter from '../adapters/path/path-vanilla.adapter.js';
import OsVanillaAdapter from '../adapters/os/os-vanilla.adapter.js';

export class DependencyContainer {
  getExpenseService(): ExpenseService {
    return new ExpenseService(
      new JsonToCsvVanilla(),
      new FileSystemVanilla(),
      new ConsoleLogger(),
      new OsVanillaAdapter(),
      new PathVanillaAdapter()
    );
  }
}