import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [],
  test: {
    globals: true,
    environment: 'happy-dom',
    pool: 'vmThreads',
    setupFiles: ['./setupTests.js'],
    deps: {
      web: {
        transformAssets: true,
      },
    },
  },
})
