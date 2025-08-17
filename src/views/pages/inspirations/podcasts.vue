<template>
  <v-app>
    <NavBars v-model:drawer="drawer" />
    
    <v-navigation-drawer v-model="drawer" temporary app location="right" width="300">
      <!-- Mobile menu content -->
    </v-navigation-drawer>

    <v-main>
      <HeroSection>
        <section class="pt-10 position-relative">
          <v-container class="nav-container">
            <v-row align="center" justify="center">
              <v-col cols="12" class="text-center">
                <h1 class="text-h2 font-weight-bold mb-2">
                  <span class="text-accent-hero">Podcasts</span>
                  <span class="text-primary-hero">RH</span>
                </h1>
                <p class="text-subtitle-1 font-weight-regular text-grey-darken-1 mb-8 mx-auto"
                  style="max-width: 700px; font-size: 18px;">
                  Écoutez les meilleurs podcasts sur les ressources humaines et le management
                </p>
              </v-col>
            </v-row>
          </v-container>
        </section>
      </HeroSection>

      <!-- Contenu spécifique aux podcasts -->
      <section class="py-16">
        <v-container>
          <v-row v-if="loading" class="justify-center">
            <v-col cols="12" class="text-center">
              <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
              <p class="mt-4">Chargement des podcasts...</p>
            </v-col>
          </v-row>

          <v-row v-else-if="error" class="justify-center">
            <v-col cols="12" class="text-center">
              <v-alert type="error" class="mb-4">{{ error }}</v-alert>
            </v-col>
          </v-row>

          <v-row v-else>
            <v-col 
              v-for="podcast in podcasts" 
              :key="podcast.id" 
              cols="12" 
              sm="6" 
              md="4"
            >
              <v-card 
                class="podcast-card h-100" 
                elevation="2" 
                hover
                @click="goToDetail(podcast)"
                style="cursor: pointer;"
              >
                <div class="d-flex flex-column h-100">
                  <!-- Image de couverture -->
                  <div class="cover-container">
                    <MediaDisplay
                      v-if="podcast.cover"
                      :media-file="podcast.cover"
                      :height="200"
                      image-class="rounded-t-lg podcast-cover"
                      show-placeholder
                    />
                    <div v-else class="cover-placeholder">
                      <v-icon size="64" color="purple-darken-2">mdi-microphone</v-icon>
                      <v-icon size="32" color="purple-darken-2" class="wave-animation">mdi-waveform</v-icon>
                    </div>
                  </div>

                  <v-card-text class="flex-grow-1 d-flex flex-column">
                    <div class="flex-grow-1">
                      <h3 class="text-h6 font-weight-bold mb-2">{{ podcast.title }}</h3>
                      <p v-if="podcast.excerpt" class="text-body-2 text-grey-darken-1 line-clamp-3">
                        {{ podcast.excerpt }}
                      </p>
                    </div>

                    <div class="mt-auto pt-3">
                      <div class="d-flex justify-space-between align-center">
                        <div class="d-flex align-center">
                          <v-avatar size="24" class="me-2">
                            <v-img 
                              v-if="typeof podcast.author === 'object' && podcast.author?.avatar"
                              :src="getAuthorAvatar(podcast.author.avatar)"
                              :alt="getAuthorName(podcast.author)"
                            />
                            <v-icon v-else size="16">mdi-account</v-icon>
                          </v-avatar>
                          <span class="text-caption">{{ getAuthorName(podcast.author) }}</span>
                        </div>
                        <v-chip size="x-small" color="purple-darken-2" variant="tonal">
                          <v-icon start size="12">mdi-headphones</v-icon>
                          Podcast
                        </v-chip>
                      </div>

                      <div class="mt-2 d-flex justify-space-between align-center">
                        <span class="text-caption text-grey-darken-1">
                          {{ formatDate(podcast.published_date ?? podcast.date_created ?? '') }}
                        </span>
                        <span v-if="podcast.reading_time" class="text-caption text-grey-darken-1">
                          {{ podcast.reading_time }} min d'écoute
                        </span>
                      </div>
                    </div>
                  </v-card-text>
                </div>
              </v-card>
            </v-col>
          </v-row>

          <!-- Message si pas de podcasts -->
          <v-row v-if="!loading && !error && podcasts.length === 0" class="justify-center">
            <v-col cols="12" md="6" class="text-center">
              <v-icon size="64" color="purple-lighten-2" class="mb-4">mdi-microphone</v-icon>
              <h3 class="text-h5 mb-2">Aucun podcast disponible</h3>
              <p class="text-grey-darken-1">Les recommandations de podcasts seront bientôt disponibles.</p>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <FooterSection />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import NavBars from '@/components/NavBars.vue';
import HeroSection from '@/components/HeroSection.vue';
import FooterSection from '@/components/FooterSection.vue';
import MediaDisplay from '@/components/MediaDisplay.vue';
import { useArticles } from '@/composables/useArticles';

const router = useRouter();
const drawer = ref(false);

// Utilisation du composable articles
const { articles, loading, error, fetchArticles } = useArticles();

// Filtrer les articles de la catégorie "Podcasts"
const podcasts = computed(() => {
  return articles.value.filter(article => {
    if (typeof article.category === 'object') {
      return article.category?.slug === 'podcasts';
    } else if (typeof article.category === 'string') {
      // Si c'est un ID, on peut le vérifier aussi
      return article.category === '0b9edfa2-c2a8-4af1-bdf8-f027784f4e10';
    }
    return false;
  });
});

// Fonctions utilitaires
const getAuthorName = (author: any) => {
  if (!author) return 'Animateur inconnu';
  if (typeof author === 'object') {
    return `${author.first_name || ''} ${author.last_name || ''}`.trim();
  }
  return 'Animateur inconnu';
};

const getAuthorAvatar = (avatar: any) => {
  if (!avatar) return '';
  if (typeof avatar === 'string') {
    return `${import.meta.env.VITE_DIRECTUS_URL}/assets/${avatar}?width=48&height=48&fit=cover`;
  }
  if (typeof avatar === 'object' && avatar.id) {
    return `${import.meta.env.VITE_DIRECTUS_URL}/assets/${avatar.id}?width=48&height=48&fit=cover`;
  }
  return '';
};

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const goToDetail = (podcast: any) => {
  router.push(`/carnet-rh/articles/${podcast.slug}`);
};

// Charger les articles au montage
onMounted(() => {
  fetchArticles();
});
</script>

<style scoped>
.podcast-card {
  transition: transform 0.2s ease-in-out;
}

.podcast-card:hover {
  transform: translateY(-4px);
}

.cover-container {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.podcast-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-placeholder {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.wave-animation {
  margin-top: 8px;
  animation: wave 2s infinite ease-in-out;
}

@keyframes wave {
  0%, 100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(1.3);
  }
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
