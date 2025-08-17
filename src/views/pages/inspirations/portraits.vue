<template>
  <v-app>
    <NavBars v-model:drawer="drawer" />
    
    <v-navigation-drawer v-model="drawer" temporary app location="right" width="300">
      <!-- Mobile menu content -->
    </v-navigation-drawer>

    <v-main>
      <HeroSection>
        <v-container class="nav-container">
          <v-row align="center" justify="center">
            <v-col cols="12" md="8" class="text-center">
              <h1 class="text-h2 font-weight-bold mb-6">
                <span class="text-accent-hero">Portraits</span>
                <span class="text-primary-hero">d'Experts</span>
              </h1>
              <p class="text-subtitle-1 font-weight-regular text-grey-darken-1 mb-8">
                Découvrez les parcours inspirants de nos experts RH
              </p>
            </v-col>
          </v-row>
        </v-container>
      </HeroSection>

      <!-- Section des filtres -->
      <section class="py-8 bg-grey-lighten-5">
        <v-container>
          <v-row>
            <v-col cols="12">
              <div class="d-flex flex-wrap justify-center gap-3">
                <v-btn
                  variant="tonal" color="primary" class="rounded-pill mx-1 my-1"
                  :class="{ 'active-filter': activeFilter === 'all' }"
                  @click="setActiveFilter('all')"
                  rounded="pill"
                >
                  {{ getFilterDisplayName('all') }}
                </v-btn>
                <v-btn
                  variant="tonal" color="primary" class="rounded-pill mx-1 my-1"
                  :class="{ 'active-filter': activeFilter === 'livres' }"
                  @click="setActiveFilter('livres')"
                  rounded="pill"
                >
                  {{ getFilterDisplayName('livres') }}
                </v-btn>
                <v-btn
                  variant="tonal" color="primary" class="rounded-pill mx-1 my-1"
                  :class="{ 'active-filter': activeFilter === 'podcasts' }"
                  @click="setActiveFilter('podcasts')"
                  rounded="pill"
                >
                  {{ getFilterDisplayName('podcasts') }}
                </v-btn>
                <v-btn
                  variant="tonal" color="primary" class="rounded-pill mx-1 my-1"
                  :class="{ 'active-filter': activeFilter === 'ted-talks' }"
                  @click="setActiveFilter('ted-talks')"
                  rounded="pill"
                >
                  {{ getFilterDisplayName('ted-talks') }}
                </v-btn>
                <v-btn
                  variant="tonal" color="primary" class="rounded-pill mx-1 my-1"
                  :class="{ 'active-filter': activeFilter === 'portraits' }"
                  @click="setActiveFilter('portraits')"
                  rounded="pill"
                >
                  {{ getFilterDisplayName('portraits') }}
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- Contenu des portraits -->
      <section class="py-16">
        <v-container>
          <!-- Header de la section -->
          <v-row>
            <v-col cols="12" md="4">
              <div class="sidebar-content">
                <h2 class="text-h4 font-weight-bold mb-4">{{ getSidebarTitle(activeFilter) }}</h2>
                <p class="text-grey-darken-1 mb-6">
                  Rencontrez les personnalités qui façonnent l'avenir des ressources humaines. 
                  Leurs parcours et leurs visions vous inspireront.
                </p>
                
                <!-- Statistiques -->
                <div class="stats-grid">
                  <div class="stat-item">
                    <div class="stat-number">{{ portraitsArticles.length }}</div>
                    <div class="stat-label">Portrait{{ portraitsArticles.length > 1 ? 's' : '' }} disponible{{ portraitsArticles.length > 1 ? 's' : '' }}</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-number">{{ getTotalExperts() }}</div>
                    <div class="stat-label">Expert{{ getTotalExperts() > 1 ? 's' : '' }} présenté{{ getTotalExperts() > 1 ? 's' : '' }}</div>
                  </div>
                </div>
              </div>
            </v-col>
            
            <v-col cols="12" md="8">
              <!-- Portrait mis en avant -->
              <div v-if="featuredPortrait" class="mb-8">
                <v-card elevation="0" class="rounded-lg overflow-hidden portrait-featured-card mb-6" @click="navigateToArticle(featuredPortrait)">
                  <v-row no-gutters>
                    <v-col cols="12" md="6">
                      <div class="portrait-image-large">
                        <MediaDisplay
                          :media-file="featuredPortrait.cover || featuredPortrait.featured_image"
                          :height="400"
                          image-class="portrait-featured-image"
                          show-placeholder
                        />
                        <div class="portrait-overlay">
                          <div class="portrait-badge">
                            <v-chip color="green-darken-2" size="small" prepend-icon="mdi-account-star">
                              Portrait recommandé
                            </v-chip>
                          </div>
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-card-text class="pa-6 d-flex flex-column h-100">
                        <h3 class="text-h4 font-weight-bold mb-3">{{ featuredPortrait.title }}</h3>
                        <p class="text-body-1 text-grey-darken-1 mb-4 flex-grow-1">
                          {{ featuredPortrait.excerpt || 'Découvrez le parcours et les insights de cet expert RH.' }}
                        </p>
                        
                        <div class="portrait-meta d-flex align-center justify-space-between">
                          <div class="d-flex align-center">
                            <v-icon size="small" color="grey-darken-1" class="me-1">mdi-calendar</v-icon>
                            <span class="text-caption text-grey-darken-1">
                              {{ formatDate(featuredPortrait.published_date || featuredPortrait.date_created) }}
                            </span>
                          </div>
                          <div class="d-flex align-center">
                            <span class="text-caption text-grey-darken-1 me-2">Par</span>
                            <span class="text-caption font-weight-medium">{{ getAuthorDisplayName(featuredPortrait) }}</span>
                          </div>
                        </div>
                      </v-card-text>
                    </v-col>
                  </v-row>
                </v-card>
              </div>

              <!-- Grille des autres portraits -->
              <div v-if="otherPortraits.length > 0">
                <h3 class="text-h5 font-weight-bold mb-6">Autres portraits</h3>
                <v-row>
                  <v-col 
                    v-for="portrait in otherPortraits" 
                    :key="portrait.id" 
                    cols="12" 
                    sm="6"
                    class="mb-4"
                  >
                    <v-card 
                      elevation="0" 
                      class="h-100 portrait-card"
                      @click="navigateToArticle(portrait)"
                    >
                      <div class="portrait-image-container">
                        <MediaDisplay
                          :media-file="portrait.cover || portrait.featured_image"
                          :height="250"
                          image-class="portrait-image"
                          show-placeholder
                        />
                        <div class="portrait-card-overlay">
                          <v-btn
                            icon="mdi-arrow-right"
                            color="white"
                            size="small"
                            class="portrait-preview-btn"
                          ></v-btn>
                        </div>
                      </div>
                      
                      <v-card-text class="pa-4">
                        <div class="d-flex align-center justify-space-between mb-2">
                          <span class="text-green-darken-2 text-caption font-weight-bold portrait-logo">
                            PORTRAIT
                          </span>
                          <span class="text-caption text-grey-darken-1">
                            {{ formatDate(portrait.published_date || portrait.date_created) }}
                          </span>
                        </div>
                        
                        <h4 class="text-h6 font-weight-bold mb-2 portrait-title">
                          {{ portrait.title }}
                        </h4>
                        
                        <p class="text-body-2 text-grey-darken-1 portrait-excerpt">
                          {{ portrait.excerpt || 'Découvrez ce portrait inspirant.' }}
                        </p>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </div>
            </v-col>
          </v-row>

          <!-- Message si aucun portrait -->
          <div v-if="portraitsArticles.length === 0" class="text-center py-8">
            <v-card flat class="pa-8">
              <v-icon color="grey-lighten-1" size="64">mdi-account-group-outline</v-icon>
              <h3 class="text-h5 mt-4 mb-2">Aucun portrait disponible</h3>
              <p class="text-grey-darken-1">
                De nouveaux portraits d'experts RH seront bientôt disponibles.
              </p>
            </v-card>
          </div>
        </v-container>
      </section>

      <NewsletterSection :newsIconImage="news1Image" :illustrationImage="news2Image" class="mt-16" />
      <ContactSection :mainIllustration="contactIllustration" :secondaryIllustration="anotherIllustration" :decorativeImage="contactTitle" />
      <FooterSection />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import NavBars from '@/components/NavBars.vue';
