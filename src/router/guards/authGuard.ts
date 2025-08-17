import { useAuthStore } from '@/stores/AuthStore';
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

export async function authGuard(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
    const authStore = useAuthStore();

    // Attendre que le store soit initialisé
    if (!authStore.initialized) {
        await authStore.hydrateAuth();
    }

    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth); // Vérifie si la route nécessite une authentification

    console.log('Auth Guard - Route:', to.path);
    console.log('Auth Guard - isAuthenticated:', authStore.isAuthenticated);
    console.log('Auth Guard - User:', authStore.user);
    console.log('Auth Guard - RequiresAuth:', requiresAuth);

    if (to.path.includes('/auth/')) {
        if (authStore.isAuthenticated) {
            console.log('Redirection: Utilisateur déjà authentifié');
            next('/');
            return;
        }
        next();
        return;
    }

    if (requiresAuth) {
        if (!authStore.isAuthenticated) {
            console.log('Redirection: Authentification requise');
            next('/auth/login');
            return;
        }

        const requiredPermissions = (to.meta.permissions as string[]) || []; // depuis Vue Router 4, les permissions sont définies dans les métadonnées de la route
        if (requiredPermissions.length > 0) {
            const hasPermission = requiredPermissions.some((permission) => authStore.hasPermission(permission)); // Vérifie si l'utilisateur a au moins une des permissions requises

            if (!hasPermission) {
                console.log('Redirection: Permission manquante');
                next('/unauthorized'); // Redirige vers une page d'erreur ou de permission refusée
                return;
            }
        }
    }

    next();
}
