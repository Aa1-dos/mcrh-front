<template>
  <v-app>
    <NavBars v-model:drawer="drawer" />

    <v-navigation-drawer v-model="drawer" temporary app location="right" width="300">
      <!-- Contenu du menu mobile -->
    </v-navigation-drawer>

    <v-main>
      <!-- Hero section with breadcrumb -->
      <HeroSection>
        <section class="position-relative" style="padding-top: 100px;">
        </section>
      </HeroSection>
      <!-- Loading state -->
      <div v-if="loading" class="d-flex justify-center align-center" style="min-height: 400px;">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="text-center pa-8">
        <v-icon color="error" size="64">mdi-alert-circle</v-icon>
        <h2 class="text-h4 mt-4 mb-2">Article non trouvé</h2>
        <p class="text-grey-darken-1 mb-4">{{ error }}</p>
        <div class="d-flex justify-center gap-4 mt-6">
          <v-btn color="primary" :to="{ name: 'Articles' }">Retour aux articles</v-btn>
          <v-btn color="secondary" @click="retryLoad" variant="outlined">Réessayer</v-btn>
        </div>
      </div>

      <!-- Article content -->
      <div v-else-if="currentArticle">
        <!-- Barre de filtres et recherche -->
        <section class="back-section">
          <v-container class="nav-container">
            <div class="">
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

            </div>
          </v-container>
        </section>
        <div class="d-flex flex-wrap align-center justify-space-between"> 
        <Breadcrumb class="pl-6" />
        <SocialLinks />
      </div>

        <!-- Image mise en avant - toujours affichée (avec image par défaut si nécessaire) -->
        <section class="">
          <v-container class="nav-container">
            <v-row>
              <v-col cols="12" md="9">
                <v-img :src="getArticleImageUrl(currentArticle)" height="500" class="rounded-lg featured-image" cover>
                  <template v-slot:placeholder>
                    <div class="d-flex align-center justify-center fill-height">
                      <v-progress-circular indeterminate color="primary"></v-progress-circular>
                    </div>
                  </template>
                </v-img>
                <!-- URL de débogage -->
               <!--  <div class="monospace-url" style="font-size: 10px; word-break: break-all; font-family: monospace; padding: 4px; background-color: #f5f5f5;">
                  {{ getArticleImageUrl(currentArticle) }}
                </div> -->
                <div v-if="currentArticle" class="featured-image-container">
                  <!-- La source de l'image pourrait être ajoutée ici si nécessaire -->
                  <!-- <div class="image-source">Source: nom de la source</div> -->
                  <!-- Article header -->
                  <div class="d-flex flex-column">
                  <div class="">
                    <div class="align-center mb-2">
                      <div class="d-flex pa-4 flex-column mb-2">
                        <h3 class="text-h6 font-weight-bold mb-2">
                          <span class="actuelle-ligne">{{ currentSectionName }}</span>
                          <span class="bg-accent mx-2"
                            style="width: 8px; height: 8px; opacity: 50%; border-radius: 50%; display: inline-block;"></span>
                          {{ getCategoryName(currentArticle.category) }}
                        </h3>
                        <h2 class="h2-article-title mb-2">
                          {{ currentArticle.title }}
                        </h2>
                        <!--  -->
                        <div class="d-flex align-center mb-6">
                          <span class="text-subtitle-2">Par <span class="text-accent-text">{{ getAuthorDisplayName(currentArticle) }}</span></span>
                          <v-icon size="small" class="mx-2 text-grey">mdi-circle-small</v-icon>
                          <span class="text-subtitle-2 text-grey-darken-1">Publié le {{ formatDate(currentArticle.published_date || currentArticle.date_created) }}</span>
                        </div>
                        <p class="text-body-6">
                          {{ currentArticle.excerpt }}
                        </p>
                        
                        <!-- Section spéciale pour les catégories avec cover (Livres, TED Talks, Podcasts) -->
                        <div v-if="shouldUseCoverImage(currentArticle)" class="cover-section mb-6">
                          <v-row>
                            <!-- Image de couverture -->
                            <v-col cols="12" md="4" v-if="currentArticle.cover">
                              <div class="cover-display">
                                <MediaDisplay
                                  :media-file="currentArticle.cover"
                                  :height="300"
                                  image-class="rounded-lg cover-image"
                                  show-placeholder
                                />
                              </div>
                            </v-col>
                            
                            <!-- Informations spécifiques selon la catégorie -->
                            <v-col cols="12" :md="currentArticle.cover ? 8 : 12">
                              <div class="category-specific-info">
                                <!-- Pour les livres -->
                                <div v-if="getCategorySlug(currentArticle.category) === 'livres'" class="book-info">
                                  <v-icon color="primary" size="24" class="mb-2">mdi-book-open-page-variant</v-icon>
                                  <h4 class="text-h6 mb-3">À propos de ce livre</h4>
                                  <div class="d-flex flex-column gap-2">
                                    <div class="d-flex align-center">
                                      <v-icon size="16" class="me-2">mdi-account-edit</v-icon>
                                      <span class="text-body-2"><strong>Auteur:</strong> {{ getAuthorDisplayName(currentArticle) }}</span>
                                    </div>
                                    <div v-if="currentArticle.reading_time" class="d-flex align-center">
                                      <v-icon size="16" class="me-2">mdi-clock-outline</v-icon>
                                      <span class="text-body-2"><strong>Temps de lecture:</strong> ~{{ currentArticle.reading_time }} minutes</span>
                                    </div>
                                    <div class="d-flex align-center">
                                      <v-icon size="16" class="me-2">mdi-tag-outline</v-icon>
                                      <span class="text-body-2"><strong>Genre:</strong> Ressources Humaines</span>
                                    </div>
                                  </div>
                                </div>

                                <!-- Pour les TED Talks -->
                                <div v-else-if="getCategorySlug(currentArticle.category) === 'ted-talks'" class="ted-info">
                                  <div class="d-flex align-center mb-2">
                                    <v-icon color="red-darken-2" size="24" class="me-2">mdi-play-circle</v-icon>
                                    <div class="ted-logo-small">TED</div>
                                  </div>
                                  <h4 class="text-h6 mb-3">À propos de cette conférence</h4>
                                  <div class="d-flex flex-column gap-2">
                                    <div class="d-flex align-center">
                                      <v-icon size="16" class="me-2">mdi-microphone-variant</v-icon>
                                      <span class="text-body-2"><strong>Orateur:</strong> {{ getAuthorDisplayName(currentArticle) }}</span>
                                    </div>
                                    <div v-if="currentArticle.reading_time" class="d-flex align-center">
                                      <v-icon size="16" class="me-2">mdi-play</v-icon>
                                      <span class="text-body-2"><strong>Durée:</strong> ~{{ currentArticle.reading_time }} minutes</span>
                                    </div>
                                    <div class="d-flex align-center">
                                      <v-icon size="16" class="me-2">mdi-web</v-icon>
                                      <span class="text-body-2"><strong>Plateforme:</strong> TED.com</span>
                                    </div>
                                  </div>
                                </div>

                                <!-- Pour les Podcasts -->
                                <div v-else-if="getCategorySlug(currentArticle.category) === 'podcasts'" class="podcast-info">
                                  <v-icon color="purple-darken-2" size="24" class="mb-2">mdi-headphones</v-icon>
                                  <h4 class="text-h6 mb-3">À propos de ce podcast</h4>
                                  <div class="d-flex flex-column gap-2">
                                    <div class="d-flex align-center">
                                      <v-icon size="16" class="me-2">mdi-microphone</v-icon>
                                      <span class="text-body-2"><strong>Animateur:</strong> {{ getAuthorDisplayName(currentArticle) }}</span>
                                    </div>
                                    <div v-if="currentArticle.reading_time" class="d-flex align-center">
                                      <v-icon size="16" class="me-2">mdi-headphones</v-icon>
                                      <span class="text-body-2"><strong>Durée d'écoute:</strong> ~{{ currentArticle.reading_time }} minutes</span>
                                    </div>
                                    <div class="d-flex align-center">
                                      <v-icon size="16" class="me-2">mdi-podcast</v-icon>
                                      <span class="text-body-2"><strong>Format:</strong> Podcast Audio</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </v-col>
                          </v-row>
                        </div>
                        
                        <div class="article-content text-body-1" v-if="currentArticle && currentArticle.content" v-html="sanitizeContent(currentArticle.content)"></div>
                      </div>
                    </div>
                  </div>
                </div>
                </div>

                <!-- Contenu de l'article -->
               <SocialLinks :article="currentArticle" class="mb-6" />
              </v-col>

              <!-- Sidebar pour articles reliés -->
              <v-col cols="12" md="3">
              <v-row>
                <v-col cols="12" v-for="article in sortedRecentArticles.slice(0, 3)" :key="article.id">
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
          </v-container>
        </section>
      
      </div>
      </v-main>

      <FooterSection />
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
import MediaDisplay from '@/components/MediaDisplay.vue';
import { useArticles } from '@/composables/useArticles';
import SocialLinks from '@/components/SocialLinks.vue';
import DOMPurify from 'dompurify';

