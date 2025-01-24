import { Command } from "commander";

export default abstract class BaseCommand {
  abstract execute(options: any): void;
  abstract setup(program: Command): void;
}