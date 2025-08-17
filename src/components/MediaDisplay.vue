<template>
  <div class="media-display" v-if="mediaFile">
    <!-- Image -->
    <v-img
      v-if="mediaType === 'image'"
      :src="mediaUrl"
      :alt="displayName"
      :class="imageClass"
      :height="height"
      :width="width"
      cover
    >
      <template v-slot:placeholder>
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-progress-circular indeterminate color="grey-lighten-1"></v-progress-circular>
        </v-row>
      </template>
    </v-img>

    <!-- Vidéo -->
    <div v-else-if="mediaType === 'video'" class="video-container" :style="containerStyle">
      <video
        v-if="canPlay"
        :src="mediaUrl"
        :poster="videoThumbnail"
        controls
        preload="metadata"
        :class="mediaClass"
        :style="{ width: '100%', height: height ? `${height}px` : 'auto' }"
      >
        Votre navigateur ne supporte pas la lecture vidéo.
      </video>
      <div v-else class="media-placeholder" :style="containerStyle">
        <div class="text-center pa-4">
          <v-icon size="64" color="grey-lighten-1">mdi-video</v-icon>
          <p class="text-body-2 mt-2 mb-2">{{ displayName }}</p>
          <v-btn 
            :href="mediaUrl" 
            target="_blank" 
            color="primary" 
            size="small" 
            prepend-icon="mdi-download"
          >
            Télécharger
          </v-btn>
        </div>
      </div>
    </div>

    <!-- Audio -->
    <div v-else-if="mediaType === 'audio'" class="audio-container" :style="containerStyle">
      <div class="audio-player pa-4 rounded" style="background: #f5f5f5;">
        <div class="d-flex align-center mb-2">
          <v-icon color="primary" class="mr-2">mdi-music-note</v-icon>
          <span class="text-subtitle-2 font-weight-medium">{{ displayName }}</span>
        </div>
        <audio
          v-if="canPlay"
          :src="mediaUrl"
          controls
          preload="metadata"
          class="w-100"
          style="height: 40px;"
        >
          Votre navigateur ne supporte pas la lecture audio.
        </audio>
        <div v-else class="text-center">
          <v-btn 
            :href="mediaUrl" 
            target="_blank" 
            color="primary" 
            size="small" 
            prepend-icon="mdi-download"
          >
            Télécharger l'audio
          </v-btn>
        </div>
      </div>
    </div>

    <!-- PDF -->
    <div v-else-if="mediaType === 'pdf'" class="pdf-container" :style="containerStyle">
      <div class="document-card">
        <div class="document-preview">
          <!-- Image de couverture du PDF ou icône par défaut -->
          <div class="d-flex align-center justify-center fill-height" style="background-color: #2864C7;">
            <v-icon size="64" color="white" class="document-icon">mdi-file-pdf-box</v-icon>
          </div>
        </div>
        <div class="document-info">
          <div class="document-type-chip">PDF</div>
          <h3 class="document-title">{{ displayName }}</h3>
          <div class="document-meta">
            <span>{{ formatFileSize(fileSize) }}</span>
            <span class="document-separator">•</span>
            <span>{{ formatDate(fileDate) }}</span>
          </div>
          <div class="document-actions">
            <v-btn 
              :href="mediaUrl" 
              target="_blank" 
              color="primary" 
              class="document-action-btn mr-2"
              variant="outlined"
              prepend-icon="mdi-eye"
            >
              Consulter
            </v-btn>
            <v-btn 
              :href="mediaUrl + '?download'" 
              target="_blank" 
              color="primary" 
              class="document-action-btn"
              prepend-icon="mdi-download"
            >
              Télécharger
            </v-btn>
          </div>
        </div>
      </div>
      <!-- Aperçu PDF intégré (optionnel) -->
      <div v-if="showPdfPreview && height" class="pdf-embed mt-4">
        <iframe
          :src="mediaUrl + '#view=FitH'"
          :style="{ width: '100%', height: `${height - 100}px`, border: 'none' }"
          type="application/pdf"
        >
        </iframe>
      </div>
    </div>

    <!-- Fichier inconnu -->
    <div v-else class="document-container" :style="containerStyle">
      <div class="document-card">
        <div class="document-preview">
          <!-- Fond coloré selon le type de fichier -->
          <div class="d-flex align-center justify-center fill-height" :style="{backgroundColor: getFileTypeColor(mediaType)}">
            <v-icon size="64" color="white" class="document-icon">{{ mediaIcon }}</v-icon>
          </div>
        </div>
        <div class="document-info">
          <div class="document-type-chip">{{ getFileTypeLabel(mediaType) }}</div>
          <h3 class="document-title">{{ displayName }}</h3>
          <div class="document-meta">
            <span>{{ formatFileSize(fileSize) }}</span>
            <span class="document-separator">•</span>
            <span>{{ formatDate(fileDate) }}</span>
          </div>
          <div class="document-actions">
            <v-btn 
              :href="mediaUrl" 
              target="_blank" 
              color="primary" 
              class="document-action-btn"
              prepend-icon="mdi-download"
            >
              Télécharger
            </v-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Placeholder si aucun fichier -->
  <div v-else-if="showPlaceholder" class="media-placeholder" :style="containerStyle">
    <div class="text-center pa-4">
      <v-icon size="64" color="grey-lighten-1">mdi-file-image</v-icon>
      <p class="text-caption text-grey-darken-1 mt-2">Aucun média</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { 
  getMediaType, 
  getMediaUrl, 
  getVideoThumbnail, 
  getMediaDisplayName, 
  getMediaIcon, 
  canPlayInBrowser 
} from '@/utils/mediaUtils';

