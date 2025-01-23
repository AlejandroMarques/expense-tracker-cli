import Logger from "./logger.interface";

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
}
