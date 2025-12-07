import { FlatCompat } from "@eslint/eslintrc";
import { Linter } from "eslint";
import jsxA11y from "eslint-plugin-jsx-a11y";
import baseConfig, { BaseEslintConfigOptions } from "./base-eslint-config";

const nextConfig = (
  flatCompat: FlatCompat,
  options?: BaseEslintConfigOptions,
): Linter.Config[] => [
  ...flatCompat.extends("next/core-web-vitals"),
  ...baseConfig({
    ...(options || {}),
    ignores: [".next", ...(options?.ignores || [])],
    globals: {
      React: true,
      ...(options?.globals || {}),
    },
    rules: {
      ...jsxA11y.configs.recommended.rules,
      ...(options?.rules || {}),
      "no-restricted-imports": [
        "error",
        {
          paths: [
            // @ts-expect-error
            ...(options?.rules?.["no-restricted-imports"]?.[1]?.paths || []),
            {
              name: "next/router",
              message:
                "Use next/navigation instead which is designed for the App Router.",
            },
          ],
        },
      ],
    },
  }),
];

export default nextConfig;
