/* un système persistant d’auth complet ! */
/* 
Token stocké dans localStorage

Token rechargé avec hydrateAuth()

Mise à jour de axios.defaults.headers.common (au niveau global) pour inclure ou supprimer le token

Appel de /api/current_user pour recharger les données utilisateur

Flag initialized pour savoir si l'authentification a été initialisée . si l'auth n'est pas initialisé, on ne peut pas accéder aux routes protégées (Supprime les états UI temporaires faux)
*/

import { defineStore } from 'pinia';
import axios from 'axios';
import { API_ROUTES } from '@/config/api';
import { nextTick } from 'vue'; // Permet d'attendre que les changements réactifs se propagent avant de continuer

interface User {
    id: number;
    name: string;
    firstname: string;
    email: string;
    role: string;
    permissions: string[];
}

interface AuthStore {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    initialized: boolean; // Flag d'initialisation ajouté
}

/* interface LoginResponse {
    token: string;
    user: {
        id: number;
        name: string;
        firstname: string;
        email: string;
        role: string;
        permissions: string[];
    };
}
 */
export const useAuthStore = defineStore('auth', {
    state: (): AuthStore & { initialized: boolean } => ({
        user: null,
        token: null,
        isAuthenticated: false,
        initialized: false
    }),
    getters: {
        // nous permet d'accéder aux propriétés de l'état. Dans ce cas , ce getter permet de vérifier si l'utilisateur est authentifié, s'il est un administrateur et s'il a une permission spécifique.
        isAdmin: (state) => state.user?.role === 'admin',
        hasPermission: (state) => (permission: string) => {
            return state.user?.permissions?.includes(permission) ?? false;
        }
    },
    actions: {
        async hydrateAuth() {
            const token = localStorage.getItem('token');
            if (token) {
                this.token = token;
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                // Optionnel: appeler une API pour récupérer les infos utilisateur
                try {
                    const response = await axios.get(API_ROUTES.AUTH.CURRENT_USER);
                    const user = response.data?.data;
                    if (user) {
                        this.user = user;
                        this.isAuthenticated = true;
                    }
                } catch (error) {
                    console.error("Erreur lors de la réhydratation de l'authentification", error);
                    // Si erreur, nettoyer le token
                    this.resetAuth();
                }
            }
            this.initialized = true; // Fin de la réhydratation, même si aucun token n'est présent
        },

        async login(credentials: { email: string; password: string }) {
            try {
                await axios.get(`${import.meta.env.VITE_API}/sanctum/csrf-cookie`); // Get CSRF token for POST requests (required for Laravel)
                const response = await axios.post(API_ROUTES.AUTH.LOGIN, credentials);

                console.log('Response:', response.data);

                // Vérifier la structure de la réponse
                if (response.data.status === 'Request was successful') {
                    const { token, user } = response.data.data;

                    // Mettre à jour le store
                    this.token = token;
                    this.user = {
                        ...user,
                        permissions: user.permissions ?? [] // S'assurer que permissions existe
                    };
                    this.isAuthenticated = true; // Marquer l'utilisateur comme authentifié

                    // Stocker le token
                    localStorage.setItem('token', token);
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Mettre à jour les headers d'axios

                    await nextTick(); // Attendre que les changements réactifs se propagent

                    return { success: true };
                }

                return {
                    success: false,
                    error: 'Erreur de connexion'
                };
            } catch (error: any) {
                console.error('Erreur lors de la connexion:', error);
                return {
                    success: false,
                    error: error.response?.data?.message ?? 'Erreur de connexion'
                };
            }
        },

        async logout() {
            try {
                await axios.post(API_ROUTES.AUTH.LOGOUT);
            } catch (error) {
                console.error('Erreur lors de la déconnexion:', error);
            } finally {
                this.resetAuth();
            }
        },

        resetAuth() {
            this.user = null;
            this.token = null;
            this.isAuthenticated = false;
            this.initialized = false; // Réinitialiser le flag d'initialisation
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
        }
    }
});
