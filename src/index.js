const path = require('path')
const fs = require('fs')
const minimatch = require('minimatch')
const readdir = lift(fs.readdir)
const stat = lift(fs.stat)

function any (list, predicate = y => y) {
  let met = false
  for (let i = 0; i < list.length; i++) {
    if (predicate(list[i])) {
      met = true
      break
    }
  }
  return met
}

function contains (list, item) {
  return list.indexOf(item) >= 0
}

function flatten (list) {
  return list.reduce((a, b) =>
    a.concat(Array.isArray(b) ? flatten(b) : b)
  , [])
}

function filter (list, predicate = y => y) {
  return list.reduce((acc, x) => predicate(x) ? acc.concat(x) : acc, [])
}

function isEmpty (x) {
  return x == null || x === '' || x === []
}

function isString (value) {
  return typeof value === 'string'
}

function lift (asyncFn) {
  const lifted = function (...params) {
    return new Promise((resolve, reject) => {
      function callback (err, result) {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      }
      asyncFn.apply(null, params.concat(callback))
    })
  }
  lifted.name = asyncFn.name
  return lifted
}

function readDir (dir, ignored, options) {
  const fullPath = path.resolve(dir)
  return readdir(fullPath)
    .then((files) => {
      const promises = files.map(file =>
        readFile(fullPath, file, ignored, options)
      )
      return Promise.all(promises)
    })
}

function readFile (dir, file, ignored, options) {
  if (contains(ignored, file)) {
    return Promise.resolve([])
  } else {
    const newPath = path.join(dir, file)
    return stat(newPath)
      .then(
        (stat) => {
          if (stat.isDirectory()) {
            if (options && options.directories) {
              return readDir(newPath, ignored, options)
                .then(list => flatten(list.concat(newPath)))
            } else {
              return readDir(newPath, ignored)
            }
          } else if (!options || !options.directories) {
            return [newPath]
          } else {
            return []
          }
        },
        () => Promise.resolve([])
      )
  }
}

function scan (dir, patterns, ignored, opts) {
  if (!ignored) {
    ignored = ['.git', 'node_modules']
  }
  if (isString(patterns)) {
    patterns = [patterns]
  } else if (Array.isArray(patterns) && !isEmpty(patterns)) {
    // do nothing
  } else {
    patterns = ['**/*.*']
  }
  patterns = patterns.map(pattern => pattern.replace(/^[.][/\\]/, ''))
  const settings = opts || { dot: true, nocase: true, matchBase: false }
  const filters = patterns.map(pattern =>
    minimatch.filter(pattern, settings)
  )

  return readDir(dir, ignored, settings)
    .then(files => {
      if (files && files.length) {
        return files.reduce((x, y) => {
          return Array.isArray(x) ? x.concat(y) : [x, y]
        })
      } else {
        return []
      }
    })
    .then(collections => {
      return flatten(collections)
    })
    .then(list => {
      return filter(list, file => {
        const localized = path.relative(dir, file)
        return any(filters, f => f(localized))
      })
    })
}

module.exports = scan
