import reactConfig from "@kcsommers/web-tooling/eslint/react";
import typescriptConfig from "@kcsommers/web-tooling/eslint/typescript";

const config = [...reactConfig(), ...typescriptConfig()];

export default config;
