const chai = require('chai')
chai.use(require('chai-as-promised'))
chai.should()

const scan = require('../src/index.js')
const path = require('path')

describe('when getting all files', function () {
  let result
  before(function (done) {
    scan('./', ['**/*.*'], ['.git', 'node_modules', '.nyc_output'])
      .then(function (files) {
        result = files
        done()
      })
  })

  it('should return all files outside excluded folders', function () {
    const prefix = process.cwd()
    result.should.eql([
      prefix + '/.gitignore',
      prefix + '/.npmignore',
      prefix + '/CHANGELOG.md',
      prefix + '/README.md',
      prefix + '/package-lock.json',
      prefix + '/package.json',
      prefix + '/spec/simple.spec.js',
      prefix + '/src/index.js'
    ])
  })
})

describe('when getting all js files', function () {
  let result
  before(function (done) {
    scan('./', ['**/*.js'])
      .then(function (files) {
        result = files
        done()
      })
  })

  it('should return all files outside excluded folders', function () {
    const prefix = process.cwd()
    result.should.eql([
      prefix + '/spec/simple.spec.js',
      prefix + '/src/index.js'
    ])
  })
})

describe('when getting all js files with multiple ignore paths', function () {
  let result
  before(function (done) {
    scan('./', ['**/*.js'], ['.git', 'node_modules', 'spec'])
      .then(function (files) {
        result = files
        done()
      })
  })

  it('should return all files outside excluded folders', function () {
    const prefix = process.cwd()
    result.should.eql([
      prefix + '/src/index.js'
    ])
  })
})

describe('when getting all markdown files with custom ignore paths', function () {
  let result
  before(function (done) {
    scan('./', ['**/*.md', '**/*.markdown'], ['.git', 'spec', 'src'])
      .then(function (files) {
        result = files
        done()
      })
  })

  it('should only return files with matching extenions', function () {
    result.reduce((acc, file) => {
      const ext = path.extname(file)
      const condition = ext === '.markdown' || ext === '.md'
      return acc && condition
    }, true).should.equal(true)
  })
})

describe('when getting files in paths with no subdirectories', function () {
  let result
  before(function (done) {
    scan('./src', ['**/*.js'])
      .then(function (files) {
        result = files
        done()
      })
  })

  it('should return files in folder', function () {
    const prefix = process.cwd()
    result.should.eql([
      prefix + '/src/index.js'
    ])
  })
})

describe('when matching localized patterns', function () {
  let result
  before(function (done) {
    scan('./', ['./src/*.js'])
      .then(function (files) {
        result = files
        done()
      })
  })

  it('should return files in folder', function () {
    const prefix = process.cwd()
    result.should.eql([
      prefix + '/src/index.js'
    ])
  })
})

describe('when getting directories', function () {
  let result
  before(function (done) {
    scan('./', ['*'], ['.git', 'node_modules', 'coverage'], { directories: true })
      .then(function (files) {
        result = files
        done()
      })
  })

  it('should list all subdirectories except the excluded folders', function () {
    const prefix = process.cwd()
    result.should.eql([
      prefix + '/spec',
      prefix + '/src'
    ])
  })
})
