
var build = require('component-builder');
var autoprefix = require('builder-autoprefixer');

var plugins = build.plugins;

module.exports = function (done) {
  var tree = this.tree;
  var options = this.options;

  build.styles(tree, options)
  .use('styles',
    plugins.urlRewriter(options.prefix || ''),
    autoprefix(options))
  .end(done);
}
