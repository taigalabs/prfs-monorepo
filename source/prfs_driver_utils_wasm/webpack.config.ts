import path from "path";
import nodePolyfillPlugin from "node-polyfill-webpack-plugin";
import webpack from "webpack";

const config = {
  entry: "./src/index.ts",
  optimization: {
    concatenateModules: false,
    providedExports: false,
    usedExports: false,
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    library: {
      name: "prfsDriverUtilsWasm",
      type: "root",
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
};

export default config;
