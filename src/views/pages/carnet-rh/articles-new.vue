<template>
  <v-app>
    <NavBars v-model:drawer="drawer" />

    <v-navigation-drawer v-model="drawer" temporary app location="right" width="300">
      <!-- Contenu du menu mobile -->
    </v-navigation-drawer>

    <v-main>
      <HeroSection>
        <!-- En-tête de page avec titre -->
        <section class="pt-10 position-relative">
          <v-container class="nav-container">
            <v-row align="center" justify="center">
              <v-col cols="12" class="text-center">
                <!-- Fil d'Ariane -->
                <Breadcrumb class="breadcrumb-centered" />
                <h1 class="text-h2 font-weight-bold mb-2">
                  <span class="text-primary">Le Carnet RH</span>
                  <span class="text-accent"> - </span>
                  <span class="text-accent">Comprendre & Agir</span>
                </h1>
                <p class="text-subtitle-1 font-weight-regular text-grey-darken-1 mb-8 mx-auto"
                  style="max-width: 700px; font-size: 18px;">
                  Les dernières publications éditoriales pour comprendre et décrypter les enjeux RH
                </p>
              </v-col>
            </v-row>
          </v-container>
        </section>
        <!-- Filtres de catégories -->
        <section class="pb-4 pt-2">
          <v-container class="nav-container">
            <div class="d-flex justify-center flex-wrap">
              <v-btn variant="tonal" color="primary" class="rounded-pill mx-1 my-1"
                :class="{ 'active-filter': activeTab === 'analyses' }" @click="activeTab = 'analyses'">
                Articles d'analyse
              </v-btn>
              <v-btn variant="tonal" color="primary" class="rounded-pill mx-1 my-1"
                :class="{ 'active-filter': activeTab === 'decryptages' }" @click="activeTab = 'decryptages'">
                Décryptage de tendances RH
              </v-btn>
              <v-btn variant="tonal" color="primary" class="rounded-pill mx-1 my-1"
                :class="{ 'active-filter': activeTab === 'regards' }" @click="activeTab = 'regards'">
                Regards croisés
              </v-btn>
            </div>
          </v-container>
        </section>
      </HeroSection>

      <!-- Barre de filtres et recherche -->
      <section class="py-4">
        <v-container class="nav-container">
          <div class="d-flex flex-wrap align-center justify-space-between">
            <div class="d-flex flex-wrap">
              <!-- Menu des catégories -->
              <v-menu>
                <template v-slot:activator="{ props }">
                  <v-btn variant="outlined" color="primary" class="rounded-pill mr-3 mb-2 mb-sm-0" v-bind="props"
                    prepend-icon="mdi-filter-variant">
                    Filtrer
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item @click="filterByCategory(null)">
                    <v-list-item-title>Tous les articles</v-list-item-title>
                  </v-list-item>
                  <v-list-item v-for="category in categories" :key="category.id" @click="filterByCategory(category.slug ?? null)">
                    <v-list-item-title>{{ category.name }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>

              <!-- Menu de tri par date -->
              <v-menu>
                <template v-slot:activator="{ props }">
                  <v-btn variant="outlined" color="primary" class="rounded-pill" v-bind="props"
                    prepend-icon="mdi-calendar">
                    Date de publication
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item @click="sortOrder = 'newest'">
                    <v-list-item-title>Plus récents d'abord</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="sortOrder = 'oldest'">
                    <v-list-item-title>Plus anciens d'abord</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="sortOrder = 'popular'">
                    <v-list-item-title>Plus populaires</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>

            <!-- Champ de recherche -->
            <v-text-field 
              v-model="searchQuery" 
              prepend-inner-icon="mdi-magnify" 
              placeholder="Rechercher un article" 
              variant="outlined"
              density="comfortable" 
              hide-details 
              class="search-field mt-2 mt-sm-0" 
              @input="onSearchInput" 
            />
          </div>
        </v-container>
      </section>

      <!-- État de chargement -->
      <section v-if="loading" class="py-8">
        <v-container class="nav-container">
          <div class="text-center">
            <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
            <p class="mt-4">Chargement des articles...</p>
          </div>
        </v-container>
      </section>
      
      <!-- État d'erreur -->
      <section v-else-if="error" class="py-8">
        <v-container class="nav-container">
          <v-card flat class="pa-8 text-center">
            <v-icon color="error" size="64">mdi-alert-circle</v-icon>
            <h3 class="text-h5 mt-4 mb-2">Erreur de chargement</h3>
            <p class="text-grey-darken-1 mb-4">{{ error }}</p>
            <v-btn color="primary" @click="loadArticles">Réessayer</v-btn>
          </v-card>
        </v-container>
      </section>

      <!-- Liste des articles (seulement si pas d'erreur et pas en chargement) -->
      <section v-else class="py-6">
        <v-container class="nav-container">
          <v-row v-if="filteredArticles.length > 0" style="width: 100%; overflow: hidden;">
            <!-- Article principal -->
            <v-col cols="12" md="9">
              <v-card v-if="featuredArticle" elevation="0" class="rounded-lg overflow-hidden article-card" @click="navigateToArticle(featuredArticle)">
                <v-img :src="getArticleImageUrl(featuredArticle)" cover class="rounded-lg article-image">
                  <div class="article-overlay d-flex flex-column justify-end h-100">
                    <div class="pa-6">
                      <div class="d-flex flex-column mb-2">
                        <h3 class="text-h6 font-weight-bold text-white mb-2">
                          Articles
                          <span class="bg-accent mx-2"
                            style="width: 8px; height: 8px; opacity: 50%; border-radius: 50%; display: inline-block;"></span>
                          {{ getCategoryName(featuredArticle.category) }}
                        </h3>
                        <h2 class="h2-article-title mb-2 text-white">
                          {{ featuredArticle.title }}
                        </h2>
                        <p class="text-body-6 text-white">
                          {{ featuredArticle.excerpt }}
                        </p>
                        <div class="text-caption text-white mt-2">
                          {{ formatDate(featuredArticle.published_date || featuredArticle.date_created) }}
                          • {{ featuredArticle.reading_time || 5 }} min de lecture
                        </div>
                      </div>
                    </div>
                  </div>
                </v-img>
              </v-card>
            </v-col>

            <!-- Articles secondaires côte à côte -->
            <v-col cols="12" md="3">
              <v-row>
                <v-col cols="12" v-for="article in recentArticles.slice(0, 2)" :key="article.id">
                  <v-card class="article-card" flat @click="navigateToArticle(article)">
                    <div class="d-flex flex-column rounded-lg">
                      <v-img :src="getArticleImageUrl(article)" cover height="160"></v-img>
                      <v-card-text class="px-0 pt-4">
                        <div class="d-flex align-center mb-2">
                          <span class="text-caption text-grey-darken-1 mr-2">Carnet RH</span>
                          <v-icon size="small" class="text-grey-darken-1 mr-2">mdi-circle-small</v-icon>
                          <span class="text-caption text-grey-darken-1">{{ getCategoryName(article.category) }}</span>
                        </div>
                        <h3 class="text-h6 font-weight-bold mb-1">
                          {{ article.title }}
                        </h3>
                        <p class="text-caption text-grey-darken-1">
                          Publié le {{ formatDate(article.published_date || article.date_created) }}
                        </p>
                      </v-card-text>
                    </div>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <!-- État vide -->
          <div v-if="filteredArticles.length === 0" class="text-center py-8">
            <v-card flat class="pa-8">
              <v-icon color="grey-lighten-1" size="64">mdi-file-document-outline</v-icon>
              <h3 class="text-h5 mt-4 mb-2">Aucun article trouvé</h3>
              <p class="text-grey-darken-1">
                {{ searchQuery ? 'Aucun article ne correspond à votre recherche.' : 'Aucun article disponible dans cette catégorie.' }}
              </p>
              <v-btn v-if="searchQuery || selectedCategory" color="primary" variant="outlined" @click="resetFilters" class="mt-4">
                Voir tous les articles
              </v-btn>
            </v-card>
          </div>
        </v-container>
      </section>

      <!-- Articles Section -->
      <section v-if="!loading && !error && filteredArticles.length > 0" id="articles" class="mb-16">
        <div class="d-flex justify-space-between align-center mx-6 pa-4 mb-4 text-h6"
          style="height: 48px; background-color: #F4F4F5; border-radius: 8px;">
          <span>Publiées dans la semaine</span>
          <div class="">
            <v-btn icon="mdi-chevron-double-down" density="comfortable" variant="plain" class="bg-primary mr-2"
              color="white"></v-btn>
          </div>
        </div>
        <v-container>
          <v-row>
            <v-col v-for="(article, index) in paginatedArticles.slice(0, 3)" :key="article.id" cols="12" md="4">
              <v-card class="h-100 article-card" flat @click="navigateToArticle(article)">
                <v-img :src="getArticleImageUrl(article)" height="200" cover class="rounded-t-lg"></v-img>
                <v-card-text class="pa-4">
                  <div class="text-overline text-accent-text mb-1 d-flex align-center">
                    Articles
                    <span class="bg-accent mx-2"
                      style="width: 8px; height: 8px; opacity: 50%; border-radius: 50%; display: inline-block;"></span>
                    {{ getCategoryName(article.category) }}
                  </div>
                  <div class="text-h5 font-weight-bold mb-2">{{ article.title }}</div>
                  <div class="text-body-2 text-grey-darken-1">{{ article.excerpt }}</div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <div v-if="paginatedArticles.length > 3" class="d-flex justify-space-between align-center mt-6 mx-6 pa-4 mb-4 text-h6"
            style="height: 48px; background-color: #F4F4F5; border-radius: 8px;">
            <span>Autres articles</span>
            <div class="">
              <v-btn icon="mdi-chevron-double-down" density="comfortable" variant="plain" class="bg-primary mr-2"
                color="white"></v-btn>
            </div>
          </div>
          <v-row v-if="paginatedArticles.length > 3" class="mt-6">
            <v-col v-for="article in paginatedArticles.slice(3, 6)" :key="article.id" cols="12" md="4">
              <v-card class="h-100 article-card" flat @click="navigateToArticle(article)">
                <v-img :src="getArticleImageUrl(article)" height="200" cover class="rounded-t-lg"></v-img>
                <v-card-text class="pa-4">
                  <div class="text-overline text-accent-text mb-1">
                    Articles 
                    <span class="bg-accent mx-2"
                      style="width: 8px; height: 8px; opacity: 50%; border-radius: 50%; display: inline-block;"></span>
                    {{ getCategoryName(article.category) }}
                  </div>
                  <div class="text-h5 font-weight-bold mb-2">{{ article.title }}</div>
                  <div class="text-body-2 text-grey-darken-1">{{ article.excerpt }}</div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <!-- Pagination -->
          <div v-if="totalPagesComputed > 1" class="d-flex justify-center mt-10">
            <v-pagination v-model="currentPage" :length="totalPagesComputed" rounded="circle"></v-pagination>
          </div>
        </v-container>
      </section>

      <NewsletterSection :newsIconImage="news1Image" :illustrationImage="news2Image" class="mt-16" />

      <ContactSection :mainIllustration="contactIllustration" :secondaryIllustration="anotherIllustration"
        :decorativeImage="contactTitle" />

      <FooterSection />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import NavBars from '@/components/NavBars.vue';
import HeroSection from '@/components/HeroSection.vue';
import FooterSection from '@/components/FooterSection.vue';
import Breadcrumb from '@/components/Breadcrumb.vue';
import NewsletterSection from '@/components/NewsletterSection.vue';
import ContactSection from '@/components/ContactSection.vue';
import { useArticles } from '@/composables/useArticles';

// Import images
import news1Image from '@/assets/images/backgrounds/newsletter-bg.png';
import news2Image from '@/assets/images/backgrounds/newsletter-bg-2.png';
import contactIllustration from '@/assets/images/backgrounds/bg-contact.png';
import anotherIllustration from '@/assets/images/backgrounds/form-text.png';
import contactTitle from '@/assets/images/backgrounds/bgcontact-title.png';
import defaultArticleImage from '@/assets/images/articles/art-1.png';

const router = useRouter();
const drawer = ref(false);

// État des tabs
const activeTab = ref('analyses');

// Utilisation du composable articles
const {
  articles,
  categories,
  loading,
  error,
  currentPage,
  totalPages,
  totalItems,
  featuredArticles,
  fetchArticles,
  fetchCategories,
  setPage
} = useArticles();

// État local
const searchQuery = ref('');
const selectedCategory = ref<string | null>(null);
const sortOrder = ref<'newest' | 'oldest' | 'popular'>('newest');
const itemsPerPage = 8;

// Articles filtrés
const filteredArticles = computed(() => {
  let filtered = [...articles.value];

  // Filtrer par tab actif (vous pouvez ajouter une logique spécifique ici)
  // Par exemple, filtrer par type d'article selon le tab

  // Filtrer par catégorie
  if (selectedCategory.value) {
    filtered = filtered.filter(article => {
      if (typeof article.category === 'object') {
        return article.category?.slug === selectedCategory.value;
      }
      return false;
    });
  }

  // Filtrer par recherche
  if (searchQuery.value) {
    const search = searchQuery.value.toLowerCase();
    filtered = filtered.filter(article =>
      article.title.toLowerCase().includes(search) ||
      article.excerpt?.toLowerCase().includes(search)
    );
  }

  // Trier
  if (sortOrder.value === 'newest') {
    filtered.sort((a, b) => new Date(b.published_date || b.date_created || '').getTime() - 
                            new Date(a.published_date || a.date_created || '').getTime());
  } else if (sortOrder.value === 'oldest') {
    filtered.sort((a, b) => new Date(a.published_date || a.date_created || '').getTime() - 
                            new Date(b.published_date || b.date_created || '').getTime());
  } else if (sortOrder.value === 'popular') {
    filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
  }

  return filtered;
});

// Articles paginés
const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredArticles.value.slice(start, end);
});

