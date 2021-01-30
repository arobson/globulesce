## globulesce
Need a list of files matching a set of glob patterns? Need to exclude certain subfolders? Need it fast? Try globulesce! It's as fast as its name is gross.

[![Build Status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]

Fully async, promise based API.

## API

###( path, match, ignore, { options } )

__path__ the directory to start scanning in (this is inclusive).

__match__ a glob string or an array of glob strings to match files against.

__ignore__ a directory or list of directories to ignore. This defaults to [ '.git', 'node_modules' ]. If you'd like those folders included, provide an empty array.

__options__ a set of optional flags to include. `directories` is a boolean that can be included to return directories *instead of* files.

```javascript
var glob = require( 'globulesce' );

var files = glob( './', [ '**/*.js' ], [ '.git', 'node_modules' ] );
```

#### The ignore directory ignores *all* directories with a matching name regardless of depth
For my purposes, when I need to ignore a directory, I _always_ want to ignore it. This may not be helpful. If you need different behavior, send a PR :D

## Dependencies
This library does almost nothing and relies almost entirely on

 * minimatch

## Why Reinvent The Wheel!?
I needed a way to scan a directory tree for files that wouldn't first eagerly scan `.git` and `node_modules`. There are several NPM libs that promise to do this but don't. The end result is that you wait a few seconds whilst they tear through an entire tree and then proceed to toss a bunch of results out (or don't even do that).

None of my specific use cases care about what are in `.git` or `node_modules` *and* are time sensitive.