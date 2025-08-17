import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import { router } from './router';
import vuetify from './plugins/vuetify';
import { setupAxios } from '@/plugins/axios';
import { useAuthStore } from '@/stores/AuthStore';
import VueApexCharts from 'vue3-apexcharts';
import VueTablerIcons from 'vue-tabler-icons';
import Maska from 'maska';
// import { FontAwesomeIcon } from '@/plugins/fontawesome';
import '@/scss/style.scss';

// Import Directus client
import '@/plugins/directus';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia); // State management
app.use(router); // Router
app.use(vuetify); // UI framework
app.use(VueTablerIcons); // Plugins supplémentaires pour afficher des icônes
app.use(Maska); // Plugin pour les masques de saisie
app.component('apexchart', VueApexCharts);
// app.component('font-awesome-icon', FontAwesomeIcon); // Enregistrement global du composant FontAwesome

setupAxios(); // Configuration HTTP client qui nous permet de faire des requêtes API

// Hydrate la session utilisateur avant de monter l'application
const authStore = useAuthStore();
authStore.hydrateAuth().then(() => {
    app.mount('#app');
});