// Import images
import news1Image from '@/assets/images/backgrounds/newsletter-bg.png';
import news2Image from '@/assets/images/backgrounds/newsletter-bg-2.png';
import contactIllustration from '@/assets/images/backgrounds/bg-contact.png';
import anotherIllustration from '@/assets/images/backgrounds/form-text.png';
import contactTitle from '@/assets/images/backgrounds/bgcontact-title.png';
import defaultArticleImage from '@/assets/images/articles/art-1.png';
import Breadcrumb from '@/components/Breadcrumb.vue';

const router = useRouter();
const route = useRoute();
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

  // Trier par défaut du plus récent au plus ancien
  if (sortOrder.value === 'newest' || !sortOrder.value) {
    filtered.sort((a, b) => {
      const dateA = new Date(a.published_date || a.date_created || '').getTime();
      const dateB = new Date(b.published_date || b.date_created || '').getTime();
      return dateB - dateA; // Du plus récent au plus ancien
    });
  } else if (sortOrder.value === 'oldest') {
    filtered.sort((a, b) => {
      const dateA = new Date(a.published_date || a.date_created || '').getTime();
      const dateB = new Date(b.published_date || b.date_created || '').getTime();
      return dateA - dateB; // Du plus ancien au plus récent
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

// Article courant pour affichage du détail
const selectedArticle = ref<any>(null);
const currentArticle = computed(() => {
  // Si un article est explicitement sélectionné (par le watcher de slug), le renvoyer
  if (selectedArticle.value) {
    return selectedArticle.value;
  }
  
  // Sinon, essayer de trouver l'article par slug
  const slug = route.params.slug as string;
  if (slug && articles.value && articles.value.length > 0) {
    // Rechercher l'article correspondant au slug
    const foundArticle = articles.value.find(a => a.slug === slug);
    if (foundArticle) {
      console.log('Article trouvé par slug:', foundArticle.title);
      return foundArticle;
    } else {
      console.warn(`Aucun article trouvé avec le slug: ${slug}`);
    }
  }
  // Fallback: Utilise l'article mis en avant ou le premier article
  return featuredArticle.value || articles.value[0] || null;
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

// Articles triés par date pour tous les affichages - UNIQUEMENT Carnet RH
const sortedRecentArticles = computed(() => {
  // IDs des catégories du Carnet RH uniquement
  const carnetRhCategories = [
    'fdef3633-a896-405d-a350-7dd31b3ee173', // Analyse RH
    '238e46ac-b864-48a7-93e2-1b4c6118286e', // Décryptage
    '3bbfe162-f45a-4081-9aee-f103e2669e6a', // Regard croisé
    'd41e9d68-e405-49c0-a5ec-2e17e7382327', // Tendances RH
    '6c17f47c-0b91-42a9-a171-1fc23992ba61', // Fiche pratique
    '6ac7d6e4-e3a0-42d6-b3c1-ba2ce8a70cd1', // Recrutement
    'fe540321-85dc-4e3e-9fa2-8dfd3802ebb7', // Entretien
    'c0b098b8-8b58-444d-99e5-625065f7f1f1', // Évaluation
    // Exclure les catégories développement personnel qui ne sont pas du Carnet RH analytique
    // '6f9e599a-5716-4d81-9f8e-788a32bc3f4b', // Affirmation positive
    // '6a4ebd21-d3b2-4c87-997f-961332f64903', // Ancrage
    // '921f1dee-155f-4696-9230-8c5daa45a7ce', // Confiance en soi
    // '14d544ed-7b4d-4fea-9cd0-6d1ba09a7c0f', // Respiration
  ];

  return [...articles.value]
    // Filtrer UNIQUEMENT les articles du Carnet RH (exclure multimédia et dev personnel)
    .filter(article => {
      const articleCatId = typeof article.category === 'object' 
        ? article.category?.id 
        : (typeof article.category === 'string' ? article.category : undefined);
      
      // Inclure UNIQUEMENT les catégories Carnet RH
      return carnetRhCategories.includes(articleCatId || '');
    })
    .sort((a, b) => {
      const dateA = new Date(a.published_date || a.date_created || '').getTime();
      const dateB = new Date(b.published_date || b.date_created || '').getTime();
      return dateB - dateA; // Du plus récent au plus ancien
    });
});

// Articles reliés à l'article courant
const relatedArticles = computed(() => {
  if (!currentArticle.value || !articles.value || articles.value.length <= 1) {
    return [];
  }
  
  // Essayer de trouver des articles de la même catégorie
  let related: any[] = [];
  if (currentArticle.value.category) {
    // Déterminer l'ID ou le slug de la catégorie
    let categoryId;
    if (typeof currentArticle.value.category === 'object') {
      categoryId = currentArticle.value.category.id;
    } else {
      categoryId = currentArticle.value.category;
    }
    
    // Filtrer les articles de la même catégorie (sauf l'article courant)
    related = articles.value.filter(article => {
      // Ne pas inclure l'article courant
      if (article.id === currentArticle.value?.id) {
        return false;
      }
      
      // Comparer les catégories
      let articleCategoryId;
      if (typeof article.category === 'object') {
        articleCategoryId = article.category?.id;
      } else {
        articleCategoryId = article.category;
      }
      
      return articleCategoryId === categoryId;
    });
  }
  
  // Trier les articles reliés par date du plus récent au plus ancien
  related = related.sort((a, b) => {
    const dateA = new Date(a.published_date || a.date_created || '').getTime();
    const dateB = new Date(b.published_date || b.date_created || '').getTime();
    return dateB - dateA;
  });
  
  // Si pas assez d'articles reliés, ajouter d'autres articles récents
  if (related.length < 3) {
    // Articles récents excluant l'article courant et ceux déjà dans 'related'
    const otherArticles = articles.value
      .filter(article => 
        article.id !== currentArticle.value?.id && 
        !related.some(r => r.id === article.id)
      )
      .sort((a, b) => {
        // Trier par date décroissante
        const dateA = new Date(a.published_date || a.date_created || '').getTime();
        const dateB = new Date(b.published_date || b.date_created || '').getTime();
        return dateB - dateA;
      });
    
    // Ajouter juste ce qu'il faut pour avoir 3 articles
    related = [...related, ...otherArticles.slice(0, 3 - related.length)];
  }
  
  return related.slice(0, 3);
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
  
  // Définir l'ordre de tri par défaut à "newest" (du plus récent au plus ancien)
  sortOrder.value = 'newest';
};

const retryLoad = async () => {
  error.value = null;
  loading.value = true;
  try {
    await loadArticles();
  } finally {
    loading.value = false;
  }
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

// Fonction pour vérifier si la catégorie utilise le champ cover
const shouldUseCoverImage = (article: any) => {
  if (!article.category) return false;
  
  let categorySlug = '';
  if (typeof article.category === 'object' && article.category?.slug) {
    categorySlug = article.category.slug;
  } else if (typeof article.category === 'string') {
    // Si c'est un ID, vérifier s'il correspond aux catégories spécifiques
    const coverCategories = ['1580c32a-73cf-434e-90e5-f0066d67b69a', 'c21e89a5-6314-43a3-b264-9af3a6d4cc41', '0b9edfa2-c2a8-4af1-bdf8-f027784f4e10'];
    return coverCategories.includes(article.category);
  }
  
  return ['livres', 'ted-talks', 'podcasts'].includes(categorySlug);
};

// Fonction pour obtenir le slug de la catégorie
const getCategorySlug = (category: any) => {
  if (!category) return '';
  
  if (typeof category === 'object' && category?.slug) {
    return category.slug;
  } else if (typeof category === 'string') {
    // Mapping des IDs vers les slugs
    const categoryMapping: Record<string, string> = {
      '1580c32a-73cf-434e-90e5-f0066d67b69a': 'livres',
      'c21e89a5-6314-43a3-b264-9af3a6d4cc41': 'ted-talks',
      '0b9edfa2-c2a8-4af1-bdf8-f027784f4e10': 'podcasts'
    };
    return categoryMapping[category] || '';
  }
  
  return '';
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

  // Vérifier d'abord si on doit utiliser le champ cover pour cette catégorie
  if (shouldUseCoverImage(article) && article.cover) {
    console.log('Utilisation du champ cover pour la catégorie:', article.category);
    
    // Vérifier si c'est déjà une URL complète
    if (typeof article.cover === 'string' && article.cover.startsWith('http')) {
      console.log('Cover URL complète trouvée:', article.cover);
      return article.cover;
    }

    // Construire l'URL Directus pour le champ cover
    const cacheBreaker = new Date().getTime();
    
    let imageId: string | undefined;
    if (typeof article.cover === 'object' && article.cover !== null) {
      imageId = article.cover.id;
    } else if (typeof article.cover === 'string') {
      imageId = article.cover;
    }
    
    if (imageId) {
      const imageUrl = `${directusUrl}/assets/${imageId}?width=400&height=200&fit=cover&quality=80&v=${cacheBreaker}`;
      console.log('URL cover construite:', imageUrl);
      return imageUrl;
    }
  }

  // Sinon, utiliser featured_image comme avant
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

// Fonction pour sécuriser le contenu HTML avec DOMPurify
const sanitizeContent = (content: string): string => {
  if (!content) return '';
  
  try {
    // Configuration de DOMPurify pour permettre certaines balises mais supprimer les scripts
    const purifyOptions = {
      ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'ul', 'ol', 'li', 
                    'strong', 'em', 'blockquote', 'figure', 'figcaption', 'img', 
                    'table', 'thead', 'tbody', 'tr', 'th', 'td', 'hr', 'br', 'div', 'span'],
      ALLOWED_ATTR: ['href', 'target', 'src', 'alt', 'title', 'class', 'id', 'style', 'width', 'height'],
      ADD_ATTR: ['target'], // Permet target="_blank" pour les liens
      FORBID_TAGS: ['script', 'iframe', 'form', 'input', 'button', 'svg'],
      FORBID_ATTR: ['onerror', 'onload', 'onclick']
    };

    return DOMPurify.sanitize(content, purifyOptions);
  } catch (sanitizeError) {
    console.error('Erreur lors de la désinfection du contenu:', sanitizeError);
    // En cas d'erreur, retourner le contenu sans scripts
    return DOMPurify.sanitize(content, {FORBID_TAGS: ['script']});
  }
};

// Extrait correctement le nom de l'auteur selon son format
const getAuthorDisplayName = (article: any): string => {
  if (!article) return "L'équipe MCRH";
  
  try {
    const author = article.author;
    console.log('Données de l\'auteur:', author);
    
    // Si l'auteur n'est pas défini, utiliser la valeur par défaut
    if (!author) return "L'équipe MCRH";
    
    // Si l'auteur est une chaîne, la retourner directement
    if (typeof author === 'string') return author;
    
    // Si l'auteur est un objet avec first_name et last_name
    if (typeof author === 'object' && author !== null) {
      // Format standard d'un objet auteur de Directus
      if (author.first_name && author.last_name) {
        return `${author.first_name} ${author.last_name}`;
      } 
      // Si l'auteur a juste un nom
      else if (author.name) {
        return author.name;
      } 
      // Si l'auteur a un nom d'affichage
      else if (author.display_name) {
        return author.display_name;
      }
      // Si l'auteur a un email mais pas de nom
      else if (author.email) {
        // Extraire la partie avant @ de l'email
        return author.email.split('@')[0];
      }
    }
    
    // Valeur par défaut si aucun format reconnu
    return "L'équipe MCRH";
  } catch (error) {
    console.error('Erreur lors de la récupération du nom de l\'auteur:', error);
    return "L'équipe MCRH";
  }
};

const navigateToArticle = (article: any) => {
  if (!article) {
    console.error('Aucun article fourni pour la navigation');
    return;
  }

  console.log('Navigation vers l\'article:', article.id, article.title, article.slug);

  try {
    // Réinitialiser l'article sélectionné avant la navigation pour forcer un rechargement
    selectedArticle.value = null;
    
    if (article.slug && article.slug.trim() !== '') {
      // Naviguer vers la nouvelle URL avec le slug
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

// Fonction pour charger l'article par slug
const loadArticleBySlug = async (slug: string) => {
  console.log(`Chargement de l'article avec slug: ${slug}`);
  loading.value = true;
  error.value = null;
  
  try {
    // S'assurer que les articles sont chargés
    if (articles.value.length === 0) {
      await fetchArticles();
    }
    
    // Rechercher l'article avec le slug spécifié
    const foundArticle = articles.value.find(a => a.slug === slug);
    if (foundArticle) {
      // Mettre à jour l'article sélectionné explicitement
      selectedArticle.value = foundArticle;
      console.log('Article chargé:', foundArticle.title);
    } else {
      console.error(`Aucun article trouvé avec le slug: ${slug}`);
      error.value = "Cet article n'existe pas ou a été supprimé.";
      selectedArticle.value = null;
    }
  } catch (err) {
    console.error('Erreur lors du chargement de l\'article:', err);
    error.value = "Une erreur s'est produite lors du chargement de l'article.";
    selectedArticle.value = null;
  } finally {
    loading.value = false;
  }
};

// Lifecycle
onMounted(async () => {
  console.log('Composant monté, chargement des articles');
  // Toujours charger les articles d'abord
  await loadArticles();
  
  // Ensuite, si un slug est présent, charger l'article spécifique
  const slug = route.params.slug as string;
  if (slug) {
    console.log('Slug détecté lors du montage:', slug);
    await loadArticleBySlug(slug);
  }
});

// Watchers
watch(activeTab, () => {
  currentPage.value = 1;
});

// Observer les changements de route pour charger le bon article quand le slug change
watch(() => route.params.slug, (newSlug) => {
  if (newSlug) {
    console.log('Slug changé:', newSlug);
    loadArticleBySlug(newSlug as string);
  } else {
    // Si pas de slug, réinitialiser
    selectedArticle.value = null;
    console.log('Pas de slug dans les paramètres de route');
  }
}, { immediate: true });

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
.breadcrumb-container {
  padding-top: 20px;
  position: relative;
}
.back-section{
  border: 1px solid rgb(var(--v-theme-primary));
}

.article-content-container {
  max-width: 100%;
  margin: 0 auto;
  font-size: 1.1rem;
}

.article-content {
  line-height: 1.8;
}

.article-content :deep(h2) {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 2rem 0 1rem 0;
  color: rgb(var(--v-theme-primary));
}

.article-content :deep(h3) {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 1.5rem 0 0.75rem 0;
}

.article-content :deep(p) {
  margin-bottom: 1.25rem;
}

.article-content :deep(ul),
.article-content :deep(ol) {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

.article-content :deep(li) {
  margin-bottom: 0.5rem;
}

.article-content :deep(blockquote) {
  border-left: 4px solid rgb(var(--v-theme-primary));
  padding: 1rem 1.5rem;
  margin: 1.5rem 0;
  background-color: #f8f9fa;
  font-style: italic;
}

.article-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 1.5rem 0;
}

.article-content :deep(code) {
  background-color: #f1f3f4;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
}

.article-content :deep(pre) {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  margin: 1rem 0;
}

.article-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
}

.article-content :deep(th),
.article-content :deep(td) {
  border: 1px solid #e0e0e0;
  padding: 0.75rem;
  text-align: left;
}

.article-content :deep(th) {
  background-color: #f8f9fa;
  font-weight: bold;
}

.article-content :deep(tr:nth-child(even)) {
  background-color: #f8f9fa;
}

.article-content :deep(a) {
  color: rgb(var(--v-theme-primary));
  text-decoration: underline;
  transition: color 0.2s ease;
}

.article-content :deep(a:hover) {
  color: rgb(var(--v-theme-accent));
}

/* Style des chiffres et données importantes */
.article-content :deep(.highlight) {
  font-size: 1.2rem;
  font-weight: bold;
  color: rgb(var(--v-theme-primary));
}

.article-content :deep(figure) {
  margin: 2rem 0;
  text-align: center;
}

.article-content :deep(figcaption) {
  font-size: 0.9rem;
  color: #757575;
  margin-top: 0.5rem;
  font-style: italic;
}

.featured-image-container {
  position: relative;
  margin-bottom: 2rem;
}

.featured-image {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.image-source {
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 4px 8px;
  font-size: 0.8rem;
  border-top-left-radius: 4px;
}

.article-metadata {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.metadata-item {
  flex: 1;
  min-width: 150px;
  padding: 0.5rem;
}

.metadata-icon {
  color: rgb(var(--v-theme-primary));
}

.divider {
  height: 40px;
  margin: 0 1rem;
}

.share-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  gap: 0.5rem;
}

.share-label {
  margin-bottom: 0.5rem;
}

.share-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.share-button {
  transition: transform 0.2s ease;
}

.share-button:hover {
  transform: translateY(-3px);
}

.section-divider {
  height: 4px;
  width: 60px;
  background-color: rgb(var(--v-theme-primary));
  border-radius: 2px;
}

.related-article-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.related-article-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

@media (max-width: 768px) {
  .article-content :deep(h2) {
    font-size: 1.25rem;
  }

  .article-content :deep(h3) {
    font-size: 1.1rem;
  }

  .article-content-container {
    font-size: 1rem;
  }
}

/* Styles pour la section cover */
.cover-section {
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
  border-radius: 12px;
  padding: 24px;
  border-left: 4px solid rgb(var(--v-theme-primary));
}

.cover-display {
  text-align: center;
}

.cover-image {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
}

.category-specific-info {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.book-info {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  padding: 16px;
  border-radius: 8px;
  border-left: 3px solid #2196f3;
}

.ted-info {
  background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
  padding: 16px;
  border-radius: 8px;
  border-left: 3px solid #e53935;
}

.ted-logo-small {
  color: #e53935;
  font-weight: bold;
  font-size: 16px;
  font-family: 'Helvetica Neue', sans-serif;
  letter-spacing: 1px;
}

.podcast-info {
  background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
  padding: 16px;
  border-radius: 8px;
  border-left: 3px solid #7b1fa2;
}

@media (max-width: 960px) {
  .cover-section .v-col {
    margin-bottom: 16px;
  }
  
  .category-specific-info {
    justify-content: flex-start;
  }
}
</style>
