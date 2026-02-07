import path from 'node:path'
import { readdir, stat } from 'node:fs/promises'
import { minimatch } from 'minimatch'

export interface ScanOptions {
  directories?: boolean
  dot?: boolean
  nocase?: boolean
  matchBase?: boolean
}

async function readDir(
  dir: string,
  ignored: string[],
  options?: ScanOptions
): Promise<string[]> {
  const fullPath = path.resolve(dir)
  const files = await readdir(fullPath)
  const promises = files.map(file => readFile(fullPath, file, ignored, options))
  const results = await Promise.all(promises)
  return results.flat()
}

async function readFile(
  dir: string,
  file: string,
  ignored: string[],
  options?: ScanOptions
): Promise<string[]> {
  if (ignored.includes(file)) {
    return []
  }

  const newPath = path.join(dir, file)
  try {
    const stats = await stat(newPath)
    if (stats.isDirectory()) {
      if (options?.directories) {
        const subFiles = await readDir(newPath, ignored, options)
        return [...subFiles, newPath]
      } else {
        return await readDir(newPath, ignored, options)
      }
    } else if (!options || !options.directories) {
      return [newPath]
    } else {
      return []
    }
  } catch {
    return []
  }
}

export function scan(
  dir: string,
  patterns?: string | string[],
  ignored?: string[],
  opts?: ScanOptions
): Promise<string[]> {
  // Set default ignored list
  if (!ignored) {
    ignored = ['.git', 'node_modules']
  }

  // Normalize patterns to array
  let normalizedPatterns: string[]
  if (typeof patterns === 'string') {
    normalizedPatterns = [patterns]
  } else if (Array.isArray(patterns) && patterns.length > 0) {
    normalizedPatterns = patterns
  } else {
    normalizedPatterns = ['**/*.*']
  }

  // Strip leading ./ or .\ from patterns
  normalizedPatterns = normalizedPatterns.map(pattern =>
    pattern.replace(/^[.][/\\]/, '')
  )

  // Set default options
  const settings: ScanOptions = opts || {
    dot: true,
    nocase: true,
    matchBase: false
  }

  // Create filter functions for each pattern
  const filters = normalizedPatterns.map(pattern =>
    minimatch.filter(pattern, settings)
  )

  return readDir(dir, ignored, settings).then(files => {
    return files.filter(file => {
      const localized = path.relative(dir, file)
      return filters.some(f => f(localized))
    })
  })
}

export default scan
