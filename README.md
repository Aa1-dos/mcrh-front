# README - Frontend Vue.js MCRH
## À propos

MCRH Conseil est une plateforme web dédiée aux ressources humaines et au développement professionnel. Notre mission est d'accompagner les professionnels RH et managers dans leur évolution avec des contenus de qualité, des outils pratiques et des approches innovantes.

## Technologies

- **Frontend** : Vue 3 + TypeScript
- **UI Framework** : Vuetify 3
- **Router** : Vue Router
- **Build Tool** : Vite
- **Styles** : SCSS

## 🎨 Installation et Configuration Frontend

### Prérequis
- **Node.js** 18+
- **NPM** ou **Yarn**
- **Backend Directus** en fonctionnement sur `http://localhost:8055`

### 1. Structure du Projet Frontend

```
mcrh-frontend/
├── src/
│   ├── components/           # Composants Vue réutilisables
│   │   ├── articles/        # Composants spécifiques aux articles
│   │   ├── navigation/      # Menu et navigation
│   │   └── ui/              # Composants UI génériques
│   ├── composables/         # Logique réutilisable Vue 3
│   │   ├── useArticles.ts   # Gestion des articles
│   │   ├── useAuth.ts       # Authentification
│   │   └── useMedia.ts      # Gestion des médias
│   ├── stores/              # Store Pinia pour l'état global
│   │   ├── ArticlesStore.ts # État des articles
│   │   └── AuthStore.ts     # État d'authentification
│   ├── router/              # Configuration des routes
│   │   ├── index.ts         # Router principal
│   │   └── guards/          # Guards de navigation
│   ├── config/              # Configuration
│   │   ├── directus.ts      # Config Directus
│   │   └── api.ts           # Routes API
│   ├── views/               # Pages principales
│   │   ├── articles/        # Pages des articles
│   │   ├── categories/      # Pages des catégories
│   │   └── auth/            # Pages d'authentification
│   └── layouts/             # Layouts de l'application
├── public/                  # Assets publics
├── package.json             # Dépendances et scripts
├── vite.config.ts          # Configuration Vite
├── .env                    # Variables d'environnement
└── README.md               # Cette documentation
```

### 2. Installation

```bash
# Cloner le projet frontend
git clone <your-frontend-repo> mcrh-frontend
cd mcrh-frontend

# Installer les dépendances
npm install

# Copier la configuration
cp .env.example .env

# Démarrer en développement
npm run dev
```

### 3. Configuration (.env)

Créer le fichier `.env` :

```env
####################################################################################################
### MCRH FRONTEND VUE.JS CONFIGURATION
####################################################################################################

# API Backend Directus
VITE_DIRECTUS_URL=http://localhost:8055

# Application
VITE_APP_TITLE="MCRH - Management Conseil Ressources Humaines"
VITE_APP_URL=http://localhost:5180
VITE_APP_DESCRIPTION="Plateforme de contenus RH et gestion des talents"

# API Legacy (si utilisée)
VITE_API=http://127.0.0.1:8000

# Environnement
NODE_ENV=development
VITE_ENV=development

# Analytics (Production)
# VITE_GA_ID=GA-XXXXXXXXX
# VITE_GTM_ID=GTM-XXXXXXX

# Features Flags
VITE_ENABLE_PWA=false
VITE_ENABLE_ANALYTICS=false
```

### 4. Configuration Directus (src/config/directus.ts)

```typescript
import { createDirectus, rest, authentication } from '@directus/sdk';

// Configuration de base
export const directusUrl = import.meta.env.VITE_DIRECTUS_URL || 'http://localhost:8055';

// Instance Directus avec authentification
export const directus = createDirectus(directusUrl)
  .with(rest())
  .with(authentication());

// Credentials par défaut (développement uniquement)
export const DEFAULT_CREDENTIALS = {
  email: 'admin@mcrh.com',
  password: '123456'
};

// Types TypeScript
export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  featured_image?: string;
  cover?: string;
  category?: Category;
  author?: Author;
  published_date: string;
  reading_time?: number;
  views: number;
  status: 'published' | 'draft' | 'archived';
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  status: 'published' | 'draft';
}

export interface Author {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  bio?: string;
  avatar?: string;
  status: 'published' | 'draft';
}

// Endpoints API
export const DIRECTUS_ENDPOINTS = {
  // Collections
  articles: '/items/articles',
  categories: '/items/categories',
  authors: '/items/authors',
  tags: '/items/tags',
  
  // Authentification
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    me: '/users/me'
  },
  
  // Fichiers
  files: '/files',
  assets: '/assets'
};
```

