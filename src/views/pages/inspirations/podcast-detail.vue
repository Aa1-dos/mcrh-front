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
        <h2 class="text-h4 mt-4 mb-2">Podcast non trouvé</h2>
        <p class="text-grey-darken-1 mb-4">{{ error }}</p>
        <div class="d-flex justify-center gap-4 mt-6">
          <v-btn color="primary" to="/inspirations/livres">Retour aux contenus</v-btn>
          <v-btn color="secondary" @click="loadPodcast" variant="outlined">Réessayer</v-btn>
        </div>
      </div>

      <!-- Podcast content -->
      <div v-else-if="podcast">
        <!-- Barre de navigation et retour -->
        <section class="">
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
                <v-btn icon color="primary" class="mr-3 mb-2 mb-sm-0" to="/inspirations/livres" style="
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

        <!-- Contenu du podcast -->
        <section class="">
          <v-container class="nav-container">
            <v-row>
              <v-col cols="12" md="9">
                <div v-if="podcast" class="featured-content-container">
                  <!-- En-tête du podcast -->
                  <div class="d-flex flex-column">
                    <div class="">
                      <div class="align-center mb-2">
                        <div class="d-flex flex-column mb-2">
                        <!--   <p class="text-body-6 mb-4">
                            {{ podcast.excerpt }}
                          </p> -->
                          
                          <!-- Section spéciale pour les podcasts -->
                          <div class="podcast-section mb-6">
                            <v-row>
                              <!-- Informations du podcast et player (utilise toute la largeur) -->
                              <v-col cols="12">
                                <div class="podcast-info-section">
                                  <div class="">
                                    <v-icon color="purple-darken-2" size="24" class="mb-2">mdi-headphones</v-icon>
                                    <p class=" mb-2"><!-- h2-article-title -->
                                      {{ podcast.title }}
                                    </p>
                                    
                                    <div class="d-flex flex-column gap-2 mb-4">
                                      <div class="d-flex align-center">
                                        <v-icon size="16" class="me-2">mdi-microphone</v-icon>
                                        <span class="text-body-2"><strong>Animateur:</strong> {{ getAuthorDisplayName(podcast) }}</span>
                                      </div>
                                      <div v-if="podcast.reading_time" class="d-flex align-center">
                                        <v-icon size="16" class="me-2">mdi-clock-outline</v-icon>
                                        <span class="text-body-2"><strong>Durée:</strong> ~{{ podcast.reading_time }} minutes</span>
                                      </div>
                                      <div class="d-flex align-center">
                                        <v-icon size="16" class="me-2">mdi-podcast</v-icon>
                                        <span class="text-body-2"><strong>Format:</strong> Podcast Audio</span>
                                      </div>
                                      <div class="d-flex align-center">
                                        <v-icon size="16" class="me-2">mdi-calendar</v-icon>
                                        <span class="text-body-2"><strong>Publié le:</strong> {{ formatDate(podcast.published_date || podcast.date_created) }}</span>
                                      </div>
                                    </div>
                                    
                                    <!-- Player audio intégré -->
                                    <v-card 
                                      elevation="2" 
                                      class="podcast-player-card pa-4 mb-4" 
                                      style="background: linear-gradient(135deg, #7B1FA2 0%, #AB47BC 100%);"
                                    >
                                      <div class="d-flex align-center mb-3">
                                        <v-icon color="white" size="32" class="mr-3">mdi-play-circle</v-icon>
                                        <div class="flex-grow-1">
                                          <h4 class="text-white mb-1">Écouter le podcast</h4>
                                          <p class="text-white text-caption mb-0 opacity-90">
                                            Durée: {{ podcast.reading_time || 'N/A' }} minutes
                                          </p>
                                        </div>
                                      </div>
                                      
                                      <!-- Player HTML5 audio -->
                                      <div v-if="getAudioUrl(podcast)" class="audio-player-container">
                                        <audio 
                                          ref="audioPlayer"
                                          :src="getAudioUrl(podcast)"
                                          controls
                                          preload="metadata"
                                          class="custom-audio-player"
                                          @loadedmetadata="onAudioLoaded"
                                          @timeupdate="onTimeUpdate"
                                          @ended="onAudioEnded"
                                        >
                                          Votre navigateur ne supporte pas la lecture audio.
                                        </audio>
                                      </div>
                                      
                                      <!-- Bouton d'écoute externe si pas de fichier audio direct -->
                                      <div v-else class="d-flex justify-center">
                                        <v-btn 
                                          variant="flat" 
                                          color="white" 
                                          class="ml-3"
                                          :loading="loading"
                                          size="large"
                                          @click="openExternalPlayer"
                                        >
                                          <v-icon class="mr-2">mdi-open-in-new</v-icon>
                                          Écouter sur la plateforme
                                        </v-btn>
                                      </div>
                                    </v-card>
                                  </div>
                                </div>
                              </v-col>
                            </v-row>
                          </div>
                          
                          <!-- Contenu du podcast (transcription/description) -->
                          <div class="podcast-content text-body-1" v-if="podcast && podcast.content" v-html="sanitizeContent(podcast.content)"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Actions sociales -->
                <SocialLinks :article="podcast" class="mb-6" />
              </v-col>

              <!-- Sidebar pour autres podcasts -->
              <v-col cols="12" md="3">
                <v-row>
                  <v-col cols="12" v-for="podcastItem in otherPodcasts.slice(0, 3)" :key="podcastItem.id">
                    <v-card class="article-card" flat @click="navigateToPodcast(podcastItem)">
                      <div class="d-flex flex-column rounded-lg">
                        <!-- Affichage de l'image de couverture ou fallback -->
                        <v-img 
                          :src="getPodcastImageUrl(podcastItem)" 
                          cover 
                          class="rounded-t-lg" 
                          height="125"
                        >
                          <!-- Fallback avec icône si pas d'image -->
                          <template v-slot:placeholder>
                            <div class="d-flex align-center justify-center bg-purple-lighten-4 rounded-t-lg fill-height">
                              <v-icon size="48" color="purple-darken-2">mdi-headphones</v-icon>
                            </div>
                          </template>
                        </v-img>
                        <v-card-text class="px-1 pt-2">
                           <v-chip size="small" class="mb-3 category-chip" variant="flat" :color="getCategoryColor(podcastItem.category)">
                              {{ getCategoryName(podcastItem.category) }}
                          </v-chip>
                          <h3 class="text-h6 font-weight-bold mb-1">
                            {{ podcastItem.title }}
                          </h3>
                          <p class="text-caption text-grey-darken-1">
                            Publié le {{ formatDate(podcastItem.published_date || podcastItem.date_created) }}
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
import SocialLinks from '@/components/SocialLinks.vue';
import { useArticles } from '@/composables/useArticles';
import DOMPurify from 'dompurify';

