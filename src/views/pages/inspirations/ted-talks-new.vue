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
              <div class="d-flex align-center justify-center mb-6">
                <v-icon size="48" color="red-darken-2" class="me-4">mdi-play-circle</v-icon>
                <h1 class="text-h2 font-weight-bold">
                  <span class="text-accent-hero">TED Talks</span>
                  <span class="text-primary-hero">RH</span>
                </h1>
              </div>
              <p class="text-subtitle-1 font-weight-regular text-grey-darken-1 mb-8">
                Découvrez les conférences TED les plus inspirantes sur les ressources humaines et le leadership
              </p>
            </v-col>
          </v-row>
        </v-container>
      </HeroSection>

      <!-- Filtres de catégories -->
      <section class="pb-4 pt-2">
        <v-container class="nav-container">
          <div class="d-flex justify-center flex-wrap">
            <!-- Bouton "Tous les articles" -->
            <v-btn variant="tonal" color="primary" class="rounded-pill mx-1 my-1"
              :class="{ 'active-filter': activeFilter === 'all' }"
              @click="setActiveFilter('all')">
              {{ getFilterDisplayName('all') }}
            </v-btn>
            <!-- Boutons des catégories multimédia -->
            <v-btn variant="tonal" color="primary" class="rounded-pill mx-1 my-1"
              :class="{ 'active-filter': activeFilter === 'livres' }"
              @click="setActiveFilter('livres')">
              {{ getFilterDisplayName('livres') }}
            </v-btn>
            <v-btn variant="tonal" color="primary" class="rounded-pill mx-1 my-1"
              :class="{ 'active-filter': activeFilter === 'podcasts' }"
              @click="setActiveFilter('podcasts')">
              {{ getFilterDisplayName('podcasts') }}
            </v-btn>
            <v-btn variant="tonal" color="primary" class="rounded-pill mx-1 my-1"
              :class="{ 'active-filter': activeFilter === 'ted-talks' }"
              @click="setActiveFilter('ted-talks')">
              {{ getFilterDisplayName('ted-talks') }}
            </v-btn>
            <v-btn variant="tonal" color="primary" class="rounded-pill mx-1 my-1"
              :class="{ 'active-filter': activeFilter === 'portraits' }"
              @click="setActiveFilter('portraits')">
              {{ getFilterDisplayName('portraits') }}
            </v-btn>
          </div>
        </v-container>
      </section>

      <!-- État de chargement -->
      <section v-if="loading" class="py-8">
        <v-container class="nav-container">
          <div class="text-center">
            <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
            <p class="mt-4">Chargement des TED Talks...</p>
          </div>
        </v-container>
      </section>

      <!-- Contenu des TED Talks -->
      <section v-else class="py-6">
        <v-container class="nav-container">
          <v-row v-if="tedTalksArticles.length > 0">
            <!-- TED Talk principal -->
            <v-col cols="12" v-if="featuredTedTalk">
              <v-card elevation="0" class="rounded-lg overflow-hidden ted-featured-card mb-6" @click="navigateToArticle(featuredTedTalk)">
                <v-row no-gutters>
                  <v-col cols="12" md="6">
                    <div class="ted-video-large">
                      <MediaDisplay
                        :media-file="featuredTedTalk.cover || featuredTedTalk.featured_image"
                        :height="400"
                        image-class="ted-video-image"
                        show-placeholder
                      />
                      <div class="ted-play-overlay">
                        <div class="ted-play-container">
                          <v-btn
                            icon="mdi-play"
                            color="white"
                            size="x-large"
                            class="ted-play-btn"
                          ></v-btn>
                          <div class="ted-logo">TED</div>
                        </div>
                      </div>
                    </div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-card-text class="pa-6 d-flex flex-column h-100">
                      <div class="ted-badge mb-3">
                        <v-chip color="red-darken-2" size="small" prepend-icon="mdi-microphone-variant">
                          Conférence recommandée
                        </v-chip>
                      </div>
                      <h2 class="text-h4 font-weight-bold mb-3">{{ featuredTedTalk.title }}</h2>
                      <p class="text-body-1 mb-4">{{ featuredTedTalk.excerpt }}</p>
                      <div class="ted-meta mt-auto">
                        <div class="d-flex align-center mb-2">
                          <v-icon size="16" class="me-2">mdi-microphone-variant</v-icon>
                          <span class="text-body-2"><strong>Orateur :</strong> {{ getAuthorDisplayName(featuredTedTalk) }}</span>
                        </div>
                        <div v-if="featuredTedTalk.reading_time" class="d-flex align-center mb-2">
                          <v-icon size="16" class="me-2">mdi-play</v-icon>
                          <span class="text-body-2"><strong>Durée :</strong> ~{{ featuredTedTalk.reading_time }} minutes</span>
                        </div>
                        <div class="d-flex align-center">
                          <v-icon size="16" class="me-2">mdi-web</v-icon>
                          <span class="text-body-2"><strong>Plateforme :</strong> TED.com</span>
                        </div>
                      </div>
                    </v-card-text>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>

            <!-- Statistiques TED -->
            <v-col cols="12">
              <v-row>
                <v-col cols="12" md="3" sm="6">
                  <v-card flat class="text-center pa-4 gradient-card-red">
                    <v-icon size="32" color="white" class="mb-2">mdi-video</v-icon>
                    <h3 class="text-h4 font-weight-bold text-white">{{ tedTalksArticles.length }}</h3>
                    <p class="text-body-2 text-white">Conférences</p>
                  </v-card>
                </v-col>
                <v-col cols="12" md="3" sm="6">
                  <v-card flat class="text-center pa-4 gradient-card-orange">
                    <v-icon size="32" color="white" class="mb-2">mdi-account-group</v-icon>
                    <h3 class="text-h4 font-weight-bold text-white">{{ getTotalSpeakers() }}</h3>
                    <p class="text-body-2 text-white">Orateurs experts</p>
                  </v-card>
                </v-col>
                <v-col cols="12" md="3" sm="6">
                  <v-card flat class="text-center pa-4 gradient-card-blue">
                    <v-icon size="32" color="white" class="mb-2">mdi-clock-outline</v-icon>
                    <h3 class="text-h4 font-weight-bold text-white">{{ getTotalDuration() }}</h3>
                    <p class="text-body-2 text-white">Minutes de contenu</p>
                  </v-card>
                </v-col>
                <v-col cols="12" md="3" sm="6">
                  <v-card flat class="text-center pa-4 gradient-card-green">
                    <v-icon size="32" color="white" class="mb-2">mdi-trending-up</v-icon>
                    <h3 class="text-h4 font-weight-bold text-white">100%</h3>
                    <p class="text-body-2 text-white">Qualité TED</p>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <!-- Grille des autres TED Talks -->
          <v-row class="mt-6">
            <v-col cols="12">
              <h3 class="text-h5 font-weight-bold mb-6">Toutes les conférences TED</h3>
            </v-col>
            <v-col v-for="tedTalk in otherTedTalks" :key="tedTalk.id" cols="12" sm="6" md="4">
              <v-card class="ted-card h-100" flat @click="navigateToArticle(tedTalk)">
                <div class="ted-video-container">
                  <MediaDisplay
                    :media-file="tedTalk.cover || tedTalk.featured_image"
                    :height="200"
                    image-class="ted-video"
                    show-placeholder
                  />
                  <div class="ted-overlay">
                    <v-btn
                      icon="mdi-play"
                      color="white"
                      size="large"
                      class="ted-preview-btn"
                    ></v-btn>
                  </div>
                  <div class="ted-duration-badge" v-if="tedTalk.reading_time">
                    {{ tedTalk.reading_time }}min
                  </div>
                </div>
                <v-card-text class="pa-4">
                  <div class="d-flex align-center mb-2">
                    <div class="ted-logo-small me-2">TED</div>
                    <span class="text-caption text-red-darken-2 font-weight-medium">TALK</span>
                  </div>
                  <h4 class="text-h6 font-weight-bold mb-2 ted-title">{{ tedTalk.title }}</h4>
                  <p class="text-body-2 text-grey-darken-1 mb-3 ted-excerpt">{{ tedTalk.excerpt }}</p>
                  <div class="d-flex align-center justify-space-between">
                    <span class="text-caption text-grey-darken-1">{{ getAuthorDisplayName(tedTalk) }}</span>
                    <span class="text-caption text-grey-darken-1">{{ formatDate(tedTalk.published_date || tedTalk.date_created) }}</span>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <!-- État vide -->
          <div v-if="tedTalksArticles.length === 0" class="text-center py-8">
            <v-card flat class="pa-8">
              <v-icon color="grey-lighten-1" size="64">mdi-play-circle-outline</v-icon>
              <h3 class="text-h5 mt-4 mb-2">Aucune conférence TED disponible</h3>
              <p class="text-grey-darken-1">
                De nouvelles conférences TED sur les RH seront bientôt disponibles.
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
import { MULTIMEDIA_CATEGORIES } from '@/utils/articleUtils';

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
const activeFilter = ref('ted-talks'); // Par défaut sur ted-talks car on est sur la page ted-talks

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
      // Rester sur la page actuelle pour "Tous les articles"
      break;
    case 'livres':
      router.push('/inspirations/livres');
      break;
    case 'podcasts':
      router.push('/inspirations/podcasts');
      break;
    case 'ted-talks':
      // On reste sur la page actuelle
      break;
    case 'portraits':
      router.push('/inspirations/portraits');
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

