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
                  <span class="text-accent-hero">TED Talks</span>
                  <span class="text-primary-hero">RH</span>
                </h1>
                <p class="text-subtitle-1 font-weight-regular text-grey-darken-1 mb-8 mx-auto"
                  style="max-width: 700px; font-size: 18px;">
                  Les meilleures conférences TED sur les ressources humaines et le leadership
                </p>
              </v-col>
            </v-row>
          </v-container>
        </section>
      </HeroSection>

      <!-- Contenu spécifique aux TED Talks -->
      <section class="py-16">
        <v-container>
          <v-row v-if="loading" class="justify-center">
            <v-col cols="12" class="text-center">
              <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
              <p class="mt-4">Chargement des TED Talks...</p>
            </v-col>
          </v-row>

          <v-row v-else-if="error" class="justify-center">
            <v-col cols="12" class="text-center">
              <v-alert type="error" class="mb-4">{{ error }}</v-alert>
            </v-col>
          </v-row>

          <v-row v-else>
            <v-col 
              v-for="tedTalk in tedTalks" 
              :key="tedTalk.id" 
              cols="12" 
              sm="6" 
              md="4"
            >
              <v-card 
                class="ted-card h-100" 
                elevation="2" 
                hover
                @click="goToDetail(tedTalk)"
                style="cursor: pointer;"
              >
                <div class="d-flex flex-column h-100">
                  <!-- Image de couverture / Thumbnail -->
                  <div class="cover-container">
                    <MediaDisplay
                      v-if="tedTalk.cover"
                      :media-file="tedTalk.cover"
                      :height="200"
                      image-class="rounded-t-lg ted-cover"
                      show-placeholder
                    />
                    <div v-else class="cover-placeholder">
                      <v-icon size="64" color="red-darken-2">mdi-play-circle</v-icon>
                      <div class="ted-logo">TED</div>
                    </div>
                  </div>

                  <v-card-text class="flex-grow-1 d-flex flex-column">
                    <div class="flex-grow-1">
                      <h3 class="text-h6 font-weight-bold mb-2">{{ tedTalk.title }}</h3>
                      <p v-if="tedTalk.excerpt" class="text-body-2 text-grey-darken-1 line-clamp-3">
                        {{ tedTalk.excerpt }}
                      </p>
                    </div>

                    <div class="mt-auto pt-3">
                      <div class="d-flex justify-space-between align-center">
                        <div class="d-flex align-center">
                          <v-avatar size="24" class="me-2">
                            <v-img 
                              v-if="typeof tedTalk.author === 'object' && tedTalk.author?.avatar"
                              :src="getAuthorAvatar(tedTalk.author.avatar)"
                              :alt="getAuthorName(tedTalk.author)"
                            />
                            <v-icon v-else size="16">mdi-account</v-icon>
                          </v-avatar>
                          <span class="text-caption">{{ getAuthorName(tedTalk.author) }}</span>
                        </div>
                        <v-chip size="x-small" color="red-darken-2" variant="tonal">
                          <v-icon start size="12">mdi-play</v-icon>
                          TED
                        </v-chip>
                      </div>

                      <div class="mt-2 d-flex justify-space-between align-center">
                        <span class="text-caption text-grey-darken-1">
                          {{ formatDate(tedTalk.published_date ?? tedTalk.date_created ?? '') }}
                        </span>
                        <span v-if="tedTalk.reading_time" class="text-caption text-grey-darken-1">
                          {{ tedTalk.reading_time }} min
                        </span>
                      </div>
                    </div>
                  </v-card-text>
                </div>
              </v-card>
            </v-col>
          </v-row>

          <!-- Message si pas de TED Talks -->
          <v-row v-if="!loading && !error && tedTalks.length === 0" class="justify-center">
            <v-col cols="12" md="6" class="text-center">
              <v-icon size="64" color="red-lighten-2" class="mb-4">mdi-play-circle</v-icon>
              <h3 class="text-h5 mb-2">Aucun TED Talk disponible</h3>
              <p class="text-grey-darken-1">Les recommandations de TED Talks seront bientôt disponibles.</p>
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

// Filtrer les articles de la catégorie "TED Talks"
const tedTalks = computed(() => {
  return articles.value.filter(article => {
    if (typeof article.category === 'object') {
      return article.category?.slug === 'ted-talks';
    } else if (typeof article.category === 'string') {
      // Si c'est un ID, on peut le vérifier aussi
      return article.category === 'c21e89a5-6314-43a3-b264-9af3a6d4cc41';
    }
    return false;
  });
});

// Fonctions utilitaires
const getAuthorName = (author: any) => {
  if (!author) return 'Orateur inconnu';
  if (typeof author === 'object') {
    return `${author.first_name || ''} ${author.last_name || ''}`.trim();
  }
  return 'Orateur inconnu';
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

const goToDetail = (tedTalk: any) => {
  router.push(`/carnet-rh/articles/${tedTalk.slug}`);
};

// Charger les articles au montage
onMounted(() => {
  fetchArticles();
});
</script>

<style scoped>
.ted-card {
  transition: transform 0.2s ease-in-out;
}

.ted-card:hover {
  transform: translateY(-4px);
}

.cover-container {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.ted-cover {
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
  background-color: #f5f5f5;
  background: linear-gradient(45deg, #e53e3e, #ff6b6b);
}

.ted-logo {
  color: white;
  font-weight: bold;
  font-size: 24px;
  font-family: 'Helvetica Neue', sans-serif;
  letter-spacing: 2px;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