import HeroSection from '@/components/HeroSection.vue';
import MediaDisplay from '@/components/MediaDisplay.vue';
import NewsletterSection from '@/components/NewsletterSection.vue';
import ContactSection from '@/components/ContactSection.vue';
import FooterSection from '@/components/FooterSection.vue';
import { useArticles } from '@/composables/useArticles';

// Images
import news1Image from '@/assets/images/backgrounds/newsletter-bg.png';
import news2Image from '@/assets/images/backgrounds/newsletter-bg-2.png';
import contactIllustration from '@/assets/images/backgrounds/bg-contact.png';
import anotherIllustration from '@/assets/images/backgrounds/form-text.png';
import contactTitle from '@/assets/images/backgrounds/bgcontact-title.png';

const router = useRouter();
const drawer = ref(false);

// Composable des articles
const {
  articles,
  categories,
  loading,
  error,
  fetchArticles,
  fetchCategories,
} = useArticles();

// État du filtre actif
const activeFilter = ref('portraits'); // Par défaut sur portraits car on est sur la page portraits

// IDs des catégories multimédia
const multimediaCategories = {
  livres: '7a76533b-411d-4760-b396-f6ac1509394f',
  podcasts: '398dc937-9b9d-4c2d-93f0-ec9cdd2995ff',
  'ted-talks': 'a1ffbb1b-8b84-49a4-bd58-8a6b5220cee0',
  portraits: '99eb2c11-824e-4b99-a57d-39224dd145e4'
};

