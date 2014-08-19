# grunt-asset-hash

> Create a folder of asset files that include hashes

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-asset-hash --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-asset-hash');
```

## The "asset_hash" task

### Overview
In your project's Gruntfile, add a section named `asset_hash` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  asset_hash: {
    options: {
      preserveSourceMaps: false,  // Set to true when assets should share the same location as their source map.
      assetMap: 'assetmap.json',  // A mapping file between assets and their hashed locations. Set to `false` to skip generating.
      hashLength: 32,             // Number of hex characters in the hash folder. (0 means no hashing is done).
      algorithm: 'md5',           // Crypto algorithm used to hash the contents.
      srcBasePath: '',            // The directory prefix to be stripped from the asset map src paths.
      destBasePath: '',           // The directory prefix to be stripped from the asset map dest paths.
      hashType: 'folder',         // Defaults to `/$HASH/filename.ext`, but `'file'` will output `filename.$HASH.ext`.
      references: []              // Files to replace references in (eg. a CSS file where `image.png` should become `image.$HASH.png`)
    },
    your_target: {
      files: [
        { src:  ['assets/**/*'],  // A collection of assets to be hashed.
          dest: 'hashed'          // A folder to contained the hashed assets. Cannot be a file.
        }
      ]
    },
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
 * 2014-08-19   v0.1.6   Add a reference option to replace file paths (eg. in CSS) with hashed versions
 * 2014-07-29   v0.1.5   Make asset map generation optional.
 * 2014-07-29   v0.1.4   Allow hashing in filenames rather than folder names
 * 2014-06-24   v0.1.3   Support paths which are not normalised.
 * 2014-06-24   v0.1.1   Add options to strip base paths from final folder structure and asset map.
 * 2014-06-23   v0.1.0   Initial version.
