<template>
  <v-card 
    class="article-card h-100" 
    flat 
    hover
    :class="{ 'featured-card': featured }"
    @click="navigateToArticle"
  >
    <div class="position-relative">
      <!-- Image de l'article -->
      <v-img 
        :src="imageUrl" 
        :alt="article.title"
        height="200" 
        cover 
        class="rounded-t-lg"
      >
        <template v-slot:placeholder>
          <div class="d-flex align-center justify-center h-100">
            <v-progress-circular indeterminate color="grey-lighten-4"></v-progress-circular>
          </div>
        </template>
      </v-img>

      <!-- Badge catégorie -->
      <v-chip
        v-if="categoryInfo"
        :color="categoryInfo.color || 'primary'"
        size="small"
        class="category-badge"
        text-color="white"
      >
        {{ categoryInfo.name }}
      </v-chip>

      <!-- Badge article mis en avant -->
      <v-chip
        v-if="article.is_featured"
        color="accent"
        size="small"
        class="featured-badge"
        prepend-icon="mdi-star"
      >
        À la une
      </v-chip>
    </div>

    <v-card-text class="pa-4 d-flex flex-column flex-grow-1">
      <!-- Métadonnées -->
      <div class="d-flex align-center mb-2 text-caption text-grey-darken-1">
        <span>{{ formatDate(article.published_date || article.date_created) }}</span>
        <v-icon size="12" class="mx-2">mdi-circle</v-icon>
        <span>{{ article.reading_time || 5 }} min de lecture</span>
        <v-icon size="12" class="mx-2" v-if="article.views">mdi-circle</v-icon>
        <span v-if="article.views">{{ formatViews(article.views) }} vues</span>
      </div>

      <!-- Titre -->
      <h3 class="text-h6 font-weight-bold mb-3 article-title">
        {{ article.title }}
      </h3>

      <!-- Extrait -->
      <p class="text-body-2 text-grey-darken-1 mb-4 flex-grow-1" v-if="article.excerpt">
        {{ truncateText(article.excerpt, 120) }}
      </p>

      <!-- Auteur -->
      <div class="d-flex align-center mt-auto">
        <v-avatar size="32" color="grey-lighten-2" class="mr-3">
          <v-img 
            v-if="authorInfo?.avatar" 
            :src="getAssetUrl(authorInfo.avatar)" 
            :alt="authorName"
          ></v-img>
          <span v-else class="text-caption">{{ getInitials(authorName) }}</span>
        </v-avatar>
        <div>
          <div class="text-body-2 font-weight-medium">{{ authorName }}</div>
          <div class="text-caption text-grey-darken-1" v-if="authorInfo?.bio">
            {{ truncateText(authorInfo.bio, 50) }}
          </div>
        </div>
      </div>

      <!-- Tags -->
      <div class="mt-3" v-if="articleTags.length > 0">
        <v-chip
          v-for="tag in articleTags.slice(0, 3)"
          :key="tag.id"
          size="x-small"
          variant="outlined"
          :color="tag.color || 'grey'"
          class="mr-1"
        >
          {{ tag.name }}
        </v-chip>
        <span v-if="articleTags.length > 3" class="text-caption text-grey-darken-1">
          +{{ articleTags.length - 3 }}
        </span>
      </div>
    </v-card-text>

    <!-- Action overlay on hover -->
    <v-overlay
      v-model="showOverlay"
      contained
      class="align-center justify-center"
      opacity="0.8"
    >
      <v-btn
        color="primary"
        variant="elevated"
        prepend-icon="mdi-eye"
        @click.stop="navigateToArticle"
      >
        Lire l'article
      </v-btn>
    </v-overlay>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import type { Article, Category, Author, Tag } from '@/plugins/directus';

interface Props {
  article: Article;
  featured?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  featured: false
});

const router = useRouter();
const showOverlay = ref(false);

// URL de base pour les assets Directus
const directusUrl = import.meta.env.VITE_DIRECTUS_URL || 'http://localhost:8055';
const accessToken = import.meta.env.VITE_DIRECTUS_TOKEN;

// Computed properties
const imageUrl = computed(() => {
  // Utiliser exclusivement featured_image (fourni par Directus)
  // Ajouter un timestamp pour forcer le rafraîchissement des images
  const cacheBreaker = new Date().getTime();
  if (props.article.featured_image) {
    // Vérifier si featured_image est un objet avec un champ id
    let imageId: string | undefined;
    if (typeof props.article.featured_image === 'object' && props.article.featured_image !== null) {
      // Utiliser une assertion de type pour accéder à la propriété id
      const fileObject = props.article.featured_image as { id: string };
      imageId = fileObject.id;
    } else if (typeof props.article.featured_image === 'string') {
      imageId = props.article.featured_image;
    }
    
    if (imageId) {
      // Ne pas ajouter le token d'accès car les tests montrent qu'il provoque des erreurs 401
      const url = `${directusUrl}/assets/${imageId}?width=400&height=200&fit=cover&quality=80&v=${cacheBreaker}`;
      return url;
    }
  }
  // Retourner une chaîne vide au lieu de l'image par défaut
  return '';
});

const categoryInfo = computed(() => {
  if (typeof props.article.category === 'object') {
    return props.article.category as Category;
  }
  return null;
});

const authorInfo = computed(() => {
  if (typeof props.article.author === 'object') {
    return props.article.author as Author;
  }
  return null;
});

const authorName = computed(() => {
  if (authorInfo.value) {
    return `${authorInfo.value.first_name} ${authorInfo.value.last_name}`;
  }
  return 'Auteur inconnu';
});

const articleTags = computed(() => {
  // Si l'article possède des tags, les utiliser
  if (props.article.tags && Array.isArray(props.article.tags)) {
    // Transformer les tags pour avoir un format uniforme
    return props.article.tags.map(tag => {
      // Si c'est déjà un Tag, retourner tel quel
      if ('name' in tag) {
        return tag as Tag;
      }
      // Si c'est un objet avec tags_id, extraire le Tag
      if ('tags_id' in tag && tag.tags_id) {
        return tag.tags_id as Tag;
      }
      // En dernier recours, essayer de le traiter comme un Tag
      return tag as unknown as Tag;
    });
  }
  // Sinon retourner un tableau vide
  return [] as Tag[];
});

// Fonctions utilitaires
const getAssetUrl = (assetId: string) => {
  // Ajouter un timestamp pour forcer le rafraîchissement des images
  const cacheBreaker = new Date().getTime();
  return `${directusUrl}/assets/${assetId}?width=64&height=64&fit=cover&quality=80&v=${cacheBreaker}`;
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
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

const navigateToArticle = () => {
  if (props.article.slug) {
    router.push(`/carnet-rh/articles/${props.article.slug}`);
  } else if (props.article.id) {
    router.push(`/carnet-rh/articles/${props.article.id}`);
  }
};
</script>

<style scoped>
.article-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.article-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.featured-card {
  border: 2px solid rgb(var(--v-theme-accent));
}

.category-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 2;
}

.featured-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
}

.article-title {
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.v-card-text {
  min-height: 200px;
}

@media (max-width: 768px) {
  .article-card:hover {
    transform: none;
  }
  
  .v-card-text {
    min-height: auto;
  }
}
</style>
