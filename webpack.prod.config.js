// Help from https://github.com/dmachat/angular-webpack-cookbook/wiki/Creating-a-dev-and-production-config

var config = require("./webpack.config");
var webpack = require("webpack");

config.output.filename = "scripts/dashboard.min.js";
config.plugins.push(new webpack.DefinePlugin({
  'process.env': {
    NODE_ENV: JSON.stringify('production')
  }
}));
config.plugins.push(new webpack.optimize.UglifyJsPlugin());

module.exports = config;