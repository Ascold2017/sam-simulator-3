import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";
import vueDevTools from "vite-plugin-vue-devtools";
import { templateCompilerOptions } from "@tresjs/core";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({ ...templateCompilerOptions }),
    vueDevTools(),
    /*
    VitePWA({
    registerType: 'autoUpdate',
    manifest: {
      name: 'AA Simulator 3.0',
      short_name: 'AA Sim 3.0',
      description: 'AA Simulator',
      theme_color: '#ffffff',
      icons: [
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    }
  })
    */
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
