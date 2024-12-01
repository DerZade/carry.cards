import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import checker from 'vite-plugin-checker';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';

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
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
}));
