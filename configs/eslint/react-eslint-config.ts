import jsxA11y from "eslint-plugin-jsx-a11y";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import baseConfig, { BaseEslintConfigOptions } from "./base-eslint-config";

const reactConfig = (options?: BaseEslintConfigOptions) => [
  ...baseConfig({
    ...(options || {}),
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      ...(options?.rules || {}),
    },
    globals: {
      React: true,
      ...(options?.globals || {}),
    },
  }),
  {
    files: ["**/*.{js,jsx,cjs,mjs,ts,tsx,cts,mts}"],
    plugins: {
      react,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
      "react-refresh": reactRefresh,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
];

export default reactConfig;
