#!/usr/bin/env node
import { Command } from "commander";
import CommandFactory from './factory/command.factory.js';
import { DependencyContainer } from './config/dependency.container.js';

const main = () => {
  const container = new DependencyContainer();
  const expenseService = container.getExpenseService();
  const program = new Command();

  CommandFactory.setupCommands(program, expenseService);
  program.parse(process.argv);
};

main();
