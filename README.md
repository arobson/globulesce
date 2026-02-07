## globulesce
Need a list of files matching a set of glob patterns? Need to exclude certain subfolders? Need it fast? Try globulesce! It's as fast as its name is gross.

[![Build Status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]

Fully async, promise-based API. Now with TypeScript support and ESM!

## Requirements

- **Node.js 22+** (uses native ESM and modern JavaScript features)

## Installation

```bash
npm install globulesce
```

## API

### `scan(path, match, ignore, options)`

Returns a `Promise<string[]>` containing absolute file paths matching the specified patterns.

**Parameters:**

- **`path`** (string): The directory to start scanning in (inclusive)
- **`match`** (string | string[], optional): A glob pattern or array of patterns to match files against. Defaults to `['**/*.*']`
- **`ignore`** (string[], optional): Directories to ignore. Defaults to `['.git', 'node_modules']`. Pass an empty array to include these folders
- **`options`** (ScanOptions, optional): Configuration options

**Options (`ScanOptions`):**

```typescript
interface ScanOptions {
  directories?: boolean  // Return directories instead of files
  dot?: boolean         // Include dotfiles (default: true)
  nocase?: boolean      // Case-insensitive matching (default: true)
  matchBase?: boolean   // Match basename only (default: false)
}
```

### TypeScript Usage

```typescript
import { scan } from 'globulesce'

// Get all JavaScript files
const files = await scan('./', ['**/*.js'], ['.git', 'node_modules'])

// Get directories only
const dirs = await scan('./', ['*'], ['.git', 'node_modules'], { directories: true })

// With type safety
const results: string[] = await scan('./src', '**/*.ts')
```

### JavaScript (ESM) Usage

```javascript
import { scan } from 'globulesce'

const files = await scan('./', ['**/*.js'], ['.git', 'node_modules'])
```

### Legacy CommonJS Migration

**v2.0.0 is a breaking change.** This library is now ESM-only and requires Node.js 22+.

If you're upgrading from v1.x:

```javascript
// Old (v1.x - CommonJS)
const glob = require('globulesce')
glob('./', ['**/*.js']).then(files => { ... })

// New (v2.x - ESM)
import { scan } from 'globulesce'
const files = await scan('./', ['**/*.js'])
```

**Migration Steps:**
1. Upgrade to Node.js 22 or higher
2. Add `"type": "module"` to your `package.json`
3. Change `require()` to `import`
4. Use top-level `await` or keep using `.then()`

#### The ignore directory ignores *all* directories with a matching name regardless of depth
For my purposes, when I need to ignore a directory, I _always_ want to ignore it. This may not be helpful. If you need different behavior, send a PR :D

## Dependencies
This library does almost nothing and relies almost entirely on

 * minimatch

## Why Reinvent The Wheel!?
I needed a way to scan a directory tree for files that wouldn't first eagerly scan `.git` and `node_modules`. There are several NPM libs that promise to do this but don't. The end result is that you wait a few seconds whilst they tear through an entire tree and then proceed to toss a bunch of results out (or don't even do that).

None of my specific use cases care about what are in `.git` or `node_modules` *and* are time sensitive.