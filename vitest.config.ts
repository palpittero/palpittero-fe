import { fileURLToPath, URL } from 'node:url'
import { defineConfig, configDefaults } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import crypto from 'node:crypto'

// Polyfill crypto.hash for Node < 20.12.0
if (!crypto.hash) {
  ;(crypto as any).hash = function(algorithm: string, data: any) {
    const hash = crypto.createHash(algorithm.replace('-', '').toLowerCase())
    hash.update(data)
    return hash.digest('hex')
  }
}

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    exclude: [...configDefaults.exclude, 'e2e/**'],
    root: fileURLToPath(new URL('./', import.meta.url)),
    globals: true,
    setupFiles: './src/test/setup.ts'
  },
})
