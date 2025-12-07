/* eslint-disable no-console */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const checkExistingFiles = (filePaths) => {
  const existingFiles = filePaths.filter((filePath) => fs.existsSync(filePath));
  return existingFiles;
};

const copyFile = (filePath, destPath) => {
  fs.copyFileSync(filePath, destPath);
  const filename = path.basename(filePath);
  console.log(
    chalk.green(`Copied ${filename.replace(".template", "")} to your project`),
  );
};

/**
 * Copies the necessary configuration files to the project.
 *
 * This function copies the following files to the project:
 * - .vscode/settings.json
 * - eslint.config.js or eslint.config.ts
 * - prettier.config.mjs
 * - tsconfig.json (if TypeScript is enabled)
 *
 * @param {Object} options
 * @param {string} options.framework
 * @param {boolean} options.isTypescript
 * @param {boolean} options.force
 */
export const copyConfigs = ({ framework, isTypescript, force = false }) => {
  console.log(chalk.blue("Copying configs..."));

  const destDir = process.cwd();
  const templateDir = path.resolve(__dirname, "../../templates");
  const frameworkName = framework === "Next.js" ? "next" : "react";

  const vscodeSettingsDestPath = path.join(destDir, ".vscode", "settings.json");
  const eslintDestPath = path.join(
    destDir,
    `eslint.config.${isTypescript ? "ts" : "js"}`,
  );
  const prettierDestPath = path.join(destDir, "prettier.config.mjs");
  const tsconfigDestPath = isTypescript
    ? path.join(destDir, "tsconfig.json")
    : null;

  const existingFiles = checkExistingFiles(
    [
      vscodeSettingsDestPath,
      eslintDestPath,
      prettierDestPath,
      tsconfigDestPath,
    ].filter(Boolean),
  );

  if (existingFiles.length > 0) {
    if (!force) {
      throw new Error(
        `The following files already exist in your project:\n${existingFiles.join(
          "\n",
        )}\nUse --force to overwrite.`,
      );
    }
    console.log(
      chalk.yellow(
        `⚠️ Overwriting the following files:\n${existingFiles.join("\n")}`,
      ),
    );
  }

  const vscodeSettingsTemplatePath = path.resolve(
    templateDir,
    "vscode",
    "settings.template.json",
  );
  if (!fs.existsSync(path.join(destDir, ".vscode"))) {
    fs.mkdirSync(path.join(destDir, ".vscode"), { recursive: true });
  }
  copyFile(vscodeSettingsTemplatePath, vscodeSettingsDestPath);

  let eslintTemplateFilename = `eslint-${frameworkName}`;
  if (isTypescript) {
    eslintTemplateFilename += "-ts";
  }
  const eslintTemplatePath = path.resolve(
    templateDir,
    "eslint",
    `${eslintTemplateFilename}.template.js`,
  );
  copyFile(eslintTemplatePath, eslintDestPath);

  const prettierTemplatePath = path.resolve(
    templateDir,
    "prettier",
    "prettier.template.mjs",
  );
  copyFile(prettierTemplatePath, prettierDestPath);

  if (isTypescript) {
    const tsconfigTemplatePath = path.resolve(
      templateDir,
      "typescript",
      "tsconfig.template.json",
    );
    copyFile(tsconfigTemplatePath, tsconfigDestPath);
  }
};
