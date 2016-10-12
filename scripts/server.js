// Gets called when running npm start

var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('../webpack.config');

var server = new WebpackDevServer(webpack(config), { // Start a server
  contentBase:"./app",
  publicPath: config.output.publicPath,
  hot: true, // With hot reloading
  inline: false,
  historyApiFallback: true,
  quiet: true // Without logging
}).listen(5000, 'localhost', function (err, result) {
  if (err) {
    console.log(err);
  }

  console.log('Listening at localhost:5000');
});