const router = useRouter();
const route = useRoute();
const drawer = ref(false);

// État
const podcast = ref<any>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const audioPlayer = ref<HTMLAudioElement | null>(null);

// Composables
const { articles, fetchArticles } = useArticles();

// Computed properties
const otherPodcasts = computed(() => {
  const podcastCategoryId = '398dc937-9b9d-4c2d-93f0-ec9cdd2995ff'; // ID catégorie podcasts
  
  return articles.value
    .filter(article => {
      // Filtrer les podcasts seulement
      const articleCatId = typeof article.category === 'object' ? article.category?.id : article.category;
      const isPodcastArticle = articleCatId === podcastCategoryId;
      
      // Exclure le podcast courant
      return isPodcastArticle && article.id !== podcast.value?.id;
    })
    .sort((a, b) => {
      const dateA = new Date(a.published_date || a.date_created || '').getTime();
      const dateB = new Date(b.published_date || b.date_created || '').getTime();
      return dateB - dateA;
    });
});

// Fonctions utilitaires

// Fonction pour obtenir le nom de la catégorie à partir de son ID ou objet
const getCategoryName = (category: any): string => {
  if (!category) return 'Sans catégorie';
  if (typeof category === 'object' && category.name) return category.name;
  // Ajoutez ici la correspondance ID -> nom si besoin
  if (typeof category === 'string') {
    // Exemple de correspondance statique, à adapter selon vos catégories
    if (category === '398dc937-9b9d-4c2d-93f0-ec9cdd2995ff') return 'Podcast';
    // Ajoutez d'autres correspondances ici si nécessaire
    return category;
  }
  return 'Sans catégorie';
};

// Fonction pour obtenir la couleur de la catégorie
const getCategoryColor = (category: any): string => {
  // Adapter selon vos catégories et couleurs
  if (!category) return 'grey';
  const catId = typeof category === 'object' ? category.id : category;
  if (catId === '398dc937-9b9d-4c2d-93f0-ec9cdd2995ff') return 'purple-darken-2'; // Podcast
  // Ajoutez d'autres correspondances ici si nécessaire
  return 'grey';
};