### 5. Composables Principaux

#### useArticles.ts
```typescript
// src/composables/useArticles.ts
import { ref, computed } from 'vue';
import { directus, directusUrl, DEFAULT_CREDENTIALS } from '@/config/directus';
import type { Article, Category, Author } from '@/config/directus';

export function useArticles() {
  // État réactif
  const articles = ref<Article[]>([]);
  const categories = ref<Category[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Computed properties
  const publishedArticles = computed(() => 
    articles.value.filter(article => article.status === 'published')
  );

  const recentArticles = computed(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return publishedArticles.value
      .filter(article => new Date(article.published_date) >= thirtyDaysAgo)
      .sort((a, b) => new Date(b.published_date).getTime() - new Date(a.published_date).getTime());
  });

  // Authentification
  const authenticate = async (): Promise<string | null> => {
    try {
      const result = await directus.login(DEFAULT_CREDENTIALS);
      return result?.access_token || null;
    } catch (error) {
      console.warn('Authentification échouée:', error);
      return null;
    }
  };

  // Récupération des articles
  const fetchArticles = async () => {
    loading.value = true;
    error.value = null;

    try {
      const token = await authenticate();
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(
        `${directusUrl}/items/articles?fields=*,category.*,author.*&filter[status][_eq]=published&sort=-published_date`,
        { headers }
      );

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      articles.value = data.data || [];

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement';
      error.value = errorMessage;
      console.error('Erreur fetchArticles:', err);
    } finally {
      loading.value = false;
    }
  };

  // Article par slug
  const fetchArticleBySlug = async (slug: string): Promise<Article | null> => {
    try {
      const token = await authenticate();
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(
        `${directusUrl}/items/articles?fields=*,category.*,author.*&filter[slug][_eq]=${slug}&filter[status][_eq]=published`,
        { headers }
      );

      if (response.ok) {
        const data = await response.json();
        return data.data?.[0] || null;
      }
    } catch (err) {
      console.error('Erreur fetchArticleBySlug:', err);
    }
    
    return null;
  };

  // Gestion des images
  const getImageUrl = (imageId: string | null, width?: number, height?: number): string | null => {
    if (!imageId) return null;
    
    // URL YouTube
    if (imageId.includes('youtube.com') || imageId.includes('youtu.be')) {
      return getYoutubeThumbnail(imageId);
    }
    
    // UUID Directus
    if (imageId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      let url = `${directusUrl}/assets/${imageId}`;
      
      // Paramètres de transformation
      if (width || height) {
        const params = new URLSearchParams();
        if (width) params.append('width', String(width));
        if (height) params.append('height', String(height));
        params.append('fit', 'cover');
        url += `?${params.toString()}`;
      }
      
      return url;
    }
    
    // URL complète
    if (imageId.startsWith('http')) {
      return imageId;
    }
    
    return `${directusUrl}/assets/${imageId}`;
  };

  // Thumbnail YouTube
  const getYoutubeThumbnail = (url: string): string => {
    const videoId = extractYouTubeVideoId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '';
  };

  // Extraction ID YouTube
  const extractYouTubeVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/shorts\/([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    
    return null;
  };

  // Incrémenter les vues
  const incrementViews = async (articleId: string) => {
    try {
      const token = await authenticate();
      if (!token) return;

      await fetch(`${directusUrl}/items/articles/${articleId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          views: { _increment: 1 }
        })
      });
    } catch (err) {
      console.warn('Erreur incrementViews:', err);
    }
  };

  return {
    // État
    articles,
    categories,
    loading,
    error,
    
    // Computed
    publishedArticles,
    recentArticles,
    
    // Méthodes
    fetchArticles,
    fetchArticleBySlug,
    incrementViews,
    getImageUrl,
    getYoutubeThumbnail,
    authenticate
  };
}
```

### 6. Composants Principaux

#### ArticleCard.vue
```vue
<template>
  <v-card
    class="article-card"
    elevation="2"
    hover
    @click="navigateToArticle"
  >
    <!-- Image -->
    <v-img
      v-if="imageUrl"
      :src="imageUrl"
      height="200"
      cover
      class="article-image"
    >
      <div class="image-overlay">
        <v-chip
          v-if="article.category"
          :color="article.category.color || 'primary'"
          size="small"
          class="category-chip"
        >
          {{ article.category.name }}
        </v-chip>
      </div>
    </v-img>

    <!-- Contenu -->
    <v-card-text>
      <h3 class="article-title">{{ article.title }}</h3>
      
      <p v-if="article.excerpt" class="article-excerpt">
        {{ article.excerpt }}
      </p>

      <!-- Métadonnées -->
      <div class="article-meta">
        <div class="meta-item">
          <v-icon size="small">mdi-calendar</v-icon>
          {{ formatDate(article.published_date) }}
        </div>
        
        <div v-if="article.reading_time" class="meta-item">
          <v-icon size="small">mdi-clock-outline</v-icon>
          {{ article.reading_time }} min
        </div>
        
        <div class="meta-item">
          <v-icon size="small">mdi-eye</v-icon>
          {{ article.views || 0 }} vues
        </div>
      </div>

      <!-- Auteur -->
      <div v-if="article.author" class="author-info">
        <v-avatar size="24">
          <v-img
            v-if="article.author.avatar"
            :src="getImageUrl(article.author.avatar)"
            :alt="authorName"
          />
          <v-icon v-else>mdi-account</v-icon>
        </v-avatar>
        <span class="author-name">{{ authorName }}</span>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useArticles } from '@/composables/useArticles';
