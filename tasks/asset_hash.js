/*
 * grunt-asset-hash
 * https://github.com/rich-nguyen/grunt-asset-hash
 *
 * Based on the hashmap plugin by ktmud https://github.com/ktmud/grunt-hashmap/blob/master/tasks/hashmap.js
 * Also uses portions of grunt-ver https://github.com/chrisdanford/grunt-ver for replacing paths in CSS etc
 *
 * Copyright (c) 2014 Richard Nguyen
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs');
var path = require('path');
var crypto = require('crypto');

module.exports = function(grunt) {

  grunt.registerMultiTask('asset_hash', 'Create a folder of asset files that include hashes', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      preserveSourceMaps: false,
      assetMap: 'assetmap.json',
      hashLength: 32,
      algorithm: 'md5',
      hashType: 'folder',
      srcBasePath: '',
      destBasePath: '',
      references: []
    });

    var assetFileMapping = {},
        sourceFileMapping = {},
        sourceMaps = {},
        numSourceFiles,
        renameInfos = [];

    // Force task into async mode and grab a handle to the "done" function.
    var done = this.async();

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {

      // Check that the destination is a directory.
      var dest = f.dest;

      if (grunt.file.isFile(dest)) {
        grunt.log.warn('The destination specified must not be a file: ' + dest);
        done();
        return;
      }

      var src = f.src.filter(function(filepath) {
        // Do not copy source maps if they should be preserved.
        if (options.preserveSourceMaps && isSourceMap(filepath)) {
          // Strip '.map' extension.
          var minifiedFile = filepath.slice(0, -4);
          sourceMaps[minifiedFile] = filepath;
          return false;
        }

        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return grunt.file.isFile(filepath);
        }
      });

      numSourceFiles = src.length;
      if (!numSourceFiles) {
        grunt.log.writeln('No source files to hash.');
        done();
        return;
      }

      src.forEach(function(filepath) {
        if (options.hashLength) {
          var hash = crypto.createHash(options.algorithm);
          var stream = fs.createReadStream(filepath);
          stream
            .on('data', function(data) {
              hash.update(data);
            })
            .on('end', function() {
              // Create a 32-hex digest and insert it into the path.
              var hexFolderName = hash.digest('hex').slice(0, options.hashLength);

              copyFile(filepath, f.dest, hexFolderName);
            });
        } else {
          copyFile(filepath, f.dest, '');
        }
      });
    });

    // Copy and log the file to the output location, and signal done() when the last copy is done.
    function copyFile(assetPath, dest, hexFolder) {

      // Copy the asset file to the hashed folder and store the mapping.
      var relativeAssetPath = stripPrefixAndNormalise(assetPath, options.srcBasePath),
          hashDir  = path.join(dest, path.dirname(relativeAssetPath), hexFolder),
          destPath = path.join(hashDir, path.basename(assetPath));

      if (options.hashType === 'file') {
        var ext = path.extname(assetPath),
            hashedFilename = path.basename(assetPath, ext) + '.' + hexFolder + ext;
        hashDir  = path.join(dest, path.dirname(relativeAssetPath));
        destPath = path.join(hashDir, hashedFilename);
      }

      var relativeDestPath = stripPrefixAndNormalise(destPath, options.destBasePath);

      grunt.file.copy(assetPath, destPath);

      if (options.move && assetPath !== destPath) {
        grunt.file.delete(assetPath);
      }

      assetFileMapping[relativeAssetPath] = relativeDestPath;
      grunt.log.writeln('Copied asset: ' + assetPath + ' -> ' + destPath);

      // Copy the source map file to the same hashed folder.
      var sourceMapPath = sourceMaps[assetPath];
      if (sourceMapPath) {
        var destSourceMapPath = path.join(hashDir, path.basename(sourceMapPath)),
            relativeSourceMapPath = stripPrefixAndNormalise(sourceMapPath, options.srcBasePath),
            relativeDestSourceMapPath = stripPrefixAndNormalise(destSourceMapPath, options.destBasePath);

        grunt.file.copy(sourceMapPath, destSourceMapPath);

        if (options.move && sourceMapPath !== destSourceMapPath) {
          grunt.file.delete(sourceMapPath);
        }

        sourceFileMapping[relativeSourceMapPath] = relativeDestSourceMapPath;
        grunt.log.writeln('Copied source map: ' + destSourceMapPath);
      }

      if (Object.keys(assetFileMapping).length === numSourceFiles) {
        writeMappingFile();
        renameReferences();
        done();
      }
    }

    function stripPrefixAndNormalise(input, prefix) {
      return path.normalize(input).replace( new RegExp('^' + prefix), '');
    }

    // Tests whether the filepath looks like a css or js source map.
    function isSourceMap(filepath) {
      return grunt.file.isMatch(['**/*.js.map', '**/*.css.map'], path.normalize(filepath));
    }

    // Write the accompanying json file that maps non-hashed assets to their hashed locations.
    function writeMappingFile() {
      // The full mapping combines the asset and source map files.
      var fullMapping = {};
      copyObjectProperties(assetFileMapping, fullMapping);
      copyObjectProperties(sourceFileMapping, fullMapping);

      // Sort the keys.
      var sortedMapping = {};
      var sortedAssets = Object.keys(fullMapping).sort();
      sortedAssets.forEach(function(asset) {
        // track which assets were renamed
        // for filename reference replacement
        // (eg. in CSS files referencing renamed images)
        renameInfos.push({
          from: asset,
          fromRegex: new RegExp('\\b' + asset + '\\b', 'g'),
          to: fullMapping[asset]
        });
        sortedMapping[asset] = fullMapping[asset];
      });

      if (options.assetMap) {
        grunt.file.write(options.assetMap, JSON.stringify(sortedMapping, null, 2));
        grunt.log.oklns('Asset map saved as ' + options.assetMap);
      }
    }

    // Copy object properties to another object.
    function copyObjectProperties(srcObject, destObject) {
      for (var attribute in srcObject) {
        destObject[attribute] = srcObject[attribute];
      }
    }

    function renameReferences() {
      if (options.references) {
        var totalReferences = 0;
        var totalReferencingFiles = 0;
        grunt.log.writeln('Replacing references.').writeflags(options.references);

        grunt.file.expand({filter: 'isFile'}, options.references).sort().forEach(function(f) {
          var content = grunt.file.read(f).toString();
          var replacedToCount = {};

          renameInfos.forEach(function(renameInfo) {
            content = content.replace(renameInfo.fromRegex, function(match) {
              if (match in replacedToCount) {
                replacedToCount[match]++;
              } else {
                replacedToCount[match] = 1;
              }
              return renameInfo.to;
            });
          });

          var replacedKeys = Object.keys(replacedToCount);
          if (replacedKeys.length > 0) {
            grunt.file.write(f, content);
            grunt.verbose.write(f + ' ').ok('replaced: ' + replacedKeys.join(', '));
            totalReferences++;
          }
          totalReferencingFiles++;
        });
        grunt.log.write('Replaced ' + totalReferences + ' in ' + totalReferencingFiles + ' files ').ok();
      }
    }

  });
};
