import { fileURLToPath, URL } from 'url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';
import vueDevTools from 'vite-plugin-vue-devtools';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue({
            script: {
                defineModel: true,
                propsDestructure: true
            }
        }),
        vueDevTools(),
        vuetify({
            autoImport: true,
            styles: { configFile: 'src/scss/variables.scss' }
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `
                    @import "@/scss/_variables.scss";
                `
            }
        },
        devSourcemap: true // Permet de générer des sourcemaps pour le CSS en mode développement
    },
    optimizeDeps: {
        exclude: ['vuetify'],
        entries: ['./src/**/*.vue']
    },
    build: {
        chunkSizeWarningLimit: 10000,
        commonjsOptions: {
            include: [/node_modules/],
            transformMixedEsModules: true
        },
        rollupOptions: {
            external: [
                /@fortawesome\/fontawesome-svg-core\/package\.json/
            ],
            output: {
                manualChunks: {
                    auth: ['./src/views/auth/Login.vue', './src/views/auth/Register.vue'],
                    // dashboard: ['./src/views/dashboard/index.vue']
                }
            }
        }
    },
    server: {
        port: 5180,
        host: true
    }
});