import type { Article } from '@/config/directus';

// Props
interface Props {
  article: Article;
}

const props = defineProps<Props>();

// Composables
const router = useRouter();
const { getImageUrl } = useArticles();

// Computed
const imageUrl = computed(() => {
  return getImageUrl(props.article.cover || props.article.featured_image, 400, 200);
});

const authorName = computed(() => {
  if (!props.article.author) return '';
  return `${props.article.author.first_name} ${props.article.author.last_name}`;
});

// Méthodes
const navigateToArticle = () => {
  router.push(`/articles/${props.article.slug}`);
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
</script>

<style scoped>
.article-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.article-card:hover {
  transform: translateY(-4px);
}

.image-overlay {
  position: absolute;
  top: 8px;
  right: 8px;
}

.category-chip {
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.9) !important;
}

.article-title {
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.4;
  margin-bottom: 8px;
  color: #1a1a1a;
}

.article-excerpt {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #888;
  font-size: 0.8rem;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.author-name {
  font-size: 0.85rem;
  color: #555;
  font-weight: 500;
}
</style>
```

### 7. Pages Principales

#### Articles List (views/articles/ArticlesList.vue)
```vue
<template>
  <div class="articles-page">
    <!-- Header -->
    <div class="page-header">
      <h1>Articles MCRH</h1>
      <p>Découvrez nos derniers contenus sur la gestion des ressources humaines</p>
    </div>

    <!-- Filtres -->
    <div class="filters-section">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="searchQuery"
            label="Rechercher un article"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            clearable
            @input="debounceSearch"
          />
        </v-col>
        
        <v-col cols="12" md="6">
          <v-select
            v-model="selectedCategory"
            :items="categoryOptions"
            label="Filtrer par catégorie"
            prepend-inner-icon="mdi-filter"
            variant="outlined"
            clearable
          />
        </v-col>
      </v-row>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-section">
      <v-progress-circular indeterminate color="primary" size="64" />
      <p>Chargement des articles...</p>
    </div>

    <!-- Erreur -->
    <v-alert v-if="error" type="error" class="mb-6">
      {{ error }}
      <template #append>
        <v-btn @click="fetchArticles" variant="text">Réessayer</v-btn>
      </template>
    </v-alert>

    <!-- Articles -->
    <div v-if="!loading && filteredArticles.length > 0" class="articles-grid">
      <v-row>
        <v-col
          v-for="article in paginatedArticles"
          :key="article.id"
          cols="12"
          sm="6"
          lg="4"
        >
          <ArticleCard :article="article" />
        </v-col>
      </v-row>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination-section">
        <v-pagination
          v-model="currentPage"
          :length="totalPages"
          :total-visible="7"
        />
      </div>
    </div>

    <!-- Aucun résultat -->
    <div v-else-if="!loading" class="no-results">
      <v-icon size="64" color="grey">mdi-file-document-outline</v-icon>
      <h3>Aucun article trouvé</h3>
      <p>Essayez de modifier vos critères de recherche</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useArticles } from '@/composables/useArticles';
