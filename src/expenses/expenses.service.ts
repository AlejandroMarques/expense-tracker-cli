import Expense from "./expense.interface";
import AddExpenseDto from "./dtos/add-expense.dto";
import JsonCsv from "../adapters/json-csv/json-csv.interface";
import FileSystem from "../adapters/filesystem/filesystem.interface";
import "../env";
import UpdateExpenseDto from "./dtos/update-expense.dto";
import Logger from "../adapters/logger/logger.interface";

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

  add(data: AddExpenseDto) {
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
    const expense = this.read(data.id);
    if (!expense) {
      return;
    }

    const updated = {
      ...expense,
      ...data,
      updatedAt: new Date(),
    };

    this.expenses = this.expenses.map((obj) =>
      obj.id === expense.id ? updated : obj
    );
    this.writeData();
    this.logger.log(`Expense updated successfully (ID: ${data.id})`);
  }

  list() {
    return this.expenses;
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
    if (!id) {
      this.logger.error("No id provided");
      return null;
    }
    if (typeof id !== "number") {
      this.logger.error(`Id "${id}" is not valid, try to pass a number`);
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
    this.fs.write(this.path, csv);
  }
}
