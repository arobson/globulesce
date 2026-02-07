# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.0.0](https://github.com/arobson/globulesce/compare/v1.0.1...v2.0.0) (2026-02-07)

### ⚠ BREAKING CHANGES

* **Migration to ESM**: This package is now ESM-only and no longer supports CommonJS `require()`. You must use `import` statements.
* **Node.js 22+ Required**: Minimum Node.js version is now 22.0.0 (previously supported Node 8+)
* **TypeScript Migration**: The package is now written in TypeScript. Source files are compiled to JavaScript in the `dist/` directory.
* **Main Export Changed**: The main entry point is now `./dist/index.js` (was `./src/index.js`)
* **Module Type**: Package now has `"type": "module"` - all `.js` files are treated as ESM
* **Testing Framework**: Migrated from Mocha/Chai to Vitest

### Features

* **TypeScript Support**: Full TypeScript support with type definitions included
* **ESM Module Format**: Native ES module support for modern JavaScript environments
* **Type Definitions**: Exported TypeScript types including `ScanOptions` interface
* **Modern Build Process**: TypeScript compiler with separate build step
* **Improved Testing**: Vitest test runner with coverage support via `@vitest/coverage-v8`
* **Build Automation**: Added Makefile with help text for common development tasks
* **Package Exports**: Proper `exports` field in package.json for modern module resolution

### Dependencies

* **Updated**: `minimatch` updated to v10.0.1 (from wildcard version)
* **Added**: TypeScript 5.7.2, Vitest 2.1.8, type definitions for Node.js and minimatch
* **Removed**: Mocha, Chai, nyc, coveralls, standard linter (replaced with TypeScript and Vitest)

### Development

* **Build Command**: `npm run build` compiles TypeScript to JavaScript
* **Test Command**: `npm test` now runs Vitest (with pre-build step)
* **Coverage Command**: `npm run coverage` generates coverage reports with Vitest
* **Clean Command**: `npm run clean` removes build artifacts
* **Makefile**: Added with targets for build, test, coverage, clean, and release

### Migration Guide

If upgrading from v1.x:

1. Ensure you're using Node.js 22 or higher
2. Add `"type": "module"` to your `package.json`
3. Update import syntax:
   ```javascript
   // Old (v1.x)
   const glob = require('globulesce')

   // New (v2.x)
   import { scan } from 'globulesce'
   ```
4. The API remains the same - `scan(path, match, ignore, options)` works identically

### [1.0.1](https://github.com/arobson/globulesce/compare/v1.0.0...v1.0.1) (2021-01-30)


### Bug Fixes

* correct dependencies with audit issues ([da5fd5f](https://github.com/arobson/globulesce/commit/da5fd5f55d6daf18faf04fb345559b560a4b2343))
* patching dependencies to remove audit flags ([be63027](https://github.com/arobson/globulesce/commit/be630278c31f34e4265d096696607d832f86d45a))

## 1.0.0

 * drop lodash and when
 * switch to standard code style
 * add travis build & coveralls
 * drop gulp and move to nyc for local coverage

## 0.1.*

### 0.1.6
Add feature for returning directories instead of files.

### 0.1.5
Bug fix - using `matchBase` was an awful default and made it impossible to be selective about where files came from.
