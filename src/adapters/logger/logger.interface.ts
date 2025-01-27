export default interface Logger {
  log(...args: any[]): void;
  warn(...args: any[]): void;
  error(...args: any[]):void;
  table(data: any[], fields?: string[]):void;
}