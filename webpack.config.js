var path = require("path");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var webpack = require("webpack");

module.exports = {
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "scripts/dashboard.js",
  },
  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ["", ".scss", ".css", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
    modulesDirectories: [
      'node_modules',
      path.resolve(__dirname, './node_modules')
    ]
  },

  module: {
    loaders: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
      {
        test: /\.tsx?$/,
        loader: "ts-loader"
      },
      {
        test: /\.(scss|css)$/,
        loader: ExtractTextPlugin.extract('style', 'typings-for-css-modules?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass')
      }
    ],

    sassLoader: {
      data: '@import "' + path.resolve(__dirname, 'theme/_theme.scss') + '";'
    },

    preLoaders: [
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        test: /\.js$/,
        loader: "source-map-loader"
      }
    ]
  },

  plugins: [
    new ExtractTextPlugin("style.css", { allChunks: true }),
    new webpack.optimize.UglifyJsPlugin()
  ],
}
