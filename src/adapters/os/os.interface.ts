export default interface Os {
  homedir(): string;
  platform(): string;
}