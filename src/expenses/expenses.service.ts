import Expense from "./expense.interface.js";
import AddExpenseDto from "./dtos/add-expense.dto.js";
import JsonCsv from "../adapters/json-csv/json-csv.interface.js";
import FileSystem from "../adapters/filesystem/filesystem.interface.js";
import "../config/env.js";
import UpdateExpenseDto from "./dtos/update-expense.dto.js";
import Logger from "../adapters/logger/logger.interface.js";
import Os from "../adapters/os/os.interface.js";
import Path from "../adapters/path/path.interface.js";

export default class ExpenseService {
  private readonly filePath: string = process.env.EXPENSES_FILE_PATH!;

  private expenses: Expense[];

  constructor(
    private readonly jsonCsvRepo: JsonCsv,
    private readonly fs: FileSystem,
    private readonly logger: Logger,
    private readonly os: Os,
    private readonly path: Path
  ) {
    this.expenses = this.readExpensesFile().sort(
      (a: Expense, b: Expense) => a.id - b.id
    );
  }

  private readExpensesFile(): Expense[] {
    try {
      if (!this.filePath) {
        this.logger.error("No file path provided");
        throw new Error("No file path provided");
      }
      const jsonData = this.fs.read(this.filePath);
      return JSON.parse(jsonData);
    } catch (error) {
      this.logger.error("Error reading JSON:", error);
      throw error;
    }
  }

  private generateId(): number {
    const lastId =
      this.expenses.length <= 0
        ? 0
        : this.expenses[this.expenses.length - 1].id;
    return lastId + 1;
  }

  private writeData() {
    this.fs.write(this.filePath, JSON.stringify(this.expenses, null, "\t"));
  }

  private getDownloadFolderPath(): string {
    const homeDir = this.os.homedir();

    switch (this.os.platform()) {
      case "win32":
        return this.path.join(homeDir, "Downloads");
      case "darwin":
        return this.path.join(homeDir, "Downloads");
      case "linux":
        return this.path.join(homeDir, "Descargas"); // Puede variar según la configuración del idioma
      default:
        throw new Error("Unsupported OS");
    }
  }

  private filterByTags(tags: string[], expenses: Expense[]): Expense[] {
    const data =
      tags && tags.length <= 0
        ? expenses
        : expenses.filter((expense) =>
            tags?.some((tag) => expense.tags.includes(tag))
          );
    return data;
  }

  add(data: AddExpenseDto) {
    if (isNaN(data.amount)) {
      this.logger.error("Amount must be a number");
      return;
    }
    if (data.amount && data.amount < 0) {
      this.logger.error("Amount cannot be negative");
      return;
    }
    const expense: Expense = {
      id: this.generateId(),
      ...data,
      tags: data.tags ?? [],
      date: new Date(),
      updatedAt: new Date(),
    };
    this.expenses.push(expense);
    this.writeData();
    this.logger.log(`Expense added successfully (ID: ${expense.id})`);
  }

  update(data: UpdateExpenseDto) {
    if (data.amount && isNaN(data.amount)) {
      this.logger.error("Amount must be a number");
      return;
    }
    if (data.amount && data.amount < 0) {
      this.logger.error("Amount cannot be negative");
      return;
    }

    const expense = this.read(data.id);
    if (!expense) {
      return;
    }

    const updated = {
      id: data.id,
      description: data.description ?? expense.description,
      amount: data.amount ?? expense.amount,
      tags: data.tags ?? expense.tags,
      date: expense.date,
      updatedAt: new Date(),
    };

    this.expenses = this.expenses.map((obj) =>
      obj.id === expense.id ? updated : obj
    );
    this.writeData();
    this.logger.log(`Expense updated successfully (ID: ${data.id})`);
  }

  list(tags: string[] = []) {
    const data = this.filterByTags(tags, this.expenses);

    if (data.length <= 0) {
      this.logger.log("No expenses found");
      return
    }

    this.logger.table(
      data.map((expense) => {
        return {
          ...expense,
          date: new Date(expense.date).toLocaleDateString(),
          updatedAt: new Date(expense.updatedAt).toLocaleString(),
        };
      })
    );
  }

  summary(month?: number) {
    const expenses = month
      ? this.expenses.filter((obj) => {
          const date = new Date(obj.date);
          return date.getMonth() + 1 === month;
        })
      : this.expenses;

    const value = expenses.reduce(
      (accumulator, expense) => accumulator + expense.amount,
      0
    );

    this.logger.log(
      `Total expenses${
        month
          ? ` for ${new Date(`1970-${month}-01`).toLocaleString("en-EN", {
              month: "long",
            })}`
          : ""
      }: ${value}€`
    );
  }

  delete(id: number) {
    const expense = this.read(id);
    if (!expense) return;
    this.expenses = this.expenses.filter((expense) => expense.id !== id);
    this.writeData();
    this.logger.log(`Expense ${id} deleted successfully`);
  }

  read(id: number) {
    if (typeof id !== "number" || isNaN(id)) {
      this.logger.error(`Id is not valid, you must pass a number`);
      return null;
    }
    if (!id) {
      this.logger.error("No id provided");
      return null;
    }
    const expense = this.expenses.find((expense) => expense.id === id);
    if (!expense) {
      this.logger.error(`No expense with id "${id}" found`);
      return null;
    }
    return expense;
  }

  export() {
    const csv = this.jsonCsvRepo.convertJsonToCsv(this.expenses);
    const pathToCsv = this.path.resolve(
      this.getDownloadFolderPath(),
      "expenses.csv"
    );
    this.fs.write(pathToCsv, csv);
    this.logger.log("CSV file saved in downloads folder");
  }
}
