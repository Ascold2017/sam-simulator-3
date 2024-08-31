import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { templateCompilerOptions } from '@tresjs/core'
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue({
    ...templateCompilerOptions
  })],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    }
  },
  server: {
    https: {
      key: fs.readFileSync('../shared/cert.key'),
      cert: fs.readFileSync('../shared/cert.crt'),
    },
  }
})
