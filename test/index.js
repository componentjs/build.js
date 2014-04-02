
var resolve = require('component-resolver');
var join = require('path').join;
var assert = require('assert');
var vm = require('vm');

var Build = require('..');

function fixture(name) {
  return join(__dirname, 'fixtures', name);
}

describe('example', function () {
  var build;

  it('should resolve', function (done) {
    resolve(fixture('example'), {
      install: true,
    }, function (err, tree) {
      if (err) return done(err);

      build = Build(tree);
      done();
    })
  })

  it('should build scripts', function (done) {
    build.set('require', true);

    build.scripts(function (err, js) {
      if (err) return done(err);

      var ctx = vm.createContext();
      vm.runInContext(js, ctx);
      done();
    })
  })

  it('should build scripts with UMD', function (done) {
    build.set('umd', 'asdf');

    build.scripts(function (err, js) {
      if (err) return done(err);

      var ctx = vm.createContext();
      vm.runInContext(js, ctx);
      vm.runInContext('if (!this.asdf) throw new Error();', ctx);
      done();
    })
  })

  it('should build styles', function (done) {
    build.styles(function (err, css) {
      if (err) return done(err);

      assert(~css.indexOf('-webkit-flex'));
      done();
    })
  })
})