import ArticleCard from '@/components/articles/ArticleCard.vue';

// Composables
const { 
  articles, 
  categories, 
  loading, 
  error, 
  fetchArticles, 
  fetchCategories 
} = useArticles();

// État local
const searchQuery = ref('');
const selectedCategory = ref<string | null>(null);
const currentPage = ref(1);
const itemsPerPage = 12;

// Computed
const categoryOptions = computed(() => [
  { title: 'Toutes les catégories', value: null },
  ...categories.value.map(cat => ({
    title: cat.name,
    value: cat.slug
  }))
]);

const filteredArticles = computed(() => {
  let filtered = [...articles.value];

  // Filtrage par recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(article => 
      article.title.toLowerCase().includes(query) ||
      article.excerpt?.toLowerCase().includes(query) ||
      article.category?.name.toLowerCase().includes(query)
    );
  }

  // Filtrage par catégorie
  if (selectedCategory.value) {
    filtered = filtered.filter(article => 
      article.category?.slug === selectedCategory.value
    );
  }

  return filtered;
});

const totalPages = computed(() => 
  Math.ceil(filteredArticles.value.length / itemsPerPage)
);

const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredArticles.value.slice(start, end);
});

// Méthodes
let searchTimeout: NodeJS.Timeout;
const debounceSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentPage.value = 1; // Reset pagination
  }, 300);
};

// Watchers
watch([selectedCategory], () => {
  currentPage.value = 1; // Reset pagination on filter change
});

// Lifecycle
onMounted(async () => {
  await Promise.all([
    fetchArticles(),
    fetchCategories()
  ]);
});
</script>

<style scoped>
.articles-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 10px;
}

.page-header p {
  font-size: 1.1rem;
  color: #666;
}

.filters-section {
  margin-bottom: 30px;
}

.loading-section {
  text-align: center;
  padding: 60px 20px;
}

.loading-section p {
  margin-top: 20px;
  color: #666;
}

.articles-grid {
  margin-bottom: 40px;
}

.pagination-section {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.no-results {
  text-align: center;
  padding: 60px 20px;
}

.no-results h3 {
  margin: 20px 0 10px;
  color: #1a1a1a;
}

.no-results p {
  color: #666;
}
</style>
```

### 8. Configuration du Router

```typescript
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { title: 'Accueil - MCRH' }
  },
  {
    path: '/articles',
    name: 'Articles',
    component: () => import('@/views/articles/ArticlesList.vue'),
    meta: { title: 'Articles - MCRH' }
  },
  {
    path: '/articles/:slug',
    name: 'ArticleDetail',
    component: () => import('@/views/articles/ArticleDetail.vue'),
    meta: { title: 'Article - MCRH' }
  },
  {
    path: '/categories/:slug',
    name: 'CategoryArticles',
    component: () => import('@/views/categories/CategoryArticles.vue'),
    meta: { title: 'Catégorie - MCRH' }
  },
  // Routes TED Talks et multimédia
  {
    path: '/inspirations',
    name: 'Inspirations',
    component: () => import('@/views/Inspirations.vue'),
    meta: { title: 'Inspirations - MCRH' }
  },
  {
    path: '/inspirations/ted/:slug',
    name: 'TedDetail',
    component: () => import('@/views/inspirations/TedDetail.vue'),
    meta: { title: 'TED Talk - MCRH' }
  },
  {
    path: '/inspirations/podcast/:slug',
    name: 'PodcastDetail',
    component: () => import('@/views/inspirations/PodcastDetail.vue'),
    meta: { title: 'Podcast - MCRH' }
  }
];

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

// Mise à jour du titre de page
router.afterEach((to) => {
  const title = to.meta?.title as string;
  if (title) {
    document.title = title;
  }
});

