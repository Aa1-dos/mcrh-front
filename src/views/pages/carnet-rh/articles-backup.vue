<template>
  <v-app>
    <NavBars v-model:drawer="drawer" />

    <v-navigation-drawer v-model="drawer" temporary app location="right" width="300">
      <!-- Contenu du menu mobile -->
    </v-navigation-drawer>

    <v-main class="bg-grey-lighten-5">
      <!-- Header simple -->
      <section class="py-8 bg-white">
        <v-container>
          <div class="text-center">
            <h1 class="text-h3 font-weight-bold mb-2">
              <span class="text-primary">Le Carnet RH</span>
              <span class="text-accent"> - </span>
              <span class="text-accent">Comprendre & Agir</span>
            </h1>
            <p class="text-subtitle-1 text-grey-darken-1">
              Les dernières publications éditoriales pour comprendre et décrypter les enjeux RH
            </p>
          </div>
        </v-container>
      </section>

      <!-- Tabs de navigation -->
      <section class="bg-white border-b">
        <v-container>
          <v-tabs v-model="activeTab" class="mb-0" color="primary">
            <v-tab value="analyses">Articles d'analyse</v-tab>
            <v-tab value="decryptages">Décryptage de tendances RH</v-tab>
            <v-tab value="regards">Regards croisés</v-tab>
          </v-tabs>
        </v-container>
      </section>

      <!-- Contenu principal -->
      <section class="py-6">
        <v-container>
          <v-row>
            <!-- Sidebar gauche - Filtres -->
            <v-col cols="12" md="3">
              <v-card flat class="pa-4">
                <h3 class="text-h6 font-weight-bold mb-4">Filtrer</h3>
                
                <!-- Filtres par catégorie -->
                <div class="mb-6">
                  <h4 class="text-subtitle-1 font-weight-medium mb-3">Catégories</h4>
                  <v-list density="compact" class="pa-0">
                    <v-list-item
                      class="px-0"
                      :class="{ 'text-primary font-weight-bold': !selectedCategory }"
                      @click="filterByCategory(null)"
                    >
                      <v-list-item-title>Tous les articles</v-list-item-title>
                    </v-list-item>
                    <v-list-item
                      v-for="category in categories"
                      :key="category.id"
                      class="px-0"
                      :class="{ 'text-primary font-weight-bold': selectedCategory === category.slug }"
                      @click="filterByCategory(category.slug ?? null)"
                    >
                      <v-list-item-title>{{ category.name }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </div>

                <!-- Tri par date -->
                <div class="mb-6">
                  <h4 class="text-subtitle-1 font-weight-medium mb-3">Date de publication</h4>
                  <v-btn-toggle v-model="sortOrder" variant="outlined" class="d-flex flex-column">
                    <v-btn value="newest" size="small" class="justify-start mb-1">
                      Plus récents d'abord
                    </v-btn>
                    <v-btn value="oldest" size="small" class="justify-start mb-1">
                      Plus anciens d'abord
                    </v-btn>
                    <v-btn value="popular" size="small" class="justify-start">
                      Plus populaires
                    </v-btn>
                  </v-btn-toggle>
                </div>

                <!-- Recherche -->
                <div>
                  <h4 class="text-subtitle-1 font-weight-medium mb-3">Rechercher</h4>
                  <v-text-field
                    v-model="searchQuery"
                    placeholder="Rechercher un article..."
                    variant="outlined"
                    density="compact"
                    prepend-inner-icon="mdi-magnify"
                    hide-details
                    @input="onSearchInput"
                  ></v-text-field>
                </div>
              </v-card>
            </v-col>

            <!-- Contenu principal -->
            <v-col cols="12" md="6">
              <!-- Loading state -->
              <div v-if="loading" class="text-center py-8">
                <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
                <p class="mt-4">Chargement des articles...</p>
              </div>

              <!-- Error state -->
              <div v-else-if="error" class="text-center py-8">
                <v-card flat class="pa-8">
                  <v-icon color="error" size="64">mdi-alert-circle</v-icon>
                  <h3 class="text-h5 mt-4 mb-2">Erreur de chargement</h3>
                  <p class="text-grey-darken-1 mb-4">{{ error }}</p>
                  <v-btn color="primary" @click="loadArticles">Réessayer</v-btn>
                </v-card>
              </div>

              <!-- Articles list -->
              <div v-else>
                <!-- Article principal / Featured -->
                <v-card v-if="featuredArticle" flat class="mb-6" @click="navigateToArticle(featuredArticle)">
                  <v-row no-gutters>
                    <v-col cols="12">
                      <v-img 
                        :src="getArticleImageUrl(featuredArticle)" 
                        height="300" 
                        cover
                        class="rounded"
                      >
                        <div class="d-flex flex-column justify-end pa-4 h-100 text-white"
                             style="background: linear-gradient(transparent, rgba(0,0,0,0.7));">
                          <v-chip 
                            v-if="featuredArticle.category" 
                            :color="getCategoryColor(featuredArticle.category)" 
                            size="small" 
                            class="mb-2 align-self-start"
                          >
                            {{ getCategoryName(featuredArticle.category) }}
                          </v-chip>
                          <h2 class="text-h4 font-weight-bold">
                            {{ featuredArticle.title }}
                          </h2>
                          <p class="text-body-1 mt-2">
                            {{ featuredArticle.excerpt }}
                          </p>
                          <div class="text-caption mt-2">
                            {{ formatDate(featuredArticle.published_date || featuredArticle.date_created) }}
                            • {{ featuredArticle.reading_time || 5 }} min de lecture
                          </div>
                        </div>
                      </v-img>
                    </v-col>
                  </v-row>
                </v-card>

                <!-- Liste des autres articles -->
                <div class="d-flex justify-space-between align-center mb-4">
                  <h3 class="text-h6 font-weight-bold">
                    {{ getTabTitle() }}
                  </h3>
                  <span class="text-caption text-grey-darken-1">
                    {{ filteredArticles.length }} article{{ filteredArticles.length > 1 ? 's' : '' }}
                  </span>
                </div>

                <!-- Articles grid -->
                <div v-if="filteredArticles.length > 0" class="articles-list">
                  <v-card 
                    v-for="article in paginatedArticles" 
                    :key="article.id"
                    flat
                    class="mb-4 article-card"
                    @click="navigateToArticle(article)"
                  >
                    <v-row no-gutters>
                      <v-col cols="4">
                        <v-img 
                          :src="getArticleImageUrl(article)" 
                          height="120" 
                          cover
                          class="rounded-s"
                        ></v-img>
                      </v-col>
                      <v-col cols="8">
                        <v-card-text class="pa-4">
                          <div class="d-flex align-center mb-2">
                            <v-chip 
                              v-if="article.category" 
                              :color="getCategoryColor(article.category)" 
                              size="x-small"
                              class="mr-2"
                            >
                              {{ getCategoryName(article.category) }}
                            </v-chip>
                            <span class="text-caption text-grey-darken-1">
                              {{ formatDate(article.published_date || article.date_created) }}
                            </span>
                          </div>
                          <h4 class="text-h6 font-weight-bold mb-2 line-clamp-2">
                            {{ article.title }}
                          </h4>
                          <p class="text-body-2 text-grey-darken-1 line-clamp-2">
                            {{ article.excerpt }}
                          </p>
                          <div class="text-caption text-grey-darken-1 mt-2">
                            {{ article.reading_time || 5 }} min de lecture
                            <span v-if="article.views"> • {{ formatViews(article.views) }} vues</span>
                          </div>
                        </v-card-text>
                      </v-col>
                    </v-row>
                  </v-card>
                </div>

                <!-- Empty state -->
                <v-card v-else flat class="pa-8 text-center">
                  <v-icon color="grey-lighten-1" size="64">mdi-file-document-outline</v-icon>
                  <h3 class="text-h5 mt-4 mb-2">Aucun article trouvé</h3>
                  <p class="text-grey-darken-1">
                    {{ searchQuery ? 'Aucun article ne correspond à votre recherche.' : 'Aucun article disponible dans cette catégorie.' }}
                  </p>
                  <v-btn v-if="searchQuery || selectedCategory" color="primary" variant="outlined" @click="resetFilters" class="mt-4">
                    Voir tous les articles
                  </v-btn>
                </v-card>

                <!-- Pagination -->
                <div v-if="totalPages > 1" class="d-flex justify-center mt-6">
                  <v-pagination
                    v-model="currentPage"
                    :length="totalPages"
                    :total-visible="5"
                    color="primary"
                    @update:modelValue="setPage"
                  ></v-pagination>
                </div>
              </div>
            </v-col>

            <!-- Sidebar droite -->
            <v-col cols="12" md="3">
              <!-- Articles populaires -->
              <v-card flat class="mb-6">
                <v-card-title class="pa-4 pb-2">
                  <h3 class="text-h6 font-weight-bold">Les plus lus</h3>
                </v-card-title>
                <v-card-text class="pa-4 pt-0">
                  <div v-for="(article, index) in popularArticles" :key="`popular-${article.id}`" class="mb-4">
                    <div class="d-flex">
                      <div class="mr-3">
                        <v-avatar size="40" color="primary">
                          <span class="text-white font-weight-bold">{{ index + 1 }}</span>
                        </v-avatar>
                      </div>
                      <div class="flex-grow-1">
                        <h4 class="text-body-1 font-weight-medium line-clamp-2 mb-1" 
                            @click="navigateToArticle(article)" 
                            style="cursor: pointer;">
                          {{ article.title }}
                        </h4>
                        <div class="text-caption text-grey-darken-1">
                          {{ formatDate(article.published_date || article.date_created) }}
                          • {{ article.reading_time || 5 }} min
                        </div>
                      </div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>

              <!-- Articles récents -->
              <v-card flat>
                <v-card-title class="pa-4 pb-2">
                  <h3 class="text-h6 font-weight-bold">Articles récents</h3>
                </v-card-title>
                <v-card-text class="pa-4 pt-0">
                  <div v-for="article in recentArticles" :key="`recent-${article.id}`" class="mb-4">
                    <div class="d-flex">
                      <v-img 
                        :src="getArticleImageUrl(article)" 
                        width="60" 
                        height="60" 
                        cover
                        class="rounded mr-3"
                      ></v-img>
                      <div class="flex-grow-1">
                        <h4 class="text-body-2 font-weight-medium line-clamp-2 mb-1" 
                            @click="navigateToArticle(article)" 
                            style="cursor: pointer;">
                          {{ article.title }}
                        </h4>
                        <div class="text-caption text-grey-darken-1">
                          {{ formatDate(article.published_date || article.date_created) }}
                        </div>
                      </div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- Newsletter Section -->
      <NewsletterSection :newsIconImage="news1Image" :illustrationImage="news2Image" class="mt-16" />

      <!-- Contact Section -->
      <ContactSection :mainIllustration="contactIllustration" :secondaryIllustration="anotherIllustration"
        :decorativeImage="contactTitle" />

      <FooterSection />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import NavBars from '@/components/NavBars.vue';
import FooterSection from '@/components/FooterSection.vue';
import NewsletterSection from '@/components/NewsletterSection.vue';
import ContactSection from '@/components/ContactSection.vue';
import { useArticles } from '@/composables/useArticles';

// Import images
import news1Image from '@/assets/images/backgrounds/newsletter-bg.png';
import news2Image from '@/assets/images/backgrounds/newsletter-bg-2.png';
import contactIllustration from '@/assets/images/backgrounds/bg-contact.png';
import anotherIllustration from '@/assets/images/backgrounds/bg-contact.png';
import contactTitle from '@/assets/images/backgrounds/bgcontact-title.png';

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

  // Filtrer par tab actif
  if (activeTab.value === 'analyses') {
    // Logique pour articles d'analyse
  } else if (activeTab.value === 'decryptages') {
    // Logique pour décryptages
  } else if (activeTab.value === 'regards') {
    // Logique pour regards croisés  
  }

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
  if (article.featured_image) {
    return `${directusUrl}/assets/${article.featured_image}?width=400&height=200&fit=cover&quality=80`;
  }
  return 'https://via.placeholder.com/400x200/f5f5f5/666666?text=Article';
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
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-card {
  cursor: pointer;
  transition: all 0.2s ease;
}

.article-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.border-b {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.v-btn-toggle .v-btn {
  width: 100%;
  justify-content: flex-start;
}
</style>
