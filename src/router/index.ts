import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router'; // Importation de RouteRecordRaw pour typer les routes . Quand on parle de de typer les routes, on parle de définir la structure des routes dans l'application Vue.js. RouteRecordRaw est un type fourni par Vue Router qui permet de définir les propriétés d'une route, comme le chemin, le composant associé, les métadonnées, etc. Cela permet de s'assurer que les routes sont correctement définies et que le code est plus facile à comprendre et à maintenir.
import MainRoutes from './MainRoutes';
import AuthRoutes from './AuthRoutes';
import { authGuard } from './guards/authGuard';
import { useAuthStore } from '@/stores/AuthStore';

const routes: RouteRecordRaw[] = [
    {
        path: '/:pathMatch(.*)*', // Toutes les routes sont capturées pour afficher la page 404 au cas où une route n'est pas trouvée
        name: 'NotFound',
        component: () => import('@/views/auth/Error.vue'),
        meta: {
            title: 'Page non trouvée' // Titre de la page pour le SEO
        }
    },
    MainRoutes,
    AuthRoutes 
];

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL), // Use HTML5 history mode pour cleaner URLs (ca permet de ne pas avoir de # dans les URLs)
    routes
});

// Navigation guard for debugging 
router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();
  if (!auth.initialized) {
    await auth.hydrateAuth();
  }
  console.log('Navigation vers:', to.path); // Debug
  next();
});
// Auth guard to protect routes that require authentication
/* router.beforeEach(authGuard); */

export default router;