// Fonction pour obtenir l'URL du fichier audio
const getAudioUrl = (podcast: any) => {
  if (!podcast) return '';

  const directusUrl = import.meta.env.VITE_DIRECTUS_URL || 'http://localhost:8055';
  
  // Chercher le fichier audio dans featured_image (comme spécifié)
  if (podcast.featured_image) {
    let fileId: string | undefined;
    if (typeof podcast.featured_image === 'object' && podcast.featured_image !== null) {
      fileId = podcast.featured_image.id;
    } else if (typeof podcast.featured_image === 'string') {
      fileId = podcast.featured_image;
    }
    
    if (fileId) {
      return `${directusUrl}/assets/${fileId}`;
    }
  }
  
  return '';
};

// Fonction pour obtenir l'URL de l'image de couverture d'un podcast
const getPodcastImageUrl = (podcast: any) => {
  if (!podcast) {
    console.log('Aucun podcast fourni');
    return '';
  }

  const directusUrl = import.meta.env.VITE_DIRECTUS_URL || 'http://localhost:8055';
  console.log('Podcast dans getPodcastImageUrl:', podcast.id, podcast.title);

  // Fonction helper pour construire l'URL d'une image
  const buildImageUrl = (imageField: any, fieldName: string) => {
    if (!imageField) return null;

    // Vérifier si c'est déjà une URL complète
    if (typeof imageField === 'string' && imageField.startsWith('http')) {
      console.log(`${fieldName} - Image URL complète trouvée:`, imageField);
      return imageField;
    }

    // Construire l'URL Directus avec cache-breaker pour forcer le rafraîchissement
    const cacheBreaker = new Date().getTime();

    // Extraire l'ID de l'image selon le format
    let imageId: string | undefined;
    if (typeof imageField === 'object' && imageField !== null) {
      imageId = imageField.id;
    } else if (typeof imageField === 'string') {
      imageId = imageField;
    }

    if (imageId) {
      const imageUrl = `${directusUrl}/assets/${imageId}?width=400&height=200&fit=cover&quality=80&v=${cacheBreaker}`;
      console.log(`${fieldName} - URL image construite:`, imageUrl);
      return imageUrl;
    }

    return null;
  };

  // Priorité 1: Utiliser le champ cover pour les podcasts
  if (podcast.cover) {
    console.log('Podcast avec champ cover détecté:', podcast.cover);
    const coverUrl = buildImageUrl(podcast.cover, 'cover');
    if (coverUrl) return coverUrl;
  }

  // Priorité 2: Fallback sur featured_image
  if (podcast.featured_image) {
    const featuredUrl = buildImageUrl(podcast.featured_image, 'featured_image');
    if (featuredUrl) return featuredUrl;
  }

  console.log('Aucune image trouvée pour le podcast', podcast.id);
  return '';
};

