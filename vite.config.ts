import path from 'path';
import { fileURLToPath } from 'url';
import {
  defineConfig,
  loadEnv,
} from 'vite';
import svgLoader from 'vite-svg-loader';

import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import vue from '@vitejs/plugin-vue';

export default ({mode}: any) => {
    process.env = {...process.env, ...loadEnv(mode, process.cwd())};

    return defineConfig({
        base: "/ToDoList-Vue/",
        plugins: [
            vue(),
            svgLoader({
                svgoConfig: {
                    plugins: [
                    {
                        name: 'preset-default',
                        params: {
                        overrides: {
                            removeViewBox: false,
                        },
                        },
                    },
                    'removeDimensions',
                    'removeXMLProcInst',
                    ]
                }
            }),
            VueI18nPlugin({
                include: fileURLToPath(new URL('./src/shared/i18n/locales/**\/*.json', import.meta.url)),
                runtimeOnly: false,
            }),
        ],
        resolve: {
            alias: {
                "@": fileURLToPath(new URL("./src", import.meta.url)),
            },
        },
        server: {
            port: 3000,
            open: true,
        },
        build: {
            chunkSizeWarningLimit: 1100,
            sourcemap: true,
            rollupOptions: {
                output: {
                    manualChunks: {
                        vendor: ["vue", "vue-router"],
                    },
                },
            },
        },
    })
}
