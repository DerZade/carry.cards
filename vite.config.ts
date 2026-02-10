import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import vueI18n from '@intlify/unplugin-vue-i18n/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { minimal2023Preset } from '@vite-pwa/assets-generator/config'

// https://vite.dev/config/
export default defineConfig({
  server: {
    allowedHosts: true,
  },
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
    vueI18n({
      include: fileURLToPath(new URL('./src/i18n/locales/**', import.meta.url)),
      dropMessageCompiler: true,
      strictMessage: false,
      escapeHtml: false,
      compositionOnly: true,
    }),
    VitePWA({
      strategies: 'generateSW',
      registerType: 'prompt',
      pwaAssets: {
        preset: {
          ...minimal2023Preset,
          maskable: {
            ...minimal2023Preset.maskable,
            resizeOptions: {
              ...minimal2023Preset.maskable.resizeOptions,
              background: '#0f1115',
            },
          },
          apple: {
            ...minimal2023Preset.apple,
            resizeOptions: {
              ...minimal2023Preset.apple.resizeOptions,
              background: '#0f1115',
            },
          },
        },
        image: 'public/logo.svg',
      },
      manifest: {
        background_color: '#0f1115',
        display: 'standalone',
        name: 'carry.cards',
        short_name: 'carry.cards',
        start_url: '/cards',
        theme_color: '#0f1115',
        orientation: 'portrait-primary',
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
