import path from "path";
import webpack from "webpack";
import NodePolyfillPlugin from "node-polyfill-webpack-plugin";

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
  plugins: [new NodePolyfillPlugin()],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
  },
};

export default config;