// Extrait correctement le nom de l'auteur selon son format
const getAuthorDisplayName = (article: any): string => {
  if (!article) return "L'équipe MCRH";
  
  try {
    const author = article.author;
    
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

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'Date non définie';

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Date invalide';
    
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    return 'Date invalide';
  }
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

// Fonctions du player audio
const onAudioLoaded = () => {
  console.log('Audio chargé et prêt à être lu');
};

const onTimeUpdate = () => {
  // Mise à jour du temps de lecture (optionnel)
};

const onAudioEnded = () => {
  console.log('Lecture audio terminée');
};

const openExternalPlayer = () => {
  // Ouvrir sur une plateforme externe si nécessaire
  // Peut pointer vers Spotify, Apple Podcasts, etc.
  console.log('Ouverture du player externe');
};

const navigateToPodcast = (podcastItem: any) => {
  if (!podcastItem) {
    console.error('Aucun podcast fourni pour la navigation');
    return;
  }

  console.log('Navigation vers le podcast:', podcastItem.id, podcastItem.title, podcastItem.slug);
  
  try {
    if (podcastItem.slug && podcastItem.slug.trim() !== '') {
      router.push(`/inspirations/podcasts/${podcastItem.slug}`);
    } else if (podcastItem.id) {
      router.push(`/inspirations/podcasts/${podcastItem.id}`);
    } else {
      console.error('Podcast sans slug ni ID:', podcastItem);
    }
  } catch (error) {
    console.error('Erreur lors de la navigation:', error);
  }
};

const loadPodcast = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const slug = route.params.slug as string;
    console.log('Chargement du podcast avec slug:', slug);
    
    // Charger tous les articles si pas encore fait
    await fetchArticles();
    console.log('Articles chargés, total:', articles.value.length);
    
    // Trouver le podcast spécifique
    const foundPodcast = articles.value.find(article => {
      // Vérifier que c'est un podcast
      const articleCatId = typeof article.category === 'object' ? article.category?.id : article.category;
      const isPodcastArticle = articleCatId === '398dc937-9b9d-4c2d-93f0-ec9cdd2995ff'; // ID catégorie podcasts
      
      // Correspondance par slug ou ID
      return isPodcastArticle && (article.slug === slug || article.id === slug);
    });
    
    if (foundPodcast) {
      podcast.value = foundPodcast;
      console.log('✅ Podcast trouvé:', {
        id: foundPodcast.id,
        title: foundPodcast.title,
        slug: foundPodcast.slug,
        cover: foundPodcast.cover,
        featured_image: foundPodcast.featured_image
      });
      
      // Note: L'affichage des images de couverture est maintenant géré dans livres.vue
      
    } else {
      console.error('❌ Aucun podcast trouvé avec le slug:', slug);
      
      // Debug: lister tous les podcasts disponibles
      const allPodcasts = articles.value.filter(article => {
        const articleCatId = typeof article.category === 'object' ? article.category?.id : article.category;
        return articleCatId === '398dc937-9b9d-4c2d-93f0-ec9cdd2995ff';
      });
      console.log('📋 Podcasts disponibles:', allPodcasts.map(p => ({ id: p.id, title: p.title, slug: p.slug })));
      
      error.value = 'Podcast non trouvé';
    }
    
  } catch (err) {
    console.error('Erreur lors du chargement du podcast:', err);
    error.value = 'Erreur lors du chargement du podcast';
  } finally {
    loading.value = false;
  }
};

// Lifecycle
onMounted(() => {
  loadPodcast();
});

// Watch route changes
watch(() => route.params.slug, (newSlug) => {
  if (newSlug) {
    loadPodcast();
  }
});
</script>

<style scoped>
.breadcrumb-container {
  padding-top: 20px;
  position: relative;
}

.h2-article-title {
  font-size: 48px;
}

.featured-content-container {
  position: relative;
  margin-bottom: 2rem;
}

.podcast-content {
  line-height: 1.8;
}

.podcast-content :deep(h2) {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 2rem 0 1rem 0;
  color: rgb(var(--v-theme-primary));
}

.podcast-content :deep(h3) {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 1.5rem 0 0.75rem 0;
}

.podcast-content :deep(p) {
  margin-bottom: 1.25rem;
}

.podcast-content :deep(ul),
.podcast-content :deep(ol) {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

.podcast-content :deep(li) {
  margin-bottom: 0.5rem;
}

.podcast-content :deep(blockquote) {
  border-left: 4px solid rgb(var(--v-theme-primary));
  padding: 1rem 1.5rem;
  margin: 1.5rem 0;
  background-color: #f8f9fa;
  font-style: italic;
}

.podcast-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 1.5rem 0;
}

/* Styles pour la section podcast */
.podcast-section {
  background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
  border-radius: 12px;
  padding: 24px;
  border-left: 4px solid #7b1fa2;
}

.podcast-info-section {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.podcast-player-card {
  border-radius: 12px !important;
  transition: all 0.3s ease;
}

.podcast-player-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(123, 31, 162, 0.3);
}

/* Styles pour le player audio personnalisé */
.audio-player-container {
  width: 100%;
  margin-top: 16px;
}

.custom-audio-player {
  width: 100%;
  height: 40px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.custom-audio-player::-webkit-media-controls-panel {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.custom-audio-player::-webkit-media-controls-play-button,
.custom-audio-player::-webkit-media-controls-pause-button {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
}

.custom-audio-player::-webkit-media-controls-timeline {
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  margin-left: 10px;
  margin-right: 10px;
}

.article-card {
  cursor: pointer;
  transition: all 0.2s ease;
}

.article-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .h2-article-title {
    font-size: 32px;
  }

  .podcast-content :deep(h2) {
    font-size: 1.25rem;
  }

  .podcast-content :deep(h3) {
    font-size: 1.1rem;
  }
}

@media (max-width: 960px) {
  .podcast-section .v-col {
    margin-bottom: 16px;
  }
  
  .podcast-info-section {
    justify-content: flex-start;
  }
}
</style>
