var assert = require('assert');
var path = require('path');
var helpers = require('yeoman-generator').test;
// var exec = require('child_process').exec;
// var donejsPackage = require('donejs-cli/package.json');
// var npmVersion = require('../lib/utils').npmVersion;
var fs = require('fs-extra');
var testHelpers = require('./helpers');

// function pipe(child) {
//   child.stdout.pipe(process.stdout);
//   child.stderr.pipe(process.stderr);
// }

describe('generator-donejs', function () {
  describe('donejs:connect-model', function() {
    it('basics works', function (done) {
      var tmpDir;

      helpers.run(path.join(__dirname, '../default'))
        .inTmpDir(function (dir) {
          tmpDir = dir;
          fs.copySync(path.join( __dirname, "tests", "basics" ), dir);
        })
        .withOptions({
          skipInstall: true
        })
        .withPrompts({
          name: 'messages',
          url: '  /messages',
          idProp: "id"
        })
        .on('end', function () {
          assert( fs.existsSync( path.join( tmpDir, "src", "models", "messages.js" ) ), "bar.js exists" );
          done();
        });
    });

    it('allows to override template files', function (done) {
      var source = path.join(__dirname, 'tests', 'override', 'override.js');
      var tmpDir, target;

      helpers.run(path.join(__dirname, '../default'))
        .inTmpDir(function (dir) {
          tmpDir = dir;
          target = path.join(dir, '.donejs', 'templates', 'supermodel', 'model_test.js');
          fs.copySync(path.join( __dirname, 'tests', 'basics' ), dir);
          fs.copySync(source, target);
        })
        .withOptions({
          skipInstall: true
        })
        .withPrompts({
          name: 'messages',
          url: '  /messages',
          idProp: "id"
        })
        .on('end', function () {
          assert.fileContent(path.join(tmpDir, 'src', 'models', 'messages_test.js'),
            /Overriden messages test file/);
          done();
        });
    });

    it('Errors when a package is not found', function (done) {
      var tmpDir;

      helpers.run(path.join(__dirname, '../default'))
        .inTmpDir(function (dir) {
          tmpDir = dir;
          fs.copySync(path.join(__dirname, 'tests', 'empty'), dir);
        })
        .withOptions({
          skipInstall: true
        })
        .withPrompts({
          name: 'messages',
          url: '  /messages',
          idProp: "id"
        })
        .on('error', function(err) {
          var msg = err.message;
          assert(/Expected to find/.test(msg), 'Correct error message');
          done();
        });
    });

    it('works with no directories.lib', function (done) {
      var tmpDir;

      helpers.run(path.join(__dirname, '../default'))
        .inTmpDir(function (dir) {
          tmpDir = dir;
          fs.copySync(path.join(__dirname, "tests", "no_directories"), dir);
        })
        .withOptions({
          skipInstall: true
        })
        .withPrompts({
          name: 'messages',
          url: '/messages',
          idProp: "id"
        })
        .on('end', function () {
          assert(fs.existsSync(path.join(tmpDir, "models", "messages.js")), "messages.js exists");
          assert(fs.existsSync(path.join(tmpDir, "models", "messages_test.js")), "messages.js exists");
          assert(fs.existsSync(path.join(tmpDir, "models", "fixtures", "messages.js")), "messages.js exists");
          done();
        });
    });

    it('Errors when a test has an invalid name', function (done) {
      var tmpDir;

      helpers.run(path.join(__dirname, '../default'))
        .inTmpDir(function (dir) {
          tmpDir = dir;
          fs.copySync(path.join(__dirname, 'tests', 'basics'), dir);
        })
        .withOptions({
          skipInstall: true
        })
        .withPrompts({
          name: 'test',
          url: '  /messages',
          idProp: "id"
        })
        .on('error', function(err) {
          var msg = err.message;
          assert(/A model cannot be named/.test(msg), 'Correct error message');
          done();
        });
    });

    describe('Running in a project with existing models', function() {
      before(function(done){
        var test = this;

        helpers.run(path.join(__dirname, '../default'))
          .inTmpDir(function (dir) {
            test.tmpDir = dir;
            fs.copySync(path.join( __dirname, "tests", "existing"), dir);
          })
          .withOptions({
            skipInstall: true
          })
          .withPrompts({
            name: 'messages',
            url: '/messages',
            idProp: "id"
          })
          .on('end', function () {
            done();
          });
      });

      it('Copies the right files', function () {
        var tmpDir = this.tmpDir;
        assert(fs.existsSync(path.join(tmpDir, 'src', "models", "messages.js")),
               "messages.js exists");
        assert(fs.existsSync(path.join(tmpDir, 'src', "models",
                                       "messages_test.js")),
               "messages_test.js exists");
      });

      it('Updates the models/test.js file without replacing', function() {
        var tmpDir = this.tmpDir;
        var testFile = fs.readFileSync(path.join(tmpDir, 'src', 'models',
                                                 'test.js'), 'utf8');

        assert(/foo_test/.test(testFile), 'foo_test still in the file');
        assert(/messages_test/.test(testFile), 'messages_test added');
      });

      it('Updates the models/fixtures/fixtures.js file without replacing', function() {
        var tmpDir = this.tmpDir;
        var fixFile = fs.readFileSync(path.join(tmpDir, 'src', 'models',
                                                'fixtures', 'fixtures.js'), 'utf8');

        assert(/fixtures\/foo/.test(fixFile), 'Existing fixtures remain');
        assert(/fixtures\/messages/.test(fixFile), 'New fixture added');
      });
    });

    describe('Running in a project with the existing module', function() {
      before(function(done){
        var test = this;

        helpers.run(path.join(__dirname, '../default'))
          .inTmpDir(function (dir) {
            test.tmpDir = dir;
            fs.copySync(path.join( __dirname, "tests", "existing2"), dir);
          })
          .withOptions({
            skipInstall: true
          })
          .withPrompts({
            name: 'messages',
            url: '/messages',
            idProp: "id"
          })
          .on('end', function () {
            done();
          });
      });

      it('Doesn\'t update the test.js file twice', function() {
        var tmpDir = this.tmpDir;
        var testFile = fs.readFileSync(path.join(tmpDir, 'src', 'models',
                                                 'test.js'), 'utf8');

        var times = testHelpers.appearances("messages_test", testFile);
        assert.equal(times, 1, 'Only appears once');
      });

    });
  });
});
