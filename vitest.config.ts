import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['spec/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      include: ['dist/**/*.js'],
      exclude: ['spec/', 'coverage/', 'src/', '*.config.ts']
    }
  }
})
