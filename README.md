# web-tooling-configs

A collection of reusable, standardized configurations for web development tools
used at Peerspace. These configs are intended to be used across frontend
services and help to ensure consistency in linting, formatting, type safety etc
when jumping between repositories.

## Table of contents

- [Getting Started](#getting-started)
- [Config Options](#config-options)
- [Working on web-tooling-configs](#working-on-web-tooling-configs)

---

## 🚀 Getting Started

To initialize your project with Peerspace's standard configuration for ESLint,
Prettier, and TypeScript:

### 1. Install the package

For full details on how to install packages from GPR, check out this
[guide](https://www.notion.so/1ee28962e8c680eb9505d8f0d6c17d53?pvs=25#1ee28962e8c6804eb8f0cc511748e55c)

Assuming you are authenticated with the registry, install the package by adding
it to the `devDependecies` field in your `package.json`

```json
{
  "devDependencies": {
    "@peerspace/web-tooling-configs": "X.X.X"
  }
}
```

Then run the install command

```sh
npm install
```

### 2. Run the Init Command

The package comes with a CLI tool you can use to initialize your project with
the proper tooling. After installing, run the init command:

```sh
npx ps-web-tooling init
```

You'll be prompted to select:

- Your framework (e.g. Next.js or Vanilla React)

- Whether you're using TypeScript

Based on your answers, the CLI will:

- Copy config templates for ESLint, Prettier, and (optionally) TypeScript

- Set up recommended `.vscode/settings.json`

### 3. Install IDE Extensions

In order to get real-time linting and formatting in VS Code or Cursor make sure
you have these extensions installed:

- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

NOTE: If you're using a different IDE, you'll need to adapt this setup to work
in your environment.

---

## Config Options

### ESLint

When you import an eslint config from this package, you're actually importing a
function. Each config function accept an optional options argument which allows
you to specify project specific settings. These options will merge with or
override the options provided by the base config.

```ts
import { Linter } from "eslint";

export type BaseEslintConfigOptions = {
  ignores?: Linter.Config["ignores"];
  rules?: Linter.Config["rules"];
  globals?: Linter.Globals | undefined;
  plugins?: Linter.Config["plugins"];
};

declare const baseEslintConfig: (
  options?: BaseEslintConfigOptions,
) => Linter.Config[];
```

### Typescript

The base tsconfig only includes a `compilerOptions` field, and does not specify
a `baseUrl`, `includes` or `excludes` fields, so you'll need to make sure your
local tsconfig includes them. Any `compilerOptions` fields you add to your local
config will merge with or override what is set by the base config.

Its also worth nothing that `tsconfig.base.json` sets the `noEmit` property to
`true`. This is because the assumption is that most of our projects will be
compiled using a tool other than typescript. If you're actually using the `tsc`
command to build `js` files, you'll need to override the `noEmit` field to
`false`.

Example tsconfig.json

```json
{
  "extends": "@peerspace/web-tooling-configs/typescript/tsconfig.base.json",
  "compilerOptions": {
    "baseUrl": "."
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

---

## Working on web-tooling-configs

To work on this package while testing the changes in a consuming app, use
`npm link`.

From the package root, run

```sh
npm link
```

This will create a symlink that consuming apps will reference from their
`node_modules`. To use the local version of the package in a consuming app, run
this command from the root of the app:

```sh
npm link @peerspace/web-tooling-configs
```

You can then run the package's dev script to watch for file changes and have
them automatically compiled to the dist folder and picked up in the consuming
app.

```sh
npm run dev
```
