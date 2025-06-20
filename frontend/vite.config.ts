import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        proxy: {
            '/api/market': {
                target: 'http://127.0.0.1:8000',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api\/market/, ''),
            },
            '/api/payment': {
                target: 'http://127.0.0.1:8081',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api\/payment/, ''),
            },
        },
    },
})
