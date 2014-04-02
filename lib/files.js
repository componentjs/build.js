
var build = require('component-builder');

var plugins = build.plugins;

module.exports = function (done) {
  var tree = this.tree;
  var options = this.options;

  var plugin = options.copy
    ? plugins.copy(options)
    : plugins.symlink(options);

  build.files(tree, options)
  .use('images', plugin)
  .use('fonts', plugin)
  .use('files', plugin)
  .end(done);
}
