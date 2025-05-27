import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./setupTests.js'],
    pool: 'vmThreads',
    deps: {
      web: {
        transformAssets: true,
      },
    },
  },
  resolve: {
    alias: {
      '#assets': path.resolve(__dirname, 'src', 'assets'),
      '#scalars': path.resolve(__dirname, 'src', 'scalars'),
      '#ui': path.resolve(__dirname, 'src', 'ui'),
      '#graphql': path.resolve(__dirname, 'src', 'scalars', 'graphql'),
    },
  },
})