// Fonctions utilitaires pour les noms des filtres
const getFilterDisplayName = (filter: string): string => {
  const names = {
    'all': 'Toutes les inspirations',
    'livres': 'Livres',
    'podcasts': 'Podcasts', 
    'ted-talks': 'TED Talks',
    'portraits': 'Portraits'
  };
  return names[filter as keyof typeof names] || filter;
};

const getSidebarTitle = (filter: string): string => {
  const titles = {
    'all': 'Inspirations multimédia',
    'livres': 'Sélection de livres RH',
    'podcasts': 'Podcasts recommandés',
    'ted-talks': 'Conférences TED inspirantes', 
    'portraits': 'Portraits d\'experts'
  };
  return titles[filter as keyof typeof titles] || 'Inspirations';
};

// Fonction pour gérer les filtres (navigation ou local)
const setActiveFilter = (filter: string) => {
  activeFilter.value = filter;
  
  switch (filter) {
    case 'all':
      router.push('/carnet-rh/articles');
      break;
    case 'livres':
      router.push('/inspirations/livres');
      break;
    case 'podcasts':
      router.push('/inspirations/podcasts');
      break;
    case 'ted-talks':
      router.push('/inspirations/ted-talks');
      break;
    case 'portraits':
      // On reste sur la page actuelle
      break;
  }
};

// Filtrer les articles selon le filtre actif
const filteredArticles = computed(() => {
  if (activeFilter.value === 'all') {
    // Afficher tous les articles multimédia
    return articles.value.filter(article => {
      const categoryId = typeof article.category === 'string' 
        ? article.category 
        : article.category?.id;
      
      const multimediaCategoryIds = [
        multimediaCategories.livres,
        multimediaCategories.podcasts,
        multimediaCategories['ted-talks'],
        multimediaCategories.portraits
      ];
      
      return multimediaCategoryIds.includes(categoryId || '');
    });
  } else {
    // Filtrer par catégorie spécifique
    const targetCategoryId = multimediaCategories[activeFilter.value as keyof typeof multimediaCategories];
    return articles.value.filter(article => {
      const categoryId = typeof article.category === 'string' 
        ? article.category 
        : article.category?.id;
      return categoryId === targetCategoryId;
    });
  }
});

// Articles de type "Portraits" (utiliser la nouvelle logique de filtrage)
const portraitsArticles = computed(() => {
  return filteredArticles.value;
});

// Portrait mis en avant (le plus récent)
const featuredPortrait = computed(() => {
  const sorted = [...portraitsArticles.value].sort((a, b) => {
    const dateA = new Date(a.published_date || a.date_created || '').getTime();
    const dateB = new Date(b.published_date || b.date_created || '').getTime();
    return dateB - dateA;
  });
  return sorted[0] || null;
});

