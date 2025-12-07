import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import nextConfig from "@kcsommers/web-tooling/eslint/next";
import typescriptConfig from "@kcsommers/web-tooling/eslint/typescript";

const flatCompat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
});

const config = [...nextConfig(flatCompat), ...typescriptConfig()];

export default config;
