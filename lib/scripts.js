
var build = require('component-builder');
var es6modules = require('builder-es6-module-to-cjs');

var plugins = build.plugins;

module.exports = function (done) {
  var tree = this.tree;
  var options = this.options;

  var require = options.require != null
    ? options.require
    : true;

  build.scripts(tree, options)
  .use('scripts',
    es6modules(options),
    plugins.js(options))
  .use('json',
    plugins.json(options))
  .use('templates',
    plugins.string(options))
  .end(function (err, js) {
    if (err) return done(err);
    if (!js) return done(null, '');

    tree = build.scripts.canonical(tree);
    var alias = options.standalone || options.umd;
    if (alias) {
      var alias = typeof alias === 'string'
        ? alias
        : (tree.node.standalone || tree.node.name);
      js = build.scripts.umd(tree.canonical, alias, js);
    } else {
      if (require) js = build.scripts.require + js;
      js += 'require("' + tree.canonical + '")\n';
    }

    done(null, js);
  })
}
