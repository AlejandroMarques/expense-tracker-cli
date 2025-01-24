import Logger from "./logger.interface.js";

export default class ConsoleLogger implements Logger {
  log(...args: any[]): void {
    console.log(...args);
  }
  warn(...args: any[]): void {
    console.warn(...args);
  }
  error(...args: any[]): void {
    console.error(...args);
  }
  table(data: any[], fields?: string[]): void {
    console.table(data, fields)
  }
}
