// @ts-check

const path = require("path");
const nodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const webpack = require("webpack");

module.exports = /** @type { import('webpack').Configuration } */ ({
  entry: "./src/index.ts",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    library: {
      name: "prfsDriverSpartanJs",
      type: "umd",
    },
    libraryExport: "default",
    libraryTarget: "var",
    publicPath: "/",
  },
  mode: "development",
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
    extensions: [".tsx", ".ts", ".js"],
    fallback: {
      fs: false,
    },
  },
  plugins: [
    new nodePolyfillPlugin(),

    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
  ],
});
