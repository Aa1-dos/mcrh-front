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
                <v-icon size="48" color="purple-darken-2" class="me-4">mdi-headphones</v-icon>
                <h1 class="text-h2 font-weight-bold">
                  <span class="text-accent-hero">Podcasts</span>
                  <span class="text-primary-hero">RH</span>
                </h1>
              </div>
              <p class="text-subtitle-1 font-weight-regular text-grey-darken-1 mb-8">
                Écoutez les meilleurs podcasts sur les ressources humaines et le management
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

      <!-- Contenu des podcasts -->
      <section class="py-16">
        <v-container>
          <!-- Header de la section -->
          <v-row>
            <v-col cols="12" md="4">
              <div class="sidebar-content">
                <h2 class="text-h4 font-weight-bold mb-4">{{ getSidebarTitle(activeFilter) }}</h2>
                <p class="text-grey-darken-1 mb-6">
                  Écoutez les conseils et analyses des meilleurs experts RH. 
                  Des conversations inspirantes pour enrichir vos connaissances.
                </p>
                
                <!-- Statistiques -->
                <div class="stats-grid">
                  <div class="stat-item">
                    <div class="stat-number">{{ podcastsArticles.length }}</div>
                    <div class="stat-label">Épisode{{ podcastsArticles.length > 1 ? 's' : '' }} disponible{{ podcastsArticles.length > 1 ? 's' : '' }}</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-number">{{ getTotalDuration() }}</div>
                    <div class="stat-label">Minutes d'écoute totales</div>
                  </div>
                </div>
              </div>
            </v-col>
            
            <v-col cols="12" md="8">
              <!-- Podcast mis en avant -->
              <div v-if="featuredPodcast" class="mb-8">
                <v-card elevation="0" class="rounded-lg overflow-hidden podcast-featured-card mb-6" @click="navigateToArticle(featuredPodcast)">
                  <v-row no-gutters>
                    <v-col cols="12" md="6">
                      <div class="podcast-cover-large">
                        <MediaDisplay
                          :media-file="featuredPodcast.cover || featuredPodcast.featured_image"
                          :height="400"
                          image-class="podcast-featured-cover"
                          show-placeholder
                        />
                        <div class="podcast-play-overlay">
                          <div class="podcast-play-container">
                            <v-btn
                              icon="mdi-play"
                              color="white"
                              size="x-large"
                              class="podcast-play-btn"
                            ></v-btn>
                            <div class="podcast-logo">PODCAST</div>
                          </div>
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-card-text class="pa-6 d-flex flex-column h-100">
                        <div class="podcast-badge mb-3">
                          <v-chip color="purple-darken-2" size="small" prepend-icon="mdi-microphone">
                            Épisode recommandé
                          </v-chip>
                        </div>
                        <h3 class="text-h4 font-weight-bold mb-3">{{ featuredPodcast.title }}</h3>
                        <p class="text-body-1 text-grey-darken-1 mb-4 flex-grow-1">
                          {{ featuredPodcast.excerpt || 'Découvrez ce podcast passionnant sur les RH.' }}
                        </p>
                        
                        <div class="podcast-meta d-flex flex-column gap-2">
                          <div class="d-flex align-center">
                            <v-icon size="small" color="grey-darken-1" class="me-2">mdi-microphone</v-icon>
                            <span class="text-caption text-grey-darken-1">
                              <strong>Animateur:</strong> {{ getAuthorDisplayName(featuredPodcast) }}
                            </span>
                          </div>
                          <div class="d-flex align-center">
                            <v-icon size="small" color="grey-darken-1" class="me-2">mdi-clock-outline</v-icon>
                            <span class="text-caption text-grey-darken-1">
                              <strong>Durée:</strong> {{ featuredPodcast.reading_time || 30 }} minutes
                            </span>
                          </div>
                          <div class="d-flex align-center">
                            <v-icon size="small" color="grey-darken-1" class="me-2">mdi-calendar</v-icon>
                            <span class="text-caption text-grey-darken-1">
                              {{ formatDate(featuredPodcast.published_date || featuredPodcast.date_created) }}
                            </span>
                          </div>
                        </div>
                      </v-card-text>
                    </v-col>
                  </v-row>
                </v-card>
              </div>

              <!-- Grille des autres podcasts -->
              <div v-if="otherPodcasts.length > 0">
                <h3 class="text-h5 font-weight-bold mb-6">Autres épisodes</h3>
                <v-row>
                  <v-col 
                    v-for="podcast in otherPodcasts" 
                    :key="podcast.id" 
                    cols="12" 
                    sm="6"
                    class="mb-4"
                  >
                    <v-card 
                      elevation="0" 
                      class="h-100 podcast-card"
                      @click="navigateToArticle(podcast)"
                    >
                      <div class="podcast-cover-container">
                        <MediaDisplay
                          :media-file="podcast.cover || podcast.featured_image"
                          :height="200"
                          image-class="podcast-cover"
                          show-placeholder
                        />
                        <div class="podcast-card-overlay">
                          <v-btn
                            icon="mdi-play"
                            color="white"
                            size="large"
                            class="podcast-preview-btn"
                          ></v-btn>
                        </div>
                      </div>
                      
                      <v-card-text class="pa-4">
                        <div class="d-flex align-center justify-space-between mb-2">
                          <span class="text-purple-darken-2 text-caption font-weight-bold podcast-logo-small">
                            PODCAST
                          </span>
                          <span class="text-caption text-grey-darken-1">
                            {{ formatDate(podcast.published_date || podcast.date_created) }}
                          </span>
                        </div>
                        
                        <h4 class="text-h6 font-weight-bold mb-2 podcast-title">
                          {{ podcast.title }}
                        </h4>
                        
                        <p class="text-body-2 text-grey-darken-1 mb-3 podcast-excerpt">
                          {{ podcast.excerpt || 'Découvrez cet épisode passionnant.' }}
                        </p>

                        <div class="d-flex align-center justify-space-between">
                          <span class="text-caption text-grey-darken-1">{{ getAuthorDisplayName(podcast) }}</span>
                          <div class="d-flex align-center">
                            <v-icon size="12" class="me-1">mdi-clock-outline</v-icon>
                            <span class="text-caption text-grey-darken-1">{{ podcast.reading_time || '30' }}min</span>
                          </div>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </div>
            </v-col>
          </v-row>

          <!-- Message si aucun podcast -->
          <div v-if="podcastsArticles.length === 0" class="text-center py-8">
            <v-card flat class="pa-8">
              <v-icon color="grey-lighten-1" size="64">mdi-headphones</v-icon>
              <h3 class="text-h5 mt-4 mb-2">Aucun podcast disponible</h3>
              <p class="text-grey-darken-1">
                De nouveaux épisodes de podcasts RH seront bientôt disponibles.
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
const activeFilter = ref('podcasts'); // Par défaut sur podcasts car on est sur la page podcasts

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
      // On reste sur la page et on affiche tous les contenus multimédia
      break;
    case 'livres':
      router.push('/inspirations/livres');
      break;
    case 'podcasts':
      // On reste sur la page actuelle
      break;
    case 'ted-talks':
      router.push('/inspirations/ted-talks');
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

