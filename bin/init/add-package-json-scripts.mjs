/* eslint-disable no-console */
import fs from "fs";
import path from "path";
import chalk from "chalk";

/**
 * Updates the package.json file to include the necessary scripts.
 *
 * This function adds the following scripts to the package.json file:
 * - lint: Runs the linter.
 * - lint:fix: Fixes linting errors.
 * - type-check: Runs the type checker.
 * - analyze: Runs both linting and type checking.
 * - format: Runs the formatter.
 * - format:check: Checks the formatting of the code.
 *
 * @returns {void}
 */
export const addPackageJsonScripts = () => {
  const pkgJsonPath = path.resolve(process.cwd(), "package.json");

  if (!fs.existsSync(pkgJsonPath)) {
    console.error(chalk.red("No package.json found in the current directory."));
    return;
  }

  const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8"));

  pkgJson.scripts = {
    ...pkgJson.scripts,
    lint: "echo 'Running linter...' && eslint .",
    "lint:fix": "eslint . --fix",
    "type-check": "echo 'Running type checking...' && tsc --noEmit",
    analyze: "npm run lint && npm run type-check",
    format: "prettier --write .",
    "format:check": "prettier --check .",
  };

  fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2) + "\n");
  console.log(chalk.green("✅ Added scripts to package.json"));
};
