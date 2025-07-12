import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { DEV_API_URL, DEV_VITE_HOSTS, DEV_VITE_PORT } from '../shared/config'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: DEV_VITE_PORT,
        allowedHosts: DEV_VITE_HOSTS,
        proxy: {
            "/api": {
                target: DEV_API_URL,
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ""),
            }
        }
    },
    resolve: {
        alias: {
            "@shared": path.resolve(__dirname, "../shared"),
        },
    },
})