interface Props {
  mediaFile: any;
  width?: number;
  height?: number;
  imageClass?: string;
  mediaClass?: string;
  showPlaceholder?: boolean;
  showPdfPreview?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  width: undefined,
  height: undefined,
  imageClass: '',
  mediaClass: '',
  showPlaceholder: false,
  showPdfPreview: false
});

// Computed properties
const mediaType = computed(() => getMediaType(props.mediaFile));
const displayName = computed(() => getMediaDisplayName(props.mediaFile));
const mediaIcon = computed(() => getMediaIcon(props.mediaFile));
const canPlay = computed(() => canPlayInBrowser(props.mediaFile));
const fileSize = computed(() => props.mediaFile?.filesize || 0);
const fileDate = computed(() => props.mediaFile?.date_created || new Date().toISOString());

const mediaUrl = computed(() => {
  if (mediaType.value === 'image') {
    return getMediaUrl(props.mediaFile, {
      width: props.width,
      height: props.height,
      quality: 80,
      fit: 'cover'
    });
  }
  return getMediaUrl(props.mediaFile);
});

const videoThumbnail = computed(() => {
  if (mediaType.value === 'video') {
    return getVideoThumbnail(props.mediaFile, {
      width: props.width,
      height: props.height
    });
  }
  return '';
});

// PDF thumbnail (optionnel, utilise une miniature par défaut)
const pdfThumbnail = computed(() => {
  // Si une miniature est fournie par le serveur, l'utiliser
  if (props.mediaFile?.thumbnail) {
    return props.mediaFile.thumbnail;
  }
  // Sinon utiliser une miniature par défaut
  return null;
});

const containerStyle = computed(() => {
  const style: any = {};
  if (props.width) style.width = `${props.width}px`;
  if (props.height) style.height = `${props.height}px`;
  return style;
});

// Fonctions utilitaires
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Fonction pour obtenir une miniature par défaut selon le type de fichier
const getDefaultThumbnail = (type: string): string => {
  const basePath = '/assets/images/thumbnails/';
  
  switch (type) {
    case 'pdf':
      return `${basePath}pdf-thumbnail.png`;
    case 'audio':
      return `${basePath}audio-thumbnail.png`;
    case 'video':
      return `${basePath}video-thumbnail.png`;
    default:
      return `${basePath}document-thumbnail.png`;
  }
};

// Fonction pour obtenir un libellé de type de fichier
const getFileTypeLabel = (type: string): string => {
  switch (type) {
    case 'pdf':
      return 'PDF';
    case 'audio':
      return 'Audio';
    case 'video':
      return 'Vidéo';
    case 'image':
      return 'Image';
    default:
      return 'Document';
  }
};

// Fonction pour obtenir une couleur par type de fichier
const getFileTypeColor = (type: string): string => {
  switch (type) {
    case 'pdf':
      return '#2864C7'; // Bleu
    case 'audio':
      return '#9C27B0'; // Violet
    case 'video':
      return '#E53935'; // Rouge
    case 'image':
      return '#43A047'; // Vert
    default:
      return '#607D8B'; // Gris bleuté
  }
};
</script>

<style scoped>
.media-display {
  position: relative;
  overflow: hidden;
}

.video-container,
.audio-container,
.pdf-container,
.document-container {
  position: relative;
}

.media-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  min-height: 100px;
}

.audio-player {
  border: 1px solid #e0e0e0;
}

.pdf-embed {
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Style du document (PDF, etc.) basé sur votre référence */
.document-card {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  background-color: white;
}

@media (min-width: 600px) {
  .document-card {
    flex-direction: row;
    height: 170px;
  }
}

.document-preview {
  position: relative;
  flex: 0 0 auto;
  width: 100%;
  height: 170px;
  background-color: #f0f0f0;
}

@media (min-width: 600px) {
  .document-preview {
    width: 170px;
  }
}

.document-thumbnail {
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.document-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.8;
}

.document-info {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.document-type-chip {
  display: inline-block;
  background-color: #f0f0f0;
  color: #333;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 8px;
  text-transform: uppercase;
  width: fit-content;
}

.document-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.document-meta {
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
}

.document-separator {
  margin: 0 8px;
}

.document-actions {
  margin-top: auto;
}

.document-action-btn {
  font-weight: 500;
  text-transform: none;
}

/* Responsive video */
.video-container video {
  max-width: 100%;
  height: auto;
}

/* Responsive audio */
.audio-container audio {
  width: 100%;
}
</style>
