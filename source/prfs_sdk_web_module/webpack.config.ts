import path from "path";
import webpack from "webpack";
const nodeExternals = require("webpack-node-externals");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

const config: webpack.Configuration = {
  mode: "production",
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
    // new CircularDependencyPlugin({
    //   failOnError: true,
    //   exclude: /node_modules/,
    //   cwd: process.cwd(),
    // }),
    new NodePolyfillPlugin(),
  ],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
  },
  // ignoreWarnings: [
  //   /Circular dependency between chunks with runtime/
  // ],
};

export default config;
