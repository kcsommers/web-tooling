import tseslint from "typescript-eslint";
import { BaseEslintConfigOptions } from "./base-eslint-config";

const typescriptConfig = (options?: BaseEslintConfigOptions) => [
  {
    files: ["**/*.{ts,tsx,cts,mts}"],
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      ...(options?.plugins || {}),
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: options?.project || "./tsconfig.json",
        tsconfigRootDir: process.cwd(),
      },
    },
    rules: {
      ...tseslint.configs.recommended[0].rules,
      ...tseslint.configs.recommendedTypeChecked[0].rules,
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],
      ...(options?.rules || {}),
    },
  },
];

export default typescriptConfig;
