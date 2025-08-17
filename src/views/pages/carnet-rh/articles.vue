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
                <h1 class="text-53 font-weight-bold mb-2">
                  <span class="text-primary">Le Carnet RH</span>
                  <span class="text-accent"> - </span>
                  <span class="d-block text-accent">Comprendre & Agir</span>
                </h1>
                <p class="mb-8"
                  style="font-weight: 500; font-size: 18px;"><!-- max-width: 700px; -->
                  Les dernières publications éditoriales pour comprendre et décrypter les enjeux RH
                </p>
              </v-col>
            </v-row>
          </v-container>
        </section>
        <!-- Filtres de catégories -->
        <section class="pb-4 pt-2">
          <v-container class="nav-container">
            <div class="filtre-section d-flex justify-center flex-wrap">
              <!-- Bouton "Tous les articles" -->
              <v-btn variant="tonal" color="primary" class="rounded-pill mx-1 my-1"
                :class="{ 'active-filter': activeTab === null }"
                @click="activeTab = null">
                Tous les articles
              </v-btn>
              <!-- Boutons des catégories filtrées -->
              <v-btn v-for="cat in filteredCategories" :key="cat.id"
                variant="text" color="primary" class="rounded-pill mx-1 my-1"
                :class="{ 'active-filter': activeTab === cat.slug }"
                @click="activeTab = cat.slug || ''">
                {{ cat.name }}
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
                  <v-list-item v-for="category in categories" :key="category.id"
                    @click="filterByCategory(category.slug ?? null)">
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
            <v-text-field v-model="searchQuery" prepend-inner-icon="mdi-magnify" placeholder="Rechercher un article"
              variant="outlined" density="comfortable" hide-details class="search-field mt-2 mt-sm-0"
              @input="onSearchInput" />
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
              <v-card v-if="featuredArticle" elevation="0" class="rounded-lg overflow-hidden article-card"
                @click="navigateToArticle(featuredArticle)">
                <v-img :src="getArticleImageUrl(featuredArticle)" cover height="500" class="rounded-lg article-image">
                  <div class="article-overlay d-flex flex-column justify-end h-100">
                    <div class="pa-4">
                      <div class="align-center mb-2">
                        <div class="d-flex pa-6 flex-column mb-2">
                          <h3 class="text-h6 font-weight-bold text-white mb-2">
                            <span class="actuelle-ligne">{{ currentSectionName }}</span>
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
                         <!--  <div class="text-caption text-white mt-2">
                            {{ formatDate(featuredArticle.published_date || featuredArticle.date_created) }}
                            • {{ featuredArticle.reading_time || 5 }} min de lecture
                          </div> -->
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
                      <v-img :src="getArticleImageUrl(article)" cover class="rounded-t-lg" height="125"></v-img>
                        <v-card-text class="px-1 pt-2">
                        <div class="d-flex align-center">
                          <span class="text-caption text-grey-darken-1 mr-2">Carnet RH</span>
                         <span class="bg-accent mx-2"
                        style="width: 8px; height: 8px; opacity: 50%; border-radius: 50%; display: inline-block;"></span>
                          <span class="text-caption text-grey-darken-1">{{ getCategoryName(article.category) }}</span>
                        </div>
                        <h3 class="text-h6 font-weight-bold mb-1">
                          {{ article.title }}
                        </h3>
                        <p class="text-caption text-grey-darken-1">
                          Publié le {{ new Date(article.published_date || article.date_created || '')
                            .toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' }) }}
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
              <v-btn v-if="searchQuery || selectedCategory" color="primary" variant="outlined" @click="resetFilters"
                class="mt-4">
                Voir tous les articles
              </v-btn>
            </v-card>
          </div>
        </v-container>
      </section>

      <!-- Articles Section -->
      <section v-if="!loading && !error && filteredArticles.length > 0" id="articles" class="mb-16">
        <!-- Section "Publiées dans la semaine" -->
        <div v-if="recentWeekArticles.length > 0" class="d-flex justify-space-between align-center mx-6 pa-4 mb-4 text-h6"
          style="height: 48px; background-color: #F4F4F5; border-radius: 8px; cursor: pointer;" @click="toggleRecentSection">
          <span>Publiées dans la semaine ({{ recentWeekArticles.length }} articles)</span>
          <div class="">
            <v-btn :icon="isRecentSectionOpen ? 'mdi-chevron-double-down' : 'mdi-chevron-double-up'" 
              density="comfortable" variant="plain" class="bg-primary mr-2"
              color="white" @click.stop="toggleRecentSection"></v-btn>
          </div>
        </div>
        <v-expand-transition>
          <v-container v-if="recentWeekArticles.length > 0 && isRecentSectionOpen">
            <v-row>
              <v-col v-for="article in paginatedArticles.recent" :key="article.id" cols="12" md="4">
                <v-card class="h-100 article-card" flat @click="navigateToArticle(article)">
                  <v-img :src="getArticleImageUrl(article)" height="200" cover class="rounded-t-lg"></v-img>
                  <v-card-text class="pa-4">
                    <div class="text-overline text-accent-text mb-1 d-flex align-center">
                      <span class="actuelle-ligne">{{ currentSectionName }}</span>
                      <span class="bg-accent mx-2"
                        style="width: 8px; height: 8px; opacity: 50%; border-radius: 50%; display: inline-block;"></span>
                      {{ getCategoryName(article.category) }}
                    </div>
                    <div class="text-h5 font-weight-bold mb-2">{{ article.title }}</div>
                    <div class="text-body-2 text-grey-darken-1">{{ article.excerpt }}</div>
                    <p class="text-caption text-grey-darken-1">
                          Publié le {{ new Date(article.published_date || article.date_created || '')
                            .toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' }) }}
                        </p>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-expand-transition>

        <!-- Section "Les plus lues" -->
        <div v-if="mostReadArticles.length > 0" class="d-flex justify-space-between align-center mt-6 mx-6 pa-4 mb-4 text-h6"
          style="height: 48px; background-color: #F4F4F5; border-radius: 8px; cursor: pointer;" @click="togglePopularSection">
          <span>Les plus lues</span>
          <div class="">
            <v-btn :icon="isPopularSectionOpen ? 'mdi-chevron-double-down' : 'mdi-chevron-double-up'" 
              density="comfortable" variant="plain" class="bg-primary mr-2"
              color="white" @click.stop="togglePopularSection"></v-btn>
          </div>
        </div>
        <v-expand-transition>
          <v-container v-if="mostReadArticles.length > 0 && isPopularSectionOpen">
            <v-row>
              <v-col v-for="article in paginatedArticles.popular" :key="article.id" cols="12" md="4">
                <v-card class="h-100 article-card" flat @click="navigateToArticle(article)">
                  <v-img :src="getArticleImageUrl(article)" height="200" cover class="rounded-t-lg"></v-img>
                  <v-card-text class="pa-4">
                    <div class="text-overline text-accent-text mb-1">
                      <span class="actuelle-ligne">{{ currentSectionName }}</span>
                      <span class="bg-accent mx-2"
                        style="width: 8px; height: 8px; opacity: 50%; border-radius: 50%; display: inline-block;"></span>
                      {{ getCategoryName(article.category) }}
                    </div>
                    <div class="text-h5 font-weight-bold mb-2">{{ article.title }}</div>
                    <div class="text-body-2 text-grey-darken-1">{{ article.excerpt }}</div>
                     <p class="text-caption text-grey-darken-1">
                          Publié le {{ new Date(article.published_date || article.date_created || '')
                            .toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' }) }}
                        </p>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-expand-transition>
        
        <!-- Pagination -->
        <div v-if="totalPagesComputed > 1" class="d-flex flex-column align-center mt-10">
          <p class="text-body-2 text-grey-darken-1 mb-4">
            Page {{ currentPage }} sur {{ totalPagesComputed }} ({{ filteredArticles.length }} articles au total)
          </p>
          <v-pagination v-model="currentPage" :length="totalPagesComputed" total-visible="7"></v-pagination>
        </div>
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
import { useRouter, useRoute } from 'vue-router';
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

const router = useRouter();
const drawer = ref(false);

// État des tabs (noms des catégories Directus)
// État des tabs (slug des catégories Directus)
const activeTab = ref<string | null>(null);

// État d'ouverture/fermeture des sections
const isRecentSectionOpen = ref(true);  // Section "Publiées dans la semaine"
const isPopularSectionOpen = ref(true); // Section "Les plus lues"

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

// Initialiser activeTab à null pour afficher tous les articles par défaut
watch(categories, (cats) => {
  if (cats.length > 0 && activeTab.value === null) {
    // Par défaut, afficher tous les articles (activeTab reste à null)
    console.log('Tab initial: Tous les articles (activeTab = null)');
  }
});

// État local
const searchQuery = ref('');
const selectedCategory = ref<string | null>(null);
const sortOrder = ref<'newest' | 'oldest' | 'popular'>('newest');
const itemsPerPage = 8;

// Catégories filtrées (afficher uniquement les 3 catégories RH principales)
const filteredCategories = computed(() => {
  const mainRHCategories = [
    'fdef3633-a896-405d-a350-7dd31b3ee173', // Analyse RH
    '238e46ac-b864-48a7-93e2-1b4c6118286e', // Décryptage
    '3bbfe162-f45a-4081-9aee-f103e2669e6a'  // Regard croisé
  ];
  
  return categories.value.filter((cat) => {
    // Inclure uniquement les catégories RH principales
    return mainRHCategories.includes(cat.id || '');
  });
});

// Articles filtrés
const filteredArticles = computed(() => {
  let filtered = [...articles.value];
  
  // IDs des catégories RH principales à toujours afficher
  const mainRHCategories = [
    'fdef3633-a896-405d-a350-7dd31b3ee173', // Analyse RH
    '238e46ac-b864-48a7-93e2-1b4c6118286e', // Décryptage
    '3bbfe162-f45a-4081-9aee-f103e2669e6a'  // Regard croisé
  ];

  // Filtrer selon le tab actif (slug de catégorie)
  if (activeTab.value !== null) {
    // Filtrer par une catégorie spécifique
    filtered = filtered.filter(article => {
      const articleCatId: string | undefined = typeof article.category === 'object'
        ? article.category.id
        : (typeof article.category === 'string' ? article.category : undefined);
      const catObj = categories.value.find(c => c.id === articleCatId);
      return catObj?.slug === activeTab.value;
    });
  } else {
    // Si activeTab est null ("Tous les articles"), filtrer seulement les catégories RH principales
    filtered = filtered.filter(article => {
      const articleCatId: string | undefined = typeof article.category === 'object'
        ? article.category.id
        : (typeof article.category === 'string' ? article.category : undefined);
      return mainRHCategories.includes(articleCatId || '');
    });
  }

  // Filtrer par catégorie (si menu "Filtrer" utilisé)
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
    filtered.sort((a, b) => {
      const dateA = new Date(a.published_date || a.date_created || '').getTime();
      const dateB = new Date(b.published_date || b.date_created || '').getTime();
      return dateB - dateA;
    });
  } else if (sortOrder.value === 'oldest') {
    filtered.sort((a, b) => {
      const dateA = new Date(a.published_date || a.date_created || '').getTime();
      const dateB = new Date(b.published_date || b.date_created || '').getTime();
      return dateA - dateB;
    });
  } else if (sortOrder.value === 'popular') {
    filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
  }

  return filtered;
});

// Articles de la semaine (les plus récents)
const recentWeekArticles = computed(() => {
  // Filtrer les articles des 7 derniers jours
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  return [...filteredArticles.value]
    .filter(article => {
      const articleDate = new Date(article.published_date || article.date_created || '');
      return articleDate >= oneWeekAgo;
    })
    .sort((a, b) => {
      const dateA = new Date(a.published_date || a.date_created || '').getTime();
      const dateB = new Date(b.published_date || b.date_created || '').getTime();
      return dateB - dateA;
    });
});

// Articles les plus lus
const mostReadArticles = computed(() => {
  return [...filteredArticles.value]
    .sort((a, b) => (b.views || 0) - (a.views || 0));
});

// Articles paginés pour chaque section
const paginatedArticles = computed(() => {
  // On utilise la constante articlesPerPage définie plus haut
  const start = (currentPage.value - 1) * articlesPerPage;
  const end = start + articlesPerPage;
  
  // Extraire les articles de la page courante pour chaque section
  const paginatedRecent = recentWeekArticles.value.slice(start, end);
  const paginatedPopular = mostReadArticles.value.slice(start, end);
  
  return {
    recent: paginatedRecent,
    popular: paginatedPopular
  };
});

// Article principal/featured
const featuredArticle = computed(() => {
  const article = featuredArticles.value[0] || articles.value[0];
  if (article) {
    console.log('Article mis en avant:', article);
    console.log('Champ featured_image:', article.featured_image);
    // Vérifier si l'article a une image
    if (!article.featured_image) {
      console.warn('⚠️ L\'article mis en avant n\'a pas d\'image définie dans featured_image');
    }
  }
  return article;
});

// Articles populaires (sidebar)
const popularArticles = computed(() => {
  return [...articles.value]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5);
});

// Articles récents (sidebar) - uniquement des catégories RH principales
const recentArticles = computed(() => {
  // IDs des catégories RH principales
  const mainRHCategories = [
    'fdef3633-a896-405d-a350-7dd31b3ee173', // Analyse RH
    '238e46ac-b864-48a7-93e2-1b4c6118286e', // Décryptage
    '3bbfe162-f45a-4081-9aee-f103e2669e6a'  // Regard croisé
  ];
  
  return [...articles.value]
    // Filtrer pour n'inclure que les articles des catégories RH principales
    .filter(article => {
      const articleCatId = typeof article.category === 'object'
        ? article.category?.id
        : (typeof article.category === 'string' ? article.category : undefined);
      return mainRHCategories.includes(articleCatId || '');
    })
    .sort((a, b) => {
      const dateA = new Date(a.published_date || a.date_created || '').getTime();
      const dateB = new Date(b.published_date || b.date_created || '').getTime();
      return dateB - dateA;
    })
    .slice(0, 5);
});

// Configuration de la pagination
const articlesPerPage = 3; // Constante pour éviter de recréer la valeur à chaque calcul

// Pagination calculée avec mémo pour éviter les recalculs inutiles
const totalPagesComputed = computed(() => {
  // Calcule le nombre de pages nécessaires pour afficher tous les articles
  // en tenant compte qu'on affiche 3 articles par section et par page
  
  // Prendre la section qui a le plus d'articles pour déterminer le nombre de pages
  const maxArticles = Math.max(recentWeekArticles.value.length, mostReadArticles.value.length);
  
  return Math.max(1, Math.ceil(maxArticles / articlesPerPage));
});

// Fonctions
const loadArticles = async () => {
  // Charger d'abord les catégories pour initialiser activeTab
  await fetchCategories();
  // Puis charger les articles
  await fetchArticles();
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
  if (!article) {
    console.log('Aucun article fourni');
    // Retourner une chaîne vide au lieu de l'image par défaut
    return '';
  }

  const directusUrl = import.meta.env.VITE_DIRECTUS_URL || 'http://localhost:8055';
  // Ne pas utiliser le token car les tests montrent qu'il provoque des erreurs 401
  // const accessToken = import.meta.env.VITE_DIRECTUS_TOKEN;
  console.log('Article dans getArticleImageUrl:', article.id, article.title);

  // Vérifier si featured_image est défini et non null
  if (article.featured_image) {
    // Vérifier si c'est déjà une URL complète
    if (typeof article.featured_image === 'string' && article.featured_image.startsWith('http')) {
      console.log('Image URL complète trouvée:', article.featured_image);
      return article.featured_image;
    }
    
    // Construire l'URL Directus avec cache-breaker pour forcer le rafraîchissement
    const cacheBreaker = new Date().getTime();
    
    // Extraire l'ID de l'image selon le format
    let imageId: string | undefined;
    if (typeof article.featured_image === 'object' && article.featured_image !== null) {
      imageId = article.featured_image.id;
    } else if (typeof article.featured_image === 'string') {
      imageId = article.featured_image;
    }
    
    if (imageId) {
      // Ne pas ajouter de token d'authentification car les tests montrent des erreurs 401
      const imageUrl = `${directusUrl}/assets/${imageId}?width=400&height=200&fit=cover&quality=80&v=${cacheBreaker}`;
      console.log('URL image construite:', imageUrl);
      return imageUrl;
    }
  }
  
  console.log('Aucune image trouvée pour l\'article', article.id);
  // Retourner une chaîne vide au lieu de l'image par défaut
  return '';
};

const getCategoryName = (category: any) => {
  // Pour le débogage
  console.log('getCategoryName appelé avec:', category);
  
  if (!category) return 'Non classé';
  
  // Cas 1: Si c'est un objet avec une propriété name
  if (typeof category === 'object' && category?.name) {
    return category.name;
  }
  
  // Cas 2: Si c'est une chaîne qui représente un nom directement
  if (typeof category === 'string' && isNaN(category as unknown as number)) {
    // Vérifier si c'est un UUID (format standard)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(category)) {
      // C'est un UUID, chercher dans les catégories
      const foundCategory = categories.value.find(cat => cat.id === category);
      if (foundCategory) {
        return foundCategory.name;
      }
    } else {
      // C'est probablement un nom directement
      return category;
    }
  }
  
  // Cas 3: Si c'est un ID numérique ou une chaîne numérique
  if (typeof category === 'number' || (typeof category === 'string' && !isNaN(Number(category)))) {
    const categoryId = Number(category);
    const foundCategory = categories.value.find(cat => {
      // Convertir l'ID de la catégorie en nombre pour la comparaison si nécessaire
      const catId = typeof cat.id === 'string' && !isNaN(Number(cat.id)) ? Number(cat.id) : cat.id;
      return catId === categoryId;
    });
    
    if (foundCategory) {
      return foundCategory.name;
    }
  }
  
  // Cas 4: Si c'est un tableau (parfois, l'API peut retourner un tableau)
  if (Array.isArray(category) && category.length > 0) {
    const firstItem = category[0];
    if (typeof firstItem === 'object' && firstItem?.name) {
      return firstItem.name;
    } else {
      // Essayer de résoudre récursivement
      return getCategoryName(firstItem);
    }
  }
  
  // Si le format est vraiment inconnu, afficher l'ID brut pour faciliter le débogage
  console.warn('Format de catégorie non reconnu:', category);
  return typeof category !== 'object' ? String(category) : 'Non classé';
};

const getCategoryColor = (category: any) => {
  if (typeof category === 'object' && category?.color) {
    return category.color;
  }
  return 'primary';
};

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'Date non définie';

  try {
    const date = new Date(dateString);
    
    // Vérifier si la date est valide
    if (isNaN(date.getTime())) {
      return 'Date invalide';
    }
    
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Aujourd\'hui';
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    if (diffDays < 30) return `Il y a ${Math.ceil(diffDays / 7)} semaines`;

    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Erreur lors du formatage de la date:', error);
    return 'Date invalide';
  }
};

const formatViews = (views: number) => {
  if (views < 1000) return views.toString();
  if (views < 1000000) return Math.floor(views / 1000) + 'k';
  return Math.floor(views / 1000000) + 'M';
};

const navigateToArticle = (article: any) => {
  if (!article) {
    console.error('Aucun article fourni pour la navigation');
    return;
  }
  
  console.log('Navigation vers l\'article:', article.id, article.title, article.slug);
  
  try {
    if (article.slug && article.slug.trim() !== '') {
      router.push(`/carnet-rh/articles/${article.slug}`);
    } else if (article.id) {
      router.push(`/carnet-rh/articles/${article.id}`);
    } else {
      console.error('Article sans slug ni ID:', article);
    }
  } catch (error) {
    console.error('Erreur lors de la navigation:', error);
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

// Fonction pour gérer le changement de page de manière contrôlée
const handlePageChange = (newPage: number) => {
  // Simplifions la fonction pour permettre le défilement correct
  if (newPage > 0 && newPage <= totalPagesComputed.value) {
    setPage(newPage);
  }
};

// Lifecycle
onMounted(() => {
  loadArticles().then(() => {
    // Ajout de logs de débogage pour comprendre la structure des catégories
    console.log('Catégories chargées:', categories.value);
    
    // Vérifier le premier article et sa catégorie
    if (articles.value.length > 0) {
      const firstArticle = articles.value[0];
      console.log('Premier article:', firstArticle);
      console.log('Catégorie du premier article (brut):', firstArticle.category);
      console.log('Type de la catégorie:', typeof firstArticle.category);
      console.log('Nom de catégorie résolu:', getCategoryName(firstArticle.category));
    }
  });
});

// Watchers

// Fonctions pour gérer le toggle des sections
const toggleRecentSection = () => {
  isRecentSectionOpen.value = !isRecentSectionOpen.value;
};

const togglePopularSection = () => {
  isPopularSectionOpen.value = !isPopularSectionOpen.value;
};

const props = withDefaults(defineProps<{ customSectionName?: string }>(), {
  customSectionName: ''
});

const route = useRoute();

// Dictionnaire simplifié pour les noms de sections
const sectionNameMap: Record<string, string> = {
  'carnet-rh': 'Le carnet RH',
  'articles': 'Le carnet RH',
  'analyses': 'Le carnet RH',
  'a-propos': 'À propos',
  'notre-equipe': 'Notre équipe',
  'contact': 'Contact',
  'ressources': 'Ressources',
  'offres': 'Nos offres',
};

// Détermine le nom de la section actuelle
const currentSectionName = computed(() => {
  // Si un nom personnalisé est fourni, l'utiliser
  if (props.customSectionName) {
    return props.customSectionName;
  }

  // Sinon, extraire le premier segment significatif du chemin
  const pathParts = route.path.split('/').filter(part => part);
  const firstSegment = pathParts[0] || '';
  
  // Retourner le nom correspondant ou le segment lui-même avec la première lettre en majuscule
  return sectionNameMap[firstSegment] || 
    (firstSegment.charAt(0).toUpperCase() + firstSegment.slice(1));
});
</script>

<style scoped>
.breadcrumb-centered {
  display: flex !important;
  justify-content: center !important;
  width: 100%;
}

.filtre-section {
  background-color: #F2F4F6;
  width: 506px;
  margin: auto;
  border-radius: 24px;
  padding: 2px 2px;
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

/* Fix pour la pagination */
.v-pagination {
  will-change: transform;
  transform: translateZ(0);
  min-height: 48px;
}

.v-pagination__item {
  min-width: 36px;
  transition: all 0.2s ease;
  user-select: none;
}

/* Force hardware acceleration pour une animation plus fluide */
.v-pagination__list {
  backface-visibility: hidden;
  perspective: 1000;
  transform-style: preserve-3d;
}
</style>