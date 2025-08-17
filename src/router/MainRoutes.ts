import type { RouteRecordRaw } from 'vue-router';

const MainRoutes: RouteRecordRaw = {
    path: '/',
    meta: {
        requiresAuth: false,
        title: 'MCRH Platform',
        layout: 'full',
        description: 'Plateforme de gestion MCRH'
    },
    component: () => import('@/layouts/full/FullLayout.vue'),
    children: [
        {
            path: '',
            redirect: 'home'
        },
        {
            path: 'home',
            name: 'Home',
            component: () => import('@/views/home/index.vue'),
            meta: {
                title: 'Accueil | MCRH Conseil'
            }
        },
        // Routes pour MCRH Conseil
        {
            path: 'mcrh-conseil',
            children: [
                {
                    path: '',
                    name: 'MCRHConseilIndex',
                    component: () => import('@/views/pages/mcrh-conseil/index.vue'),
                    meta: {
                        title: 'MCRH Conseil'
                    }
                },
                {
                    path: 'a-propos',
                    name: 'APropos',
                    component: () => import('@/views/pages/mcrh-conseil/a-propos.vue'),
                    meta: {
                        title: 'À propos | MCRH Conseil'
                    }
                },
                {
                    path: 'notre-equipe',
                    name: 'NotreEquipe',
                    component: () => import('@/views/pages/mcrh-conseil/notre-equipe.vue'),
                    meta: {
                        title: 'Notre équipe | MCRH Conseil'
                    }
                }
            ]
        },
        // Routes pour Le carnet RH
        {
            path: 'carnet-rh',
            children: [
                {
                    path: 'articles',
                    name: 'Articles',
                    component: () => import('@/views/pages/carnet-rh/articles.vue'),
                    meta: {
                        title: 'Articles | MCRH Conseil'
                    }
                },
                {
                    path: 'carnet-rhindex',
                    name: 'CarnetRHIndex',
                    component: () => import('@/views/pages/carnet-rh/index.vue'),
                    meta: {
                        title: 'Le carnet RH | MCRH Conseil'
                    }
                },
                {
                    path: 'analyses',
                    name: 'AnalyseTendances',
                    component: () => import('@/views/pages/carnet-rh/analyses.vue'),
                    meta: {
                        title: 'Analyses | MCRH Conseil'
                    }
                },
                {
                    path: 'articles/:slug',
                    name: 'ArticleDetail',
                    component: () => import('@/views/pages/carnet-rh/article-detail.vue'),
                    meta: {
                        title: 'Article | MCRH Conseil'
                    }
                },
                {
                    path: 'analyses/:slug',
                    name: 'AnalyseDetail',
                    component: () => import('@/views/pages/carnet-rh/analyse-detail.vue'),
                    meta: {
                        title: 'Analyse | MCRH Conseil'
                    }
                }
            ]
        },
        // Routes pour Nos ressources
        {
            path: 'ressources',
            children: [
                {
                    path: '',
                    name: 'RessourcesIndex',
                    component: () => import('@/views/pages/ressources/index.vue'),
                    meta: {
                        title: 'Nos ressources | MCRH Conseil'
                    }
                },
                {
                    path: 'outils',
                    name: 'Outils',
                    component: () => import('@/views/pages/ressources/outils.vue'),
                    meta: {
                        title: 'Outils | MCRH Conseil'
                    }
                },
                {
                    path: 'templates',
                    name: 'Templates',
                    component: () => import('@/views/pages/ressources/templates.vue'),
                    meta: {
                        title: 'Templates | MCRH Conseil'
                    }
                },
                {
                    path: 'boite-a-outils',
                    name: 'BoiteAOutils',
                    component: () => import('@/views/pages/ressources/boite-a-outils.vue'),
                    meta: {
                        title: 'Boîte à outils | MCRH Conseil'
                    }
                },
                {
                    path: 'atelier-mindset',
                    name: 'AtelierMindset',
                    component: () => import('@/views/pages/ressources/atelier-mindset.vue'),
                    meta: {
                        title: 'Atelier du Mindset | MCRH Conseil'
                    }
                }
            ]
        },
        // Routes pour Nos offres
        {
            path: 'offres',
            children: [
                {
                    path: '',
                    name: 'OffresIndex',
                    component: () => import('@/views/pages/offres/index.vue'),
                    meta: {
                        title: 'Nos offres | MCRH Conseil'
                    }
                },
                {
                    path: 'formations',
                    name: 'Formations',
                    component: () => import('@/views/pages/offres/formations.vue'),
                    meta: {
                        title: 'Formations | MCRH Conseil'
                    }
                },
                {
                    path: 'conseil',
                    name: 'Conseil',
                    component: () => import('@/views/pages/offres/conseil.vue'),
                    meta: {
                        title: 'Conseil | MCRH Conseil'
                    }
                },
                {
                    path: 'coaching',
                    name: 'Coaching',
                    component: () => import('@/views/pages/offres/coaching.vue'),
                    meta: {
                        title: 'Coaching | MCRH Conseil'
                    }
                },
                {
                    path: 'interventions',
                    name: 'Interventions',
                    component: () => import('@/views/pages/offres/interventions.vue'),
                    meta: {
                        title: 'Interventions | MCRH Conseil'
                    }
                }
            ]
        },
        // Routes pour les inspirations (top bar)
        {
            path: 'inspirations',
            children: [
                {
                    path: 'portraits',
                    name: 'PortraitsInspirants',
                    component: () => import('@/views/pages/inspirations/portraits.vue'),
                    meta: {
                        title: 'Portraits inspirants | MCRH Conseil'
                    }
                },
                {
                    path: 'livres-podcasts-ted',
                    name: 'LivresPodcastsTED',
                    component: () => import('@/views/pages/inspirations/livres-podcasts-ted.vue'),
                    meta: {
                        title: 'Livres, Podcasts & TED Talks | MCRH Conseil'
                    }
                },
                // Routes spécialisées pour chaque catégorie
                {
                    path: 'livres',
                    name: 'Livres',
                    component: () => import('@/views/pages/inspirations/livres.vue'),
                    meta: {
                        title: 'Livres | MCRH Conseil'
                    }
                },
                {
                    path: 'livres/:slug',
                    name: 'LivreDetail',
                    component: () => import('@/views/pages/inspirations/livre-detail.vue'),
                    meta: {
                        title: 'Livre | MCRH Conseil'
                    }
                },
                {
                    path: 'podcasts',
                    name: 'Podcasts',
                    component: () => import('@/views/pages/inspirations/podcasts-new.vue'),
                    meta: {
                        title: 'Podcasts | MCRH Conseil'
                    }
                },
                {
                    path: 'podcasts/:slug',
                    name: 'PodcastDetail',
                    component: () => import('@/views/pages/inspirations/podcast-detail.vue'),
                    meta: {
                        title: 'Podcast | MCRH Conseil'
                    }
                },
                {
                    path: 'teds/:slug',
                    name: 'TedDetail',
                    component: () => import('@/views/pages/inspirations/ted-detail.vue'),
                    meta: {
                        title: 'TED Talk | MCRH Conseil'
                    }
                },
                {
                    path: 'ted-talks',
                    name: 'TEDTalks',
                    component: () => import('@/views/pages/inspirations/ted-talks-new.vue'),
                    meta: {
                        title: 'TED Talks | MCRH Conseil'
                    }
                }
            ]
        },
        // Page de contact
        {
            path: 'contact',
            name: 'Contact',
            component: () => import('@/views/pages/contact/index.vue'),
            meta: {
                title: 'Contact | MCRH Conseil'
            }
        },
        // ...existing code...
    ]
};

export default MainRoutes;