// Article principal/featured
const featuredArticle = computed(() => {
  return featuredArticles.value[0] || articles.value[0];
});

// Articles populaires (sidebar)
const popularArticles = computed(() => {
  return [...articles.value]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5);
});

// Articles récents (sidebar)
const recentArticles = computed(() => {
  return [...articles.value]
    .sort((a, b) => new Date(b.published_date || b.date_created || '').getTime() - 
                    new Date(a.published_date || a.date_created || '').getTime())
    .slice(0, 5);
});

// Pagination calculée
const totalPagesComputed = computed(() => {
  return Math.ceil(filteredArticles.value.length / itemsPerPage);
});

// Fonctions
const loadArticles = async () => {
  await fetchArticles();
  await fetchCategories();
};

const filterByCategory = (categorySlug: string | null) => {
  selectedCategory.value = categorySlug;
  currentPage.value = 1;
};

const resetFilters = () => {
  selectedCategory.value = null;
  searchQuery.value = '';
  sortOrder.value = 'newest';
  currentPage.value = 1;
};

const onSearchInput = () => {
  currentPage.value = 1;
};

// Fonctions utilitaires
const getArticleImageUrl = (article: any) => {
  const directusUrl = import.meta.env.VITE_DIRECTUS_URL || 'http://localhost:8055';
  if (!article) {
    console.log('Aucun article fourni');
    // Utiliser l'image importée
    return defaultArticleImage;
  }
  
  if (article.featured_image) {
    // Vérifier si c'est déjà une URL complète
    if (typeof article.featured_image === 'string' && article.featured_image.startsWith('http')) {
      console.log('Image URL complète trouvée:', article.featured_image);
      return article.featured_image;
    }
    
    // Construire l'URL Directus avec cache-breaker pour forcer le rafraîchissement
    const cacheBreaker = new Date().getTime();
    // Si featured_image est un objet, utiliser l'ID de l'objet
    const imageId = typeof article.featured_image === 'object' ? article.featured_image.id : article.featured_image;
    return `${directusUrl}/assets/${imageId}?width=400&height=200&fit=cover&quality=80&v=${cacheBreaker}`;
  }
  
  // Utiliser l'image importée
  console.log('Aucune image trouvée pour l\'article', article.id);
  return defaultArticleImage;
};

