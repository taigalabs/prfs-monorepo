import "dotenv/config";

import path from "path";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import WasmPackPlugin from "@wasm-tool/wasm-pack-plugin";

const isProd = process.env.NODE_ENV === "production";

const str = JSON.stringify;

const entryPath = path.resolve(__dirname, "./js/");
const distPath = path.resolve(__dirname, "./dist/");
console.log("webpack entryPath: %s, distPath: %s", entryPath, distPath);

const config: webpack.Configuration = {
  entry: entryPath,
  output: {
    path: distPath,
    filename: "index.js",
    globalObject: "this",
    library: {
      name: "prfsCrypto",
      type: "umd",
    },
    publicPath: "",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  plugins: [
    // new HtmlWebpackPlugin(),
    new WasmPackPlugin({
      crateDirectory: path.resolve(__dirname, "."),
    }),
  ],
  mode: "development",
  experiments: {
    asyncWebAssembly: true,
  },
};

export default config;
