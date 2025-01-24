export default interface Path {
  resolve(...pathSegments: string[]): string;
  join(...pathSegments: string[]): string;
}