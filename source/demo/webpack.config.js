const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: "production",
  entry: {
    main: path.resolve(__dirname, "index.ts"),
    // main: path.resolve(__dirname, "index.js"),
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
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    headers: {
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Opener-Policy": "same-origin",
    },
  },
};