// Articles de type "TED Talks" (utiliser la nouvelle logique de filtrage)
const tedTalksArticles = computed(() => {
  return filteredArticles.value;
});

// TED Talk mis en avant (le plus récent)
const featuredTedTalk = computed(() => {
  const sorted = [...tedTalksArticles.value].sort((a, b) => {
    const dateA = new Date(a.published_date || a.date_created || '').getTime();
    const dateB = new Date(b.published_date || b.date_created || '').getTime();
    return dateB - dateA;
  });
  return sorted[0] || null;
});

// Autres TED Talks (excluant le TED Talk mis en avant)
const otherTedTalks = computed(() => {
  if (!featuredTedTalk.value) return tedTalksArticles.value;
  return tedTalksArticles.value.filter(tedTalk => tedTalk.id !== featuredTedTalk.value?.id);
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
  if (!article.author) return 'Orateur inconnu';
  
  if (typeof article.author === 'object') {
    const firstName = article.author.first_name || '';
    const lastName = article.author.last_name || '';
    return `${firstName} ${lastName}`.trim() || 'Orateur inconnu';
  }
  
  return 'Orateur inconnu';
};

const getTotalSpeakers = (): number => {
  const uniqueAuthors = new Set();
  tedTalksArticles.value.forEach(tedTalk => {
    if (tedTalk.author) {
      const authorName = getAuthorDisplayName(tedTalk);
      if (authorName !== 'Orateur inconnu') {
        uniqueAuthors.add(authorName);
      }
    }
  });
  return uniqueAuthors.size || tedTalksArticles.value.length;
};

const getTotalDuration = (): number => {
  return tedTalksArticles.value.reduce((total, tedTalk) => {
    return total + (tedTalk.reading_time || 18); // 18 minutes par défaut pour un TED Talk
  }, 0);
};

const navigateToArticle = (article: any) => {
  if (!article) {
    console.error('Aucun article fourni pour la navigation');
    return;
  }

  console.log('Navigation vers le TED Talk:', article.id, article.title, article.slug);

  try {
    if (article.slug && article.slug.trim() !== '') {
      router.push(`/carnet-rh/articles/${article.slug}`);
    } else if (article.id) {
      router.push(`/carnet-rh/articles/${article.id}`);
    } else {
      console.error('TED Talk sans slug ni ID:', article);
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

/* Styles pour les TED Talks */
.ted-featured-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;
}

.ted-featured-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.ted-video-large {
  height: 400px;
  position: relative;
  overflow: hidden;
}

.ted-video-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.ted-play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(229, 57, 53, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.ted-featured-card:hover .ted-play-overlay {
  opacity: 1;
}

.ted-play-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.ted-play-btn {
  backdrop-filter: blur(4px);
  margin-bottom: 8px;
}

.ted-logo {
  color: white;
  font-weight: bold;
  font-size: 24px;
  font-family: 'Helvetica Neue', sans-serif;
  letter-spacing: 2px;
}

.ted-badge {
  align-self: flex-start;
}

.ted-meta {
  border-top: 1px solid #e0e0e0;
  padding-top: 16px;
}

/* Cartes de statistiques */
.gradient-card-red {
  background: linear-gradient(135deg, #e53935 0%, #c62828 100%);
}

.gradient-card-orange {
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
}

.gradient-card-blue {
  background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
}

.gradient-card-green {
  background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
}

.ted-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;
}

.ted-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.ted-card:hover .ted-overlay {
  opacity: 1;
}

.ted-video-container {
  position: relative;
  overflow: hidden;
}

.ted-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.ted-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(229, 57, 53, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.ted-preview-btn {
  backdrop-filter: blur(4px);
}

.ted-duration-badge {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.ted-logo-small {
  color: #e53935;
  font-weight: bold;
  font-size: 14px;
  font-family: 'Helvetica Neue', sans-serif;
  letter-spacing: 1px;
}

.ted-title {
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.ted-excerpt {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Responsive */
@media (max-width: 960px) {
  .ted-featured-card .v-row {
    flex-direction: column;
  }
  
  .ted-video-large {
    height: 300px;
  }
  
  .text-h4 {
    font-size: 1.5rem !important;
  }
}

@media (max-width: 600px) {
  .ted-video-large {
    height: 250px;
  }
  
  .text-h2 {
    font-size: 2rem !important;
  }
}
</style>
