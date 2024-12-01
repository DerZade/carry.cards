import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import checker from 'vite-plugin-checker';

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
              }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
}));
