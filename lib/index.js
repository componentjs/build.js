
module.exports = Build;

function Build(tree, options) {
  if (!(this instanceof Build)) return new Build(tree, options);

  this.tree = tree;
  this.options = options || {};
}

Build.prototype.set = function (key, value) {
  this.options[key] = value;
  return this;
}

Build.prototype.scripts = require('./scripts');
Build.prototype.styles = require('./styles');
Build.prototype.files = require('./files');
