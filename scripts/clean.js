const del = require("del");

module.exports = function() {
  del(['.tmp/', 'coverage/', 'src/**/*.js', 'src/**/*.js.map', 'src/**/*.d.ts', 'node_modules/', 'typings/globals/']);
};

//this checks to see if we are running as a script, if so execute the funcion
if (!module.parent) {
  module.exports();
}
