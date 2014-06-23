/*
 * grunt-asset-hash
 * https://github.com/rich-nguyen/grunt-asset-hash
 *
 * Copyright (c) 2014 Richard Nguyen
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    asset_hash: {
      default_options: {
        files: [
          {src: ['fixtures/**/*'], dest: 'tmp/default_options', cwd: 'test', expand: true}
        ]
      },
      source_mapped: {
        options: {
          preserveSourceMaps: true,
          assetMap: 'tmp/source_mapped/test-assetmap.json',
          hashLength: 16
        },
        files: [
          {src: ['fixtures/**/*'], dest: 'tmp/source_mapped', cwd: 'test', expand: true}
        ]
      },
      no_hash: {
        options: {
          preserveSourceMaps: true,
          assetMap: 'tmp/no_hash/test-assetmap.json',
          hashLength: 0
        },
        files: [
          {src: ['fixtures/**/*'], dest: 'tmp/no_hash', cwd: 'test', expand: true}
        ]
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/asset_hash_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'asset_hash', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
