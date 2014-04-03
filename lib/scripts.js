
var build = require('component-builder');
var es6modules = require('builder-es6-module-to-cjs');

var plugins = build.plugins;

module.exports = function (done) {
  var tree = this.tree;
  var options = this.options;

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

    var name = canonical(tree);
    var alias = options.standalone || options.umd;
    if (alias) {
      var alias = typeof alias === 'string'
        ? alias
        : name;
      js = umd(name, alias, js);
    } else {
      if (options.require) js = build.scripts.require + js;
      js += 'require("' + name + '")\n';
    }

    done(null, js);
  })
}

function canonical(tree) {
  // main root has it's own scripts,
  // so it's an entry point.
  var scripts = tree.node.scripts;
  if (scripts && scripts.length) return tree.canonical;

  var locals = tree.locals;
  var names = Object.keys(locals);
  if (names.length !== 1) {
    throw new Error('failed to resolve the entry point of component "' + tree.name + '". please either have .scripts or a single .locals in your main component.');
  }
  return locals[names[0]].canonical;
}

function umd(canonical, alias, js) {
  return '\n;(function(){\n\n'
    + build.scripts.require
    + js
    + '\n\nif (typeof exports == "object") {'
    + '  module.exports = require("' + canonical + '");'
    + '} else if (typeof define == "function" && define.amd) {'
    +'  define([], function(){ return require("' + canonical + '"); });'
    + '} else {'
    + '  this["' + alias + '"] = require("' + canonical + '");'
    + '}'
    + '})()\n';
}