const getCategoryName = (category: any) => {
  if (typeof category === 'object' && category?.name) {
    return category.name;
  }
  return 'Article';
};

const getCategoryColor = (category: any) => {
  if (typeof category === 'object' && category?.color) {
    return category.color;
  }
  return 'primary';
};

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return 'Hier';
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  if (diffDays < 30) return `Il y a ${Math.ceil(diffDays / 7)} semaines`;
  
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatViews = (views: number) => {
  if (views < 1000) return views.toString();
  if (views < 1000000) return Math.floor(views / 1000) + 'k';
  return Math.floor(views / 1000000) + 'M';
};

const navigateToArticle = (article: any) => {
  if (article.slug) {
    router.push(`/carnet-rh/articles/${article.slug}`);
  } else if (article.id) {
    router.push(`/carnet-rh/articles/${article.id}`);
  }
};

const getTabTitle = () => {
  switch (activeTab.value) {
    case 'analyses':
      return 'Articles d\'analyse';
    case 'decryptages':
      return 'Décryptage de tendances RH';
    case 'regards':
      return 'Regards croisés';
    default:
      return 'Articles';
  }
};

// Lifecycle
onMounted(() => {
  loadArticles();
});

// Watchers
watch(activeTab, () => {
  currentPage.value = 1;
});
</script>

<style scoped>
.breadcrumb-centered {
  display: flex !important;
  justify-content: center !important;
  width: 100%;
}

.h2-article-title {
  font-size: 48px;
}

.breadcrumb-container {
  padding-top: 10px;
}

.active-filter {
  background-color: rgb(var(--v-theme-primary)) !important;
  color: white !important;
}

.featured-image::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.2) 60%, rgba(0, 0, 0, 0) 100%);
}

.article-overlay {
  position: relative;
  z-index: 2;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.2) 60%, rgba(0, 0, 0, 0) 100%);
}

.search-field {
  border: 0.5px solid rgb(var(--v-theme-primary));
  border-radius: 24px;
  max-width: 353px;
}

.article-card {
  cursor: pointer;
  transition: all 0.2s ease;
}

.article-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.border-b {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

@media (max-width: 600px) {
  .search-field {
    width: 100%;
    max-width: none;
  }
  
  .h2-article-title {
    font-size: 32px;
  }
}
</style>
