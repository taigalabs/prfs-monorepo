import "dotenv/config";

import path from "path";
import webpack from "webpack";
import NodePolyfillPlugin from "node-polyfill-webpack-plugin";

import HtmlWebpackPlugin from "html-webpack-plugin";
// const webpack = require("webpack");
import WasmPackPlugin from "@wasm-tool/wasm-pack-plugin";

const isProd = process.env.NODE_ENV === "production";

// const str = JSON.stringify;

// const entryPath = path.resolve(__dirname, "../src/index.ts");
// const distPath = path.resolve(__dirname, "../dist/");
// console.log("webpack entryPath: %s, distPath: %s", entryPath, distPath);

// const config: webpack.Configuration = {
//   mode: "development",
//   entry: entryPath,
//   module: {
//     rules: [
//       {
//         test: /\.tsx?$/,
//         use: "ts-loader",
//         exclude: /node_modules/,
//       },
//     ],
//   },
//   target: "web",
//   externals: [],
//   resolve: {
//     extensions: [".ts", ".tsx", ".js", ".jsx"],
//     fallback: {
//       fs: require.resolve("browserify-fs"),
//       crypto: require.resolve("crypto-browserify"),
//     },
//   },
//   plugins: [
//     new NodePolyfillPlugin(),
//     new webpack.DefinePlugin({
//       "process.env.NEXT_PUBLIC_PRFS_SDK_VERSION": str(process.env.NEXT_PUBLIC_PRFS_SDK_VERSION),
//       "process.env.NEXT_PUBLIC_PRFS_API_SERVER_ENDPOINT": str(
//         process.env.NEXT_PUBLIC_PRFS_API_SERVER_ENDPOINT,
//       ),
//       "process.env.NEXT_PUBLIC_PRFS_ASSET_ACCESS_ENDPOINT": str(
//         process.env.NEXT_PUBLIC_PRFS_ASSET_ACCESS_ENDPOINT,
//       ),
//     }),
//   ],
//   experiments: { asyncWebAssembly: true },
//   output: {
//     path: distPath,
//     filename: "index.js",
//     // not used
//     webassemblyModuleFilename: isProd
//       ? "../static/wasm/[modulehash].wasm"
//       : "static/wasm/[modulehash].wasm",
//   },
// };

// export default config;

// const path = require("path");
// const HtmlWebpackPlugin = require("html-webpack-plugin");
// const webpack = require("webpack");
// const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");

const config = {
  entry: "./ex.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
  },
  plugins: [
    new HtmlWebpackPlugin(),
    new WasmPackPlugin({
      crateDirectory: path.resolve(__dirname, "."),
    }),
    // Have this example work in Edge which doesn't ship `TextEncoder` or
    // `TextDecoder` at this time.
    new webpack.ProvidePlugin({
      TextDecoder: ["text-encoding", "TextDecoder"],
      TextEncoder: ["text-encoding", "TextEncoder"],
    }),
  ],
  mode: "development",
  experiments: {
    asyncWebAssembly: true,
  },
};

export default config;
