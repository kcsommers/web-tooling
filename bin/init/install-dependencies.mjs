/* eslint-disable no-console */
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pkgJsonPath = path.resolve(__dirname, "../../package.json");
const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8"));

const baseDeps = [
  "eslint",
  "eslint-config-prettier",
  "eslint-plugin-prettier",
  "eslint-import-resolver-alias",
  "prettier",
];

const typescriptProjectDeps = [
  "typescript",
  "typescript-eslint",
  "@typescript-eslint/eslint-plugin",
  "@typescript-eslint/parser",
  "jiti",
];

const reactProjectDeps = [
  "eslint-plugin-import",
  "eslint-plugin-jsx-a11y",
  "eslint-plugin-react",
  "eslint-plugin-react-hooks",
  "eslint-plugin-react-refresh",
  "eslint-import-resolver-typescript",
];

const nextProjectDeps = ["eslint-config-next"];

/**
 * Installs the necessary dependencies for the project depending on the framework and TypeScript usage.
 *
 * @param {Object} options
 * @param {string} options.framework
 * @param {boolean} options.isTypescript
 * @param {boolean} options.noInstall
 * @returns {Promise<void>}
 */
export const installDependencies = ({ framework, isTypescript, noInstall }) => {
  const depWithVersion = (dep) => {
    const pkgJsonVersion = pkgJson.peerDependencies[dep];
    if (!pkgJsonVersion) {
      throw new Error(
        `Could not find peer dependency version for: ${dep}. Please ensure it is listed in the peerDependencies section of kcsommers-web-tooling/package.json.`,
      );
    }

    const leadingCharRegex = /^[~^>=<*]/;
    const versionSplit = pkgJsonVersion.split(" || ");
    const latestVersion = versionSplit[versionSplit.length - 1];
    const version = latestVersion.replace(leadingCharRegex, "");

    return `${dep}@${version}`;
  };

  const depsToInstall = baseDeps.map(depWithVersion);

  if (isTypescript) {
    depsToInstall.push(...typescriptProjectDeps.map(depWithVersion));
  }

  if (framework === "Next.js") {
    depsToInstall.push(...nextProjectDeps.map(depWithVersion));
  } else if (framework === "Vanilla React") {
    depsToInstall.push(...reactProjectDeps.map(depWithVersion));
  }

  return new Promise((resolve, reject) => {
    if (noInstall) {
      console.log(chalk.blue("Skipping dependency installation."));
      console.log(
        chalk.blue("Be sure to install the following dependencies manually:"),
      );
      console.log(chalk.blue(depsToInstall.join("\n")));
      return resolve();
    }

    console.log(chalk.blue("Installing dependencies..."));

    const command = `npm install --force --save-dev ${depsToInstall.join(" ")}`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`Failed to install dependencies: ${error.message}`));
        return;
      }
      if (stderr) {
        console.error(chalk.yellow(`⚠️ ${stderr}`));
      }
      console.log(chalk.gray(stdout));
      console.log(chalk.green(`✅ Installed the following dependencies:`));
      console.log(chalk.green(depsToInstall.join("\n")));
      console.log(
        chalk.blue(
          "Be sure to uninstall any pre-existing linting and formatting dependencies from your project.",
        ),
      );
      resolve();
    });
  });
};
