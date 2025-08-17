<template>
  <v-app>
    <NavBars v-model:drawer="drawer" />

    <v-navigation-drawer v-model="drawer" temporary app location="right" width="300">
      <!-- Contenu du menu mobile -->
    </v-navigation-drawer>

    <v-main>
      <HeroSection>
        <!-- En-tête de page avec titre -->
        <section class="position-relative" style="padding-top: 100px;">
        </section>

      </HeroSection>

      <!-- Barre de filtres et recherche -->
      <section class="py-4">
        <v-container class="nav-container">
          <div class="d-flex flex-wrap align-center justify-space-between">
            <div style="
              width: 101px;
              height: 40px;
              border-radius: 400px;
              display: flex;
              font-size: 14px;
              align-items: center;
              ">
              <v-btn icon color="primary" class="mr-3 mb-2 mb-sm-0" to="/carnet-rh/articles" style="
                border-radius: 400px;
                width: 100%;
                height: 100%;
                min-width: 0;
                padding: 0;
              ">
                <v-icon>mdi-arrow-left</v-icon>
                Retour
              </v-btn>
            </div>

            <SocialLinks />
          </div>
        </v-container>
      </section>

      <Breadcrumb class="pl-6" />
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
              <v-card v-if="featuredArticle" elevation="0" class="overflow-hidden article-card"
                @click="navigateToArticle(featuredArticle)">
                <v-img :src="getArticleImageUrl(featuredArticle)" cover height="500" class="rounded-lg article-image">
                </v-img>
                <div class="d-flex flex-column">
                  <div class="">
                    <div class="align-center mb-2">
                      <div class="d-flex pa-4 flex-column mb-2">
                        <h3 class="text-h6 font-weight-bold mb-2">
                          <span class="actuelle-ligne">{{ currentSectionName }}</span>
                          <span class="bg-accent mx-2"
                            style="width: 8px; height: 8px; opacity: 50%; border-radius: 50%; display: inline-block;"></span>
                          {{ getCategoryName(featuredArticle.category) }}
                        </h3>
                        <h2 class="h2-article-title mb-2">
                          {{ featuredArticle.title }}
                        </h2>
                        <!--  -->
                        <div class="d-flex align-center mb-6">
                          <span class="text-subtitle-2">Par <span class="text-accent-text">L'équipe MCRH</span></span>
                          <v-icon size="small" class="mx-2 text-grey">mdi-circle-small</v-icon>
                          <span class="text-subtitle-2 text-grey-darken-1">Publié le 07/08/2025</span>
                        </div>
                        <p class="text-body-6">
                          {{ featuredArticle.excerpt }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
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
              <v-btn v-if="searchQuery || selectedCategory" color="primary" variant="outlined" @click="resetFilters"
                class="mt-4">
                Voir tous les articles
              </v-btn>
            </v-card>
          </div>
        </v-container>
      </section>

      <!-- Section Newsletter -->

      <NewsletterSection :newsIconImage="news1Image" :illustrationImage="news2Image" class="mt-16" />

      <ContactSection :mainIllustration="contactIllustration" :secondaryIllustration="anotherIllustration"
        :decorativeImage="contactTitle" />

      <FooterSection />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import type { Ref } from 'vue';
import NavBars from '@/components/NavBars.vue';
import HeroSection from '@/components/HeroSection.vue';
import FooterSection from '@/components/FooterSection.vue';
import NewsletterSection from '@/components/NewsletterSection.vue';
import ContactSection from '@/components/ContactSection.vue';
import { useArticles } from '@/composables/useArticles';
import SocialLinks from '@/components/SocialLinks.vue';

// Import images
import news1Image from '@/assets/images/backgrounds/newsletter-bg.png';
import news2Image from '@/assets/images/backgrounds/newsletter-bg-2.png';
import contactIllustration from '@/assets/images/backgrounds/bg-contact.png';
import anotherIllustration from '@/assets/images/backgrounds/form-text.png';
import contactTitle from '@/assets/images/backgrounds/bgcontact-title.png';
import defaultArticleImage from '@/assets/images/articles/art-1.png';
import Breadcrumb from '@/components/Breadcrumb.vue';

const router = useRouter();
const drawer = ref(false);

// État des tabs
const activeTab = ref('analyses');

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

// Articles récents (sidebar)
const recentArticles = computed(() => {
  return [...articles.value]
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
  if (!article) {
    console.log('Aucun article fourni');
    // Utiliser l'image importée
    return defaultArticleImage;
  }

  const directusUrl = import.meta.env.VITE_DIRECTUS_URL || 'http://localhost:8055';
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
    // Si featured_image est un objet, utiliser l'ID de l'objet
    const imageId = typeof article.featured_image === 'object' ? article.featured_image.id : article.featured_image;
    const imageUrl = `${directusUrl}/assets/${imageId}?width=400&height=200&fit=cover&quality=80&v=${cacheBreaker}`;
    console.log('URL image construite:', imageUrl);
    return imageUrl;
  }

  console.log('Aucune image trouvée pour l\'article', article.id);
  // Utiliser l'image importée
  return defaultArticleImage;
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
watch(activeTab, () => {
  currentPage.value = 1;
});

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

/* .article-overlay {
  position: relative;
  z-index: 2;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.2) 60%, rgba(0, 0, 0, 0) 100%);
} */

.search-field {
  border: 0.5px solid rgb(var(--v-theme-primary));
  border-radius: 24px;
  max-width: 353px;
}

/* .article-card {
  cursor: pointer;
  transition: all 0.2s ease;
} */

/* .article-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
} */

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
