import {defineConfig} from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
    plugins: [solidPlugin()],
    build: {
        target: 'esnext',
        rollupOptions: {
            output: {
                manualChunks: undefined,
                inlineDynamicImports: true,
                entryFileNames: "index.js",
                assetFileNames: `[name].[ext]`
            }
        },
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:3001',
                changeOrigin: true,
                headers: {
                    "X-Auth-Token": "i2k4UPeyGVHiHjyLm1pYdMdIlw2g4bPR/b9SfZw9U+w=",
                    "X-Auth-Token-Type": "slg"
                }
            },
            '/data': {
                target: 'http://127.0.0.1:3001',
                changeOrigin: true,
            },
        },
    },
});