export default router;
```

### 9. Scripts NPM

Dans `package.json` :

```json
{
  "name": "mcrh-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --port 5180",
    "build": "vue-tsc --noEmit && vite build",
    "preview": "vite preview --port 4173",
    "lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx --fix",
    "type-check": "vue-tsc --noEmit",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "coverage": "vitest run --coverage"
  },
  "dependencies": {
    "@directus/sdk": "^20.0.1",
    "@vueuse/core": "^13.6.0",
    "vue": "^3.5.13",
    "vue-router": "^4.5.0",
    "pinia": "^3.0.1",
    "vuetify": "^3.7.18",
    "axios": "^1.8.4",
    "date-fns": "^2.29.3",
    "dompurify": "^3.2.6"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.2.3",
    "@vue/tsconfig": "^0.6.0",
    "typescript": "^5.7.3",
    "vite": "^6.0.7",
    "vue-tsc": "^2.2.6",
    "vitest": "^2.1.0",
    "eslint": "^8.57.0"
  }
}
```

### 10. Configuration Vite

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    vue({
      template: {
        transformAssetUrls: {
          base: null,
          includeAbsolute: false,
        },
      },
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5180,
    host: true,
    cors: true
  },
  build: {
    target: 'esnext',
    sourcemap: true
  },
  define: {
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
  }
});
```

### 11. Démarrage et Développement

```bash
# Installer les dépendances
npm install

# Démarrer en développement
npm run dev

# Build pour production  
npm run build

# Preview de production
npm run preview

# Vérification des types
npm run type-check

# Linting
npm run lint
```

### 12. Intégration avec le Backend

#### Vérification de la Connexion
```bash
# Test de la connexion au backend
curl http://localhost:8055/server/health

# Test de l'API articles
curl "http://localhost:8055/items/articles?limit=1"
```

#### Configuration CORS
Le frontend doit être configuré dans le CORS du backend :

```env
# Dans mcrh-backend/.env
CORS_ORIGIN="http://localhost:5180,http://localhost:3000"
```

### 13. Fonctionnalités Spécifiques

#### Support YouTube
Le frontend détecte automatiquement les URLs YouTube dans les champs `featured_image` ou `cover` et :
- Génère les thumbnails automatiquement
- Affiche un player intégré
- Extrait les IDs vidéo pour les embeds

#### Responsive Design
- Mobile-first avec Vuetify
- Grille adaptative pour tous les écrans
- Navigation optimisée mobile

#### Performance
- Lazy loading des images
- Code splitting par route
- Optimisation des requêtes API

### 14. Production et Déploiement

#### Variables de production (.env.production)
```env
VITE_DIRECTUS_URL=https://api.mcrh.com
VITE_APP_URL=https://mcrh.com
VITE_ENV=production
```

#### Build et déploiement
```bash
# Build de production
npm run build

# Les fichiers sont dans dist/
# À déployer sur votre serveur web
```

### 15. Troubleshooting Frontend

#### Backend inaccessible
```bash
# Vérifier que le backend fonctionne
curl http://localhost:8055

# Vérifier la configuration
cat .env | grep VITE_DIRECTUS_URL
```

#### Erreurs CORS
```bash
# Vérifier la configuration CORS du backend
grep CORS ../mcrh-backend/.env
```

#### Images ne s'affichent pas
- Vérifier que le backend est accessible
- Vérifier les IDs des images dans la base
- Tester les URLs directement

---

## 🔗 Liens Utiles

- **Application**: http://localhost:5180
- **Backend API**: http://localhost:8055
- **Documentation Vue.js**: https://vuejs.org/
- **Documentation Vuetify**: https://vuetifyjs.com/
- **Documentation Directus SDK**: https://docs.directus.io/reference/sdk/

## 🆘 Support

En cas de problème :

1. Vérifier que le backend fonctionne : `curl http://localhost:8055`
2. Vérifier les logs de la console : F12 → Console
3. Vérifier les requêtes réseau : F12 → Network
4. Redémarrer le serveur de développement : `npm run dev`

---

**Ports par défaut:**
- **Frontend**: http://localhost:5180
- **Backend**: http://localhost:8055
