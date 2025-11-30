import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import istanbul from  'vite-plugin-istanbul';

export default defineConfig({
    plugins: [
        react(),
        istanbul({
            cypress: true,
            requireEnv: false,
            forceBuildInstrument: true
        })
    ],
    server: {
        proxy: {
            '/api': {
                target: `http://localhost:3000`,
                changeOrigin: true,
            },
        },
    },
});