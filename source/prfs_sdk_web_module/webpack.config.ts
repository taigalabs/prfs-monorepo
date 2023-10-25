import "dotenv/config";

import path from "path";
import webpack from "webpack";
import NodePolyfillPlugin from "node-polyfill-webpack-plugin";

const isProd = process.env.NODE_ENV === "production";

const str = JSON.stringify;

const config: webpack.Configuration = {
  mode: "development",
  entry: path.resolve(__dirname, "src/index.ts"),
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
      "process.env.NEXT_PUBLIC_PRFS_SDK_VERSION": str(process.env.NEXT_PUBLIC_PRFS_SDK_VERSION),
      "process.env.NEXT_PUBLIC_PRFS_API_SERVER_ENDPOINT": str(
        process.env.NEXT_PUBLIC_PRFS_API_SERVER_ENDPOINT
      ),
      "process.env.NEXT_PUBLIC_PRFS_ASSET_SERVER_ENDPOINT": str(
        process.env.NEXT_PUBLIC_PRFS_ASSET_SERVER_ENDPOINT
      ),
    }),
  ],
  experiments: { asyncWebAssembly: true },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    // not used
    webassemblyModuleFilename: isProd
      ? "../static/wasm/[modulehash].wasm"
      : "static/wasm/[modulehash].wasm",
  },
};

export const devConfig: webpack.Configuration = {
  ...config,
};

export const prodConfig: webpack.Configuration = {
  ...config,
  mode: "production",
};

// export default config;
