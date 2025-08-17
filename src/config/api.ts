export const API_ROUTES = {
    AUTH: {
        REGISTER: `/api/register`,
        LOGIN: `/api/login`,
        LOGOUT: `/api/logout`,
        CURRENT_USER: `/api/auth/current`
    },
    PARTENAIRES: {
        LIST: '/api/gec/admin/clients',
        CREATE: '/api/gec/admin/clients',
        UPDATE: '/api/gec/admin/client',
        DELETE: '/api/gec/admin/client',
        SEARCH: '/api/gec/admin/clients/search'
    },
    PROJETS: {
        LIST: '/api/gec/admin/projects',
        CREATE: '/api/gec/admin/projects',
        UPDATE: '/api/gec/admin/projects',
        DELETE: '/api/gec/admin/projects',
        SEARCH: '/api/gec/admin/projects/search'
    }
};
