import baseConfig from "./configs/eslint/base-eslint-config";
import typescriptConfig from "./configs/eslint/typescript-eslint-config";

const config = [...baseConfig(), ...typescriptConfig()];

export default config;
