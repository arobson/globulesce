# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
