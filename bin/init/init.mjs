/* eslint-disable no-console */
import chalk from "chalk";
import inquirer from "inquirer";
import { addPackageJsonScripts } from "./add-package-json-scripts.mjs";
import { copyConfigs } from "./copy-configs.mjs";
import { installDependencies } from "./install-dependencies.mjs";
import { updateGitIgnore } from "./update-gitignore.mjs";

const collectFramework = async () => {
  return await inquirer.prompt([
    {
      type: "list",
      name: "framework",
      message: "What framework is your project using?",
      choices: ["Next.js", "Vanilla React"],
    },
  ]);
};

const collectTypescript = async () => {
  return await inquirer.prompt([
    {
      type: "confirm",
      name: "isTypescript",
      message: "Are you using TypeScript?",
      default: true,
    },
  ]);
};

export const init = async ({ force, noInstall }) => {
  console.log(chalk.blue("Initializing web tooling setup..."));

  try {
    const { framework } = await collectFramework();
    const { isTypescript } = await collectTypescript();

    copyConfigs({ framework, isTypescript, force });
    addPackageJsonScripts();
    updateGitIgnore();
    await installDependencies({ framework, isTypescript, noInstall });

    console.log(chalk.green("✅ Setup complete!"));
  } catch (error) {
    console.error(chalk.red(error.message));
    console.error(chalk.red("❌ Initialization failed"));
  }
};
