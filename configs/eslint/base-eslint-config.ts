import eslintJs from "@eslint/js";
import { Linter } from "eslint";
import * as prettierConfig from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import prettierPlugin from "eslint-plugin-prettier";
import globals from "globals";

export type BaseEslintConfigOptions = {
  ignores?: Linter.Config["ignores"];
  rules?: Linter.Config["rules"];
  globals?: Linter.Globals | undefined;
  plugins?: Linter.Config["plugins"];
  project?: string;
};

// Helper to trim global keys to avoid ESLint crash
// See: https://github.com/sindresorhus/globals/issues/200
const trimGlobals = (g: Linter.Globals) =>
  Object.fromEntries(Object.entries(g).map(([k, v]) => [k.trim(), v]));

const baseEslintConfig = (
  options?: BaseEslintConfigOptions,
): Linter.Config[] => {
  return [
    {
      ignores: ["node_modules", "dist", ...(options?.ignores || [])],
    },
    {
      files: ["**/*.{js,jsx,cjs,mjs,ts,tsx,cts,mts}"],
      languageOptions: {
        ecmaVersion: "latest",
        globals: {
          ...trimGlobals(globals.browser),
          ...trimGlobals(globals.node),
          ...trimGlobals(globals.jest),
          ...(options?.globals || {}),
        },
      },
      linterOptions: {
        reportUnusedDisableDirectives: true,
      },
      plugins: {
        prettier: prettierPlugin,
        import: importPlugin,
        ...(options?.plugins || {}),
      },
      settings: {
        "import/resolver": {
          node: {
            extensions: [".js", ".jsx", ".mjs", ".cjs"],
          },
          typescript: {
            alwaysTryTypes: true,
            extensions: [".ts", ".tsx", ".cts", ".mts"],
            project: options?.project || "./tsconfig.json",
          },
        },
      },
      rules: {
        ...eslintJs.configs.recommended.rules,
        "no-console": "error",
        "prettier/prettier": "error",
        "no-unused-vars": [
          "error",
          {
            args: "all",
            argsIgnorePattern: "^_",
            varsIgnorePattern: "^_",
            caughtErrorsIgnorePattern: "^_",
            destructuredArrayIgnorePattern: "^_",
          },
        ],
        "import/no-unresolved": "error",
        "import/no-duplicates": "error",
        "import/order": [
          "warn",
          {
            groups: [
              "builtin",
              "external",
              "internal",
              "parent",
              "sibling",
              "index",
            ],
            alphabetize: { order: "asc", caseInsensitive: true },
          },
        ],
        ...(options?.rules || {}),
        "no-restricted-imports": [
          "error",
          {
            paths: [
              // @ts-expect-error
              ...(options?.rules?.["no-restricted-imports"]?.[1]?.paths || []),
              {
                name: "lodash",
                message:
                  "Import [module] from lodash/[module] instead to keep bundle size down.",
              },
            ],
          },
        ],
      },
    },
    {
      files: ["**/*.{js,jsx,mjs}"],
      languageOptions: {
        sourceType: "module",
      },
    },
    {
      files: ["**/*.{cjs}"],
      languageOptions: {
        sourceType: "script",
      },
    },
    prettierConfig.default,
  ];
};

export default baseEslintConfig;