// Autres portraits (excluant le portrait mis en avant)
const otherPortraits = computed(() => {
  if (!featuredPortrait.value) return portraitsArticles.value;
  return portraitsArticles.value.filter(portrait => portrait.id !== featuredPortrait.value?.id);
});

// Fonctions utilitaires
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const getAuthorDisplayName = (article: any): string => {
  if (!article.author) return 'Auteur inconnu';
  
  if (typeof article.author === 'object') {
    const firstName = article.author.first_name || '';
    const lastName = article.author.last_name || '';
    return `${firstName} ${lastName}`.trim() || 'Auteur inconnu';
  }
  
  return 'Auteur inconnu';
};

const getTotalExperts = (): number => {
  const uniqueAuthors = new Set();
  portraitsArticles.value.forEach(portrait => {
    if (portrait.author) {
      const authorName = getAuthorDisplayName(portrait);
      if (authorName !== 'Auteur inconnu') {
        uniqueAuthors.add(authorName);
      }
    }
  });
  return uniqueAuthors.size || portraitsArticles.value.length;
};

const navigateToArticle = (article: any) => {
  if (!article) {
    console.error('Aucun article fourni pour la navigation');
    return;
  }

  console.log('Navigation vers le portrait:', article.id, article.title, article.slug);

  try {
    if (article.slug && article.slug.trim() !== '') {
      router.push(`/carnet-rh/articles/${article.slug}`);
    } else if (article.id) {
      router.push(`/carnet-rh/articles/${article.id}`);
    } else {
      console.error('Portrait sans slug ni ID:', article);
    }
  } catch (error) {
    console.error('Erreur lors de la navigation:', error);
  }
};

// Chargement des données
const loadData = async () => {
  try {
    await fetchCategories();
    await fetchArticles();
  } catch (err) {
    console.error('Erreur lors du chargement des données:', err);
  }
};

onMounted(() => {
  loadData();
});
</script>

<style scoped>
/* Styles pour les filtres actifs */
.active-filter {
   background-color: rgb(var(--v-theme-primary)) !important;
  color: white !important;
}

.active-filter .v-btn__content {
  color: white !important;
}

/* Sidebar */
.sidebar-content {
  position: sticky;
  top: 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.stat-item {
  text-align: center;
  padding: 16px;
  background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
  border-radius: 12px;
  color: white;
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  line-height: 1;
}

.stat-label {
  font-size: 0.875rem;
  opacity: 0.9;
  margin-top: 4px;
}

/* Styles pour les portraits */
.portrait-featured-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;
}

.portrait-featured-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.portrait-image-large {
  height: 400px;
  position: relative;
  overflow: hidden;
}

.portrait-featured-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.portrait-overlay {
  position: absolute;
  top: 16px;
  left: 16px;
  right: 16px;
  bottom: 16px;
  background: rgba(76, 175, 80, 0.1);
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 8px;
}

.portrait-featured-card:hover .portrait-overlay {
  opacity: 1;
}

.portrait-badge {
  margin: 8px;
}

.portrait-meta {
  border-top: 1px solid #e0e0e0;
  padding-top: 16px;
}

/* Cartes de portraits */
.portrait-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;
}

.portrait-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.portrait-card:hover .portrait-card-overlay {
  opacity: 1;
}

.portrait-image-container {
  position: relative;
  overflow: hidden;
}

.portrait-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.portrait-card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(76, 175, 80, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.portrait-preview-btn {
  backdrop-filter: blur(4px);
}

.portrait-logo {
  color: #4caf50;
  font-weight: bold;
  font-size: 12px;
  letter-spacing: 1px;
}

.portrait-title {
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.portrait-excerpt {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Responsive */
@media (max-width: 960px) {
  .sidebar-content {
    position: relative;
    margin-bottom: 2rem;
  }
  
  .portrait-featured-card .v-row {
    flex-direction: column;
  }
  
  .portrait-image-large {
    height: 300px;
  }
  
  .text-h4 {
    font-size: 1.5rem !important;
  }
  
  .stats-grid {
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
}

@media (max-width: 600px) {
  .portrait-image-large {
    height: 250px;
  }
  
  .text-h2 {
    font-size: 2rem !important;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>