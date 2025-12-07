/* eslint-disable no-console */
import fs from "fs";
import path from "path";
import chalk from "chalk";

/**
 * Updates the .gitignore file to include the `tsconfig.tsbuildinfo` file.
 *
 * The `tsc` command creates a `tsconfig.tsbuildinfo` file that should not be committed.
 * This function adds it to the `.gitignore` file if it is not already present.
 *
 * @returns {void}
 */
export const updateGitIgnore = () => {
  const gitignorePath = path.resolve(process.cwd(), ".gitignore");
  let gitignoreContent = "";

  if (fs.existsSync(gitignorePath)) {
    gitignoreContent = fs.readFileSync(gitignorePath, "utf-8");
  }

  if (!gitignoreContent.includes("tsconfig.tsbuildinfo")) {
    gitignoreContent +=
      (gitignoreContent.endsWith("\n") ? "" : "\n") + "tsconfig.tsbuildinfo\n";
    fs.writeFileSync(gitignorePath, gitignoreContent);
    console.log(chalk.green("Updated .gitignore"));
  } else {
    console.log(chalk.gray("tsconfig.tsbuildinfo is already in .gitignore"));
  }
};
