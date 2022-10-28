import { defineConfig } from 'vite'
import viteCompression from 'vite-plugin-compression'
import vue from '@vitejs/plugin-vue'
import path from 'path'

const version = process.env.npm_package_version.replace(/\./g, '-')

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8080
    // proxy: {
    //   '/api': {
    //     ws: true,
    //     changeOrigin: true,
    //     target: 'http://localhost:3000/api'
    //   }
    // }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      find: '@vue/runtime-core',
      replacement: '@vue/runtime-core/dist/runtime-core.esm-bundler.js'
    }
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `[name]_` + version + `.js`,
        chunkFileNames: `[name]_` + version + `.js`,
        assetFileNames: `[name]_` + version + `.[ext]`
      }
    }
  },
  plugins: [vue(), viteCompression()]
})
