import webpack from "webpack";

import webpackConfig from "./webpack.config";

const devConfig: webpack.Configuration = {
  ...webpackConfig,
  mode: "development",
};

export default devConfig;
