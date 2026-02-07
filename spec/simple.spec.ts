import { describe, it, expect, beforeAll } from 'vitest'
import { scan } from '../dist/index.js'
import path from 'node:path'

describe('when getting all files', function () {
  let result: string[]
  beforeAll(async function () {
    result = await scan('./', ['**/*.*'], ['.git', 'node_modules', '.nyc_output', 'dist', '.claude', 'coverage'])
  })

  it('should return all files outside excluded folders', function () {
    const prefix = process.cwd()
    expect(result).toEqual([
      prefix + '/.gitignore',
      prefix + '/.npmignore',
      prefix + '/CHANGELOG.md',
      prefix + '/README.md',
      prefix + '/package-lock.json',
      prefix + '/package.json',
      prefix + '/spec/simple.spec.ts',
      prefix + '/src/index.ts',
      prefix + '/tsconfig.json',
      prefix + '/vitest.config.ts'
    ])
  })
})

describe('when getting all js files', function () {
  let result: string[]
  beforeAll(async function () {
    result = await scan('./', ['**/*.js'], ['.git', 'node_modules', 'coverage'])
  })

  it('should return all files outside excluded folders', function () {
    const prefix = process.cwd()
    // After migration, only dist files remain as .js
    expect(result).toEqual([
      prefix + '/dist/index.js'
    ])
  })
})

describe('when getting all js files with multiple ignore paths', function () {
  let result: string[]
  beforeAll(async function () {
    result = await scan('./', ['**/*.js'], ['.git', 'node_modules', 'spec', 'dist', 'coverage'])
  })

  it('should return all files outside excluded folders', function () {
    const prefix = process.cwd()
    // After migration with dist ignored, no .js files match
    expect(result).toEqual([])
  })
})

describe('when getting all markdown files with custom ignore paths', function () {
  let result: string[]
  beforeAll(async function () {
    result = await scan('./', ['**/*.md', '**/*.markdown'], ['.git', 'spec', 'src'])
  })

  it('should only return files with matching extenions', function () {
    const allMatch = result.every(file => {
      const ext = path.extname(file)
      return ext === '.markdown' || ext === '.md'
    })
    expect(allMatch).toBe(true)
  })
})

describe('when getting files in paths with no subdirectories', function () {
  let result: string[]
  beforeAll(async function () {
    result = await scan('./src', ['**/*.ts'])
  })

  it('should return files in folder', function () {
    const prefix = process.cwd()
    expect(result).toEqual([
      prefix + '/src/index.ts'
    ])
  })
})

describe('when matching localized patterns', function () {
  let result: string[]
  beforeAll(async function () {
    result = await scan('./', ['./src/*.ts'])
  })

  it('should return files in folder', function () {
    const prefix = process.cwd()
    expect(result).toEqual([
      prefix + '/src/index.ts'
    ])
  })
})

describe('when getting directories', function () {
  let result: string[]
  beforeAll(async function () {
    result = await scan('./', ['*'], ['.git', 'node_modules', 'coverage', 'dist', '.claude'], { directories: true })
  })

  it('should list all subdirectories except the excluded folders', function () {
    const prefix = process.cwd()
    expect(result).toEqual([
      prefix + '/spec',
      prefix + '/src'
    ])
  })
})
