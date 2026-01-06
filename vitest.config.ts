import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    reporters: 'verbose',
    alias: {
      '@core': resolve(__dirname, './src/core'),
      '@domain': resolve(__dirname, './src/domain'),
      '@infra': resolve(__dirname, './src/infra'),
      '@config': resolve(__dirname, './src/config'),
      '@test': resolve(__dirname, './test'),
    },
  },
})
