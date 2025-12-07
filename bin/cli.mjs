#!/usr/bin/env node
import { Command } from "commander";
import { init } from "./init/init.mjs";

const program = new Command();

program
  .name("kcsommers-web-tooling")
  .description("M Kacy Sommers Web Tooling CLI")
  .version("1.0.0");

program
  .command("init")
  .description(
    "Initializes ESLint, Prettier, and TypeScript config files in your project, adds linting and formatting scripts to package.json and installs required dependencies.",
  )
  .option("-f, --force", "Overwrite existing files", false)
  .option("-n, --noInstall", "Skip installing dependencies", false)
  .action((options) => {
    init(options);
  });

program.parse(process.argv);
