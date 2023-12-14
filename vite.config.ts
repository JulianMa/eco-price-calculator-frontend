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
            },
            '/data': {
                target: 'http://127.0.0.1:3001',
                changeOrigin: true,
            },
        },
    },
});
