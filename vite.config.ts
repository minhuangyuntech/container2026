import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const pagesBase = repositoryName?.endsWith('.github.io')
  ? '/'
  : repositoryName
    ? `/${repositoryName}/`
    : '/'

export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_ACTIONS ? pagesBase : '/',
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
  },
})
