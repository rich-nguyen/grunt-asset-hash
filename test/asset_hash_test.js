'use strict';

var grunt = require('grunt');
var fs = require('fs');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.asset_hash = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  default_options: function(test) {
    test.expect(6);

    var actual = grunt.file.read('assetmap.json');
    var expected = grunt.file.read('test/expected/default_options/assetmap.json');
    test.equal(actual, expected, 'should contain a valid asset map.');

    test.ok(fs.existsSync('tmp/default_options/test/fixtures/5ba48b6e5a7c4d4930fda256f411e55b/123'));
    test.ok(fs.existsSync('tmp/default_options/test/fixtures/279d97c58278ae0309eb0cf24cbeef67/test.css'));
    test.ok(fs.existsSync('tmp/default_options/test/fixtures/6be91bfc401452c6157e67fff0e1b9db/test.css.map'));
    test.ok(fs.existsSync('tmp/default_options/test/fixtures/fa6a5a3224d7da66d9e0bdec25f62cf0/testing.js'));
    test.ok(fs.existsSync('tmp/default_options/test/fixtures/2a440ce824809f040dfe6de7bc6099f1/testing.js.map'));

    test.done();
  },
  source_mapped: function(test) {
    test.expect(6);

    var actual = grunt.file.read('tmp/source_mapped/test-assetmap.json');
    var expected = grunt.file.read('test/expected/source_mapped/assetmap.json');
    test.equal(actual, expected, 'should contain a valid asset map.');

    test.ok(fs.existsSync('tmp/source_mapped/test/fixtures/5ba48b6e5a7c4d49/123'));
    test.ok(fs.existsSync('tmp/source_mapped/test/fixtures/279d97c58278ae03/test.css'));
    test.ok(fs.existsSync('tmp/source_mapped/test/fixtures/279d97c58278ae03/test.css.map'));
    test.ok(fs.existsSync('tmp/source_mapped/test/fixtures/fa6a5a3224d7da66/testing.js'));
    test.ok(fs.existsSync('tmp/source_mapped/test/fixtures/fa6a5a3224d7da66/testing.js.map'));

    test.done();
  },
  no_hash: function(test) {
    test.expect(6);

    var actual = grunt.file.read('tmp/no_hash/test-assetmap.json');
    var expected = grunt.file.read('test/expected/no_hash/assetmap.json');
    test.equal(actual, expected, 'should contain a valid asset map.');

    test.ok(fs.existsSync('tmp/no_hash/test/fixtures/123'));
    test.ok(fs.existsSync('tmp/no_hash/test/fixtures/test.css'));
    test.ok(fs.existsSync('tmp/no_hash/test/fixtures/test.css.map'));
    test.ok(fs.existsSync('tmp/no_hash/test/fixtures/testing.js'));
    test.ok(fs.existsSync('tmp/no_hash/test/fixtures/testing.js.map'));

    test.done();
  },
  asset_hash: function(test) {
    test.expect(6);

    var actual = grunt.file.read('tmp/base_paths/test-assetmap.json');
    var expected = grunt.file.read('test/expected/base_paths/assetmap.json');
    test.equal(actual, expected, 'should contain a valid asset map with base paths removed.');

    test.ok(fs.existsSync('tmp/base_paths/fixtures/5ba48b6e5a7c4d49/123'));
    test.ok(fs.existsSync('tmp/base_paths/fixtures/279d97c58278ae03/test.css'));
    test.ok(fs.existsSync('tmp/base_paths/fixtures/279d97c58278ae03/test.css.map'));
    test.ok(fs.existsSync('tmp/base_paths/fixtures/fa6a5a3224d7da66/testing.js'));
    test.ok(fs.existsSync('tmp/base_paths/fixtures/fa6a5a3224d7da66/testing.js.map'));

    test.done();
  }
};
