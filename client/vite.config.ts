import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { DEV_API_URL, DEV_VITE_HOSTS, DEV_VITE_PORT } from '../shared/config'
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
            manifest: {
                name: 'G3 Scout-o-Matic',
                short_name: 'G3 Scouting',
                description: 'The G3 Scouting software application.',
                theme_color: '#f8f9fa',
                background_color: '#f8f9fa',
                display: 'standalone',
                scope: '/',
                start_url: '/',
                lang: "en",
                icons: [
                    {
                        src: 'pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: 'pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    },
                    {
                        src: 'pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable'
                    }
                ]
            },
            devOptions: {
                enabled: false
            }
        })
    ],
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