// Articles de type "Podcasts" (utiliser la nouvelle logique de filtrage)
const podcastsArticles = computed(() => {
  return filteredArticles.value;
});

// Podcast mis en avant (le plus récent)
const featuredPodcast = computed(() => {
  const sorted = [...podcastsArticles.value].sort((a, b) => {
    const dateA = new Date(a.published_date || a.date_created || '').getTime();
    const dateB = new Date(b.published_date || b.date_created || '').getTime();
    return dateB - dateA;
  });
  return sorted[0] || null;
});

// Autres podcasts (excluant le podcast mis en avant)
const otherPodcasts = computed(() => {
  if (!featuredPodcast.value) return podcastsArticles.value;
  return podcastsArticles.value.filter(podcast => podcast.id !== featuredPodcast.value?.id);
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
  if (!article.author) return 'Animateur inconnu';
  
  if (typeof article.author === 'object') {
    const firstName = article.author.first_name || '';
    const lastName = article.author.last_name || '';
    return `${firstName} ${lastName}`.trim() || 'Animateur inconnu';
  }
  
  return 'Animateur inconnu';
};

const getTotalDuration = (): number => {
  return podcastsArticles.value.reduce((total, podcast) => {
    return total + (podcast.reading_time || 30); // 30 minutes par défaut pour un podcast
  }, 0);
};

const navigateToArticle = (article: any) => {
  if (!article) {
    console.error('Aucun article fourni pour la navigation');
    return;
  }

  console.log('Navigation vers le podcast:', article.id, article.title, article.slug);

  try {
    if (article.slug && article.slug.trim() !== '') {
      router.push(`/carnet-rh/articles/${article.slug}`);
    } else if (article.id) {
      router.push(`/carnet-rh/articles/${article.id}`);
    } else {
      console.error('Podcast sans slug ni ID:', article);
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
  background: linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%);
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

/* Styles pour les podcasts */
.podcast-featured-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;
}

.podcast-featured-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.podcast-cover-large {
  height: 400px;
  position: relative;
  overflow: hidden;
}

.podcast-featured-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.podcast-play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(156, 39, 176, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.podcast-featured-card:hover .podcast-play-overlay {
  opacity: 1;
}

.podcast-play-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.podcast-play-btn {
  backdrop-filter: blur(4px);
  margin-bottom: 8px;
}

.podcast-logo {
  color: white;
  font-weight: bold;
  font-size: 18px;
  font-family: 'Helvetica Neue', sans-serif;
  letter-spacing: 2px;
}

.podcast-badge {
  align-self: flex-start;
}

.podcast-meta {
  border-top: 1px solid #e0e0e0;
  padding-top: 16px;
}

/* Cartes de podcasts */
.podcast-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;
}

.podcast-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.podcast-card:hover .podcast-card-overlay {
  opacity: 1;
}

.podcast-cover-container {
  position: relative;
  overflow: hidden;
}

.podcast-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.podcast-card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(156, 39, 176, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.podcast-preview-btn {
  backdrop-filter: blur(4px);
}

.podcast-logo-small {
  color: #9c27b0;
  font-weight: bold;
  font-size: 12px;
  letter-spacing: 1px;
}

.podcast-title {
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.podcast-excerpt {
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
  
  .podcast-featured-card .v-row {
    flex-direction: column;
  }
  
  .podcast-cover-large {
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
  .podcast-cover-large {
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
