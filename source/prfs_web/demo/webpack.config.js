const path = require('path');

module.exports = {
  entry: path.join(__dirname, 'index.js'),
  mode: 'production',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.js',
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: false,
    port: 4000,
  }
};
