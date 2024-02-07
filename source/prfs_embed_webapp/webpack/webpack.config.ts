import "dotenv/config";

import path from "path";
import webpack from "webpack";
import NodePolyfillPlugin from "node-polyfill-webpack-plugin";

const isProd = process.env.NODE_ENV === "production";

const str = JSON.stringify;

const entryPath = path.resolve(__dirname, "../src/index.ts");
const distPath = path.resolve(__dirname, "../dist/");
console.log("webpack entryPath: %s, distPath: %s", entryPath, distPath);

const config: webpack.Configuration = {
  mode: "development",
  devtool: false,
  entry: entryPath,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  target: "web",
  externals: [],
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    fallback: {
      fs: require.resolve("browserify-fs"),
      crypto: require.resolve("crypto-browserify"),
    },
  },
  plugins: [
    new NodePolyfillPlugin(),
    new webpack.DefinePlugin({
      "process.env.NEXT_PUBLIC_PRFS_API_SERVER_ENDPOINT": str(
        process.env.NEXT_PUBLIC_PRFS_API_SERVER_ENDPOINT,
      ),
      "process.env.NEXT_PUBLIC_PRFS_ID_SESSION_SOCKET_ENDPOINT": str(
        process.env.NEXT_PUBLIC_PRFS_ID_SESSION_SOCKET_ENDPOINT,
      ),
    }),
  ],
  experiments: { asyncWebAssembly: true },
  output: {
    path: distPath,
    filename: "index.js",
    // not used
    webassemblyModuleFilename: isProd
      ? "../static/wasm/[modulehash].wasm"
      : "static/wasm/[modulehash].wasm",
  },
};

export default config;
