import path from "path";
import webpack from "webpack";

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
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  plugins: [
    // new CircularDependencyPlugin({
    //   failOnError: true,
    //   exclude: /node_modules/,
    //   cwd: process.cwd(),
    // }),
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
