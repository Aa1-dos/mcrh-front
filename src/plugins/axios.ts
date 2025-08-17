import axios from 'axios';
import { useAuthStore } from '@/stores/AuthStore';
import { useNotification } from '@/composables/useNotification';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_API;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

export default axios;

export function setupAxios() {
    const { showError } = useNotification(); // Importation de la fonction showError pour afficher les erreurs globales

    // Configuration de base (globale d'axios)
    axios.defaults.withCredentials = true; // Utiliser les cookies pour les requêtes CORS (Cross-Origin Resource Sharing) avec le serveur d'API (par défaut, les cookies ne sont pas envoyés).
    axios.defaults.baseURL = import.meta.env.VITE_API; // URL de base pour toutes les requêtes API

    // Intercepteur de requêtes
    axios.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error instanceof Error ? error : new Error(String(error)))
    );

    // Intercepteur de réponses :  gestion des erreurs globales
    axios.interceptors.response.use(
        (response) => response,
        (error) => {
            const authStore = useAuthStore();

            if (error.response?.status === 401) {
                authStore.resetAuth();
                showError('Session expirée. Veuillez vous reconnecter.');
            } else {
                showError(error.response?.data?.message ?? 'Une erreur est survenue');
            }

            return Promise.reject(error instanceof Error ? error : new Error(String(error)));
        }
    );
}
