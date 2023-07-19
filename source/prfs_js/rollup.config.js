import typescript from "@rollup/plugin-typescript";

const packageJson = require("./package.json");

/** @type {import('rollup').RollupOptions} */
export default {
  input: "src/index.ts",
  output: [
    {
      file: packageJson.main,
      format: "cjs",
    },
    {
      file: packageJson.module,
      format: "esm",
    },
  ],
  plugins: [typescript()],
};
