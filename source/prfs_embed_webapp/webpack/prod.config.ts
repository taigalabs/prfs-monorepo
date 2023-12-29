import webpack from "webpack";

import webpackConfig from "./webpack.config";

const prodConfig: webpack.Configuration = {
  ...webpackConfig,
  mode: "production",
};

export default prodConfig;
