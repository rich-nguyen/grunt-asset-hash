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
      assetMap: 'assetmap.json',  // A mapping file between assets and their hashed locations.
      hashLength: 32,             // Number of hex characters in the hash folder. (0 means no hashing is done).
      algorithm: 'md5'            // Crypto algorithm used to hash the contents.
    },
    your_target: {
      files: [
        { src:  ['assets/**/*'],  // A collection of assets to be hashed.
          dest: 'hashed'          // A folder to contained the hashed assets. Cannot be a file,
                                  // so it's incompatible with 'expand' and 'cwd' grunt properties. 
      ]
    },
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
