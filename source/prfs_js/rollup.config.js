import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";

const packageJson = require("./package.json");

/** @type {import('rollup').RollupOptions} */
export default {
  input: "src/wasm_wrapper/wasm_worker.ts",
  output: [
    {
      dir: "./build",
      format: "esm",
    },
  ],
  plugins: [typescript(), nodeResolve()],
};
