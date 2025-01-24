import Expense from "./expense.interface.js";
import AddExpenseDto from "./dtos/add-expense.dto.js";
import JsonCsv from "../adapters/json-csv/json-csv.interface.js";
import FileSystem from "../adapters/filesystem/filesystem.interface.js";
import "../env.js";
import UpdateExpenseDto from "./dtos/update-expense.dto.js";
import Logger from "../adapters/logger/logger.interface.js";
import * as os from "os";
import * as path from "path";

export default class ExpenseService {
  private readonly path: string = process.env.EXPENSES_FILE_PATH!;

  private expenses: Expense[];

  constructor(
    private readonly jsonCsvRepo: JsonCsv,
    private readonly fs: FileSystem,
    private readonly logger: Logger
  ) {
    this.expenses = this.readExpensesFile().sort(
      (a: Expense, b: Expense) => a.id - b.id
    );
  }

  private readExpensesFile(): Expense[] {
    try {
      const jsonData = this.fs.read(this.path);
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
    this.fs.write(this.path, JSON.stringify(this.expenses, null, "\t"));
  }

  private getDownloadFolderPath(): string {
    const homeDir = os.homedir();

    switch (os.platform()) {
      case "win32":
        return path.join(homeDir, "Downloads");
      case "darwin":
        return path.join(homeDir, "Downloads");
      case "linux":
        return path.join(homeDir, "Descargas"); // Puede variar según la configuración del idioma
      default:
        throw new Error("Unsupported OS");
    }
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

  list() {
    const data = this.expenses.map((expense) => {
      return {
        ...expense,
        date: new Date(expense.date).toLocaleString(),
        updatedAt: new Date(expense.updatedAt).toLocaleString(),
      };
    });
    this.logger.table(data);
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
    const pathToCsv = path.resolve(
      this.getDownloadFolderPath(),
      "expenses.csv"
    );
    this.fs.write(pathToCsv, csv);
    this.logger.log("CSV file saved in downloads folder");
  }
}
