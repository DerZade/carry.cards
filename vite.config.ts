import { fileURLToPath, URL } from 'node:url';

import { defineConfig, mergeConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import checker from 'vite-plugin-checker';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import { VitePWA } from 'vite-plugin-pwa';
import { minimal2023Preset } from '@vite-pwa/assets-generator/config';

// https://vite.dev/config/
export default defineConfig(c => ({
    plugins: [
        vue(),
        vueDevTools(),
        c.mode === 'test'
            ? false
            : checker({
                  enableBuild: false,
                  eslint: {
                      lintCommand: 'eslint .',
                      useFlatConfig: true,
                  },
                  stylelint: {
                      lintCommand: 'stylelint **/*.{scss,vue}',
                  },
              }),
        VueI18nPlugin({
            include: fileURLToPath(new URL('./src/assets/locales/**', import.meta.url)),
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
                            background: '#000000',
                        },
                    },
                    apple: {
                        ...minimal2023Preset.apple,
                        resizeOptions: {
                            ...minimal2023Preset.apple.resizeOptions,
                            background: '#000000',
                        },
                    },
                },
                image: 'public/logo.svg',
            },
            manifest: {
                background_color: '#000000',
                display: 'standalone',
                name: 'carry.cards',
                short_name: 'carry.cards',
                start_url: '/cards',
                theme_color: '#000000',
            },
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
}));
