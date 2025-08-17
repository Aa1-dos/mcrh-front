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
        <h2 class="text-h4 mt-4 mb-2">TED Talk non trouvé</h2>
        <p class="text-grey-darken-1 mb-4">{{ error }}</p>
        <div class="d-flex justify-center gap-4 mt-6">
          <v-btn color="primary" to="/inspirations/livres">Retour aux contenus</v-btn>
          <v-btn color="secondary" @click="loadTedTalk" variant="outlined">Réessayer</v-btn>
        </div>
      </div>

      <!-- TED Talk content -->
      <div v-else-if="tedTalk">
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

        <!-- Contenu du TED Talk -->
        <section class="">
          <v-container class="nav-container">
            <v-row>
              <v-col cols="12" md="9">
                <div v-if="tedTalk" class="featured-content-container">
                  <!-- En-tête du TED Talk -->
                  <div class="d-flex flex-column">
                    <div class="">
                      <div class="align-center mb-2">
                        <div class="d-flex flex-column mb-2">
                          <p class="text-body-6 mb-4">
                            {{ tedTalk.excerpt }}
                          </p>
                          
                          <!-- Section spéciale pour les TED Talks -->
                          <div class="ted-section mb-6">
                            <v-row>
                              <!-- Player vidéo (utilise toute la largeur) -->
                              <v-col cols="12">
                                <div class="video-player-section">
                                  <!-- Player vidéo intégré -->
                                  <v-card 
                                    elevation="0" 
                                    class="video-player-card mb-4" 
                                    style="background: linear-gradient(135deg, #FF1744 0%, #C62828 100%);"
                                  >
                                    <div class="video-container">
                                      <!-- Player pour vidéos uploadées ou YouTube/Vimeo -->
                                      <div v-if="getVideoUrl(tedTalk)" class="video-wrapper">
                                        <!-- Player HTML5 pour les vidéos uploadées -->
                                        <video 
                                          v-if="isUploadedVideo(getVideoUrl(tedTalk))"
                                          :src="getVideoUrl(tedTalk)"
                                          controls
                                          preload="metadata"
                                          class="ted-video-player"
                                          style="width: 100%; height: 100%; object-fit: cover;"
                                        >
                                          Votre navigateur ne supporte pas la lecture vidéo.
                                        </video>
                                        
                                        <!-- iframe pour YouTube/Vimeo -->
                                        <iframe 
                                          v-else
                                          :src="getVideoUrl(tedTalk)"
                                          frameborder="0"
                                          allowfullscreen
                                          class="ted-video-player"
                                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        ></iframe>
                                      </div>
                                      
                                      <!-- Fallback si pas de vidéo -->
                                      <div v-else class="d-flex flex-column align-center justify-center pa-8 text-white">
                                        <v-icon size="64" color="white" class="mb-4">mdi-play-circle</v-icon>
                                        <h3 class="text-white mb-2">Vidéo TED Talk</h3>
                                        <p class="text-white opacity-90">
                                          Cette conférence sera bientôt disponible
                                        </p>
                                      </div>
                                    </div>
                                  </v-card>

                                  <!-- Informations du TED Talk -->
                                  <div class="ted-info-section">
                                    <div class="">
                                      <v-icon color="red-darken-2" size="24" class="mb-2">mdi-play-circle</v-icon>
                                      <h2 class="h2-article-title mb-2">
                                        {{ tedTalk.title }}
                                      </h2>
                                      
                                      <div class="d-flex flex-column gap-2 mb-4">
                                        <div class="d-flex align-center">
                                          <v-icon size="16" class="me-2">mdi-microphone</v-icon>
                                          <span class="text-body-2"><strong>Intervenant:</strong> {{ getAuthorDisplayName(tedTalk) }}</span>
                                        </div>
                                        <div v-if="tedTalk.reading_time" class="d-flex align-center">
                                          <v-icon size="16" class="me-2">mdi-clock-outline</v-icon>
                                          <span class="text-body-2"><strong>Durée:</strong> ~{{ tedTalk.reading_time }} minutes</span>
                                        </div>
                                        <div class="d-flex align-center">
                                          <v-icon size="16" class="me-2">mdi-video</v-icon>
                                          <span class="text-body-2"><strong>Format:</strong> Conférence TED</span>
                                        </div>
                                        <div class="d-flex align-center">
                                          <v-icon size="16" class="me-2">mdi-calendar</v-icon>
                                          <span class="text-body-2"><strong>Publié le:</strong> {{ formatDate(tedTalk.published_date || tedTalk.date_created) }}</span>
                                        </div>
                                        <div class="d-flex align-center">
                                          <v-icon size="16" class="me-2">mdi-eye</v-icon>
                                          <span class="text-body-2"><strong>Vues:</strong> {{ formatViews(tedTalk.views || 0) }}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </v-col>
                            </v-row>
                          </div>
                          
                          <!-- Contenu du TED Talk (transcription/description) -->
                          <div class="ted-content text-body-1" v-if="tedTalk && tedTalk.content" v-html="sanitizeContent(tedTalk.content)"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Actions sociales -->
                <SocialLinks :article="tedTalk" class="mb-6" />
              </v-col>

              <!-- Sidebar pour autres TED Talks -->
              <v-col cols="12" md="3">
                <v-row>
                  <v-col cols="12">
                    <h3 class="text-h6 font-weight-bold mb-4">Regardez le suivant</h3>
                  </v-col>
                  <v-col cols="12" v-for="tedItem in otherTedTalks.slice(0, 3)" :key="tedItem.id">
                    <v-card class="article-card" flat @click="navigateToTedTalk(tedItem)">
                      <div class="d-flex flex-column rounded-lg">
                        <!-- Affichage de la thumbnail/cover -->
                        <div class="thumbnail-container" style="height: 125px; overflow: hidden; border-radius: 8px 8px 0 0;">
                          <!-- Thumbnail YouTube si c'est une URL YouTube -->
                          <img 
                            v-if="getYoutubeThumbnail(tedItem)"
                            :src="getYoutubeThumbnail(tedItem) as string | undefined"
                            :alt="tedItem.title"
                            class="thumbnail-image"
                            style="width: 100%; height: 100%; object-fit: cover;"
                            @error="onThumbnailError"
                          />
                          <!-- Cover Directus si c'est un fichier uploadé -->
                          <img 
                            v-else-if="getDirectusCover(tedItem)"
                            :src="getDirectusCover(tedItem)"
                            :alt="tedItem.title"
                            class="thumbnail-image"
                            style="width: 100%; height: 100%; object-fit: cover;"
                            @error="onThumbnailError"
                          />
                          <!-- Fallback avec icône -->
                          <div v-else class="d-flex align-center justify-center bg-red-lighten-4 w-100 h-100">
                            <v-icon size="48" color="red-darken-2">mdi-play-circle</v-icon>
                          </div>
                        </div>
                        <v-card-text class="px-1 pt-2">
                          <div class="d-flex align-center">
                            <span class="text-caption text-grey-darken-1 mr-2">Inspirations RH</span>
                            <v-icon size="small" class="text-grey-darken-1 mr-2">mdi-circle-small</v-icon>
                            <span class="text-caption text-grey-darken-1">TED Talk</span>
                          </div>
                          <h3 class="text-h6 font-weight-bold mb-1">
                            {{ tedItem.title }}
                          </h3>
                          <p class="text-caption text-grey-darken-1">
                            Publié le {{ formatDate(tedItem.published_date || tedItem.date_created) }}
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
const tedTalk = ref<any>(null);
const loading = ref(true);
const error = ref<string | null>(null);

// Composables
const { articles, fetchArticles } = useArticles();

// Computed properties
const otherTedTalks = computed(() => {
  const tedTalkCategoryId = 'a1ffbb1b-8b84-49a4-bd58-8a6b5220cee0'; // ID catégorie TED Talks
  
  return articles.value
    .filter(article => {
      // Filtrer les TED Talks seulement
      const articleCatId = typeof article.category === 'object' ? article.category?.id : article.category;
      const isTedTalkArticle = articleCatId === tedTalkCategoryId;
      
      // Exclure le TED Talk courant
      return isTedTalkArticle && article.id !== tedTalk.value?.id;
    })
    .sort((a, b) => {
      const dateA = new Date(a.published_date || a.date_created || '').getTime();
      const dateB = new Date(b.published_date || b.date_created || '').getTime();
      return dateB - dateA;
    });
});

// Fonctions utilitaires
// Fonction pour obtenir l'URL de la vidéo
const getVideoUrl = (tedTalk: any) => {
  if (!tedTalk) return '';

  console.log('=== DEBUG VIDEO URL ===');
  console.log('TED Talk complet:', tedTalk);
  console.log('featured_image:', tedTalk.featured_image);
  console.log('Type featured_image:', typeof tedTalk.featured_image);
  console.log('cover:', tedTalk.cover);
  console.log('Type cover:', typeof tedTalk.cover);

  // Fonction pour vérifier si un fichier est une vidéo
  const isVideoFile = (filename: string) => {
    if (!filename) return false;
    const videoExtensions = ['.mp4', '.avi', '.mov', '.webm', '.mkv', '.flv', '.wmv', '.m4v'];
    const lowerFilename = filename.toLowerCase();
    return videoExtensions.some(ext => lowerFilename.endsWith(ext));
  };

  // Fonction pour extraire les informations d'un objet Directus file
  const extractVideoFromDirectusFile = (fileObj: any) => {
    if (!fileObj || typeof fileObj !== 'object') return null;
    
    console.log('Analyse objet Directus:', fileObj);
    
    // Vérifier les propriétés communes des objets Directus
    const filename = fileObj.filename_download || fileObj.filename_disk || fileObj.title || fileObj.id;
    const type = fileObj.type;
    const fileId = fileObj.id;
    
    console.log('File ID:', fileId);
    console.log('Filename:', filename);
    console.log('Type:', type);
    
    // Vérifier si c'est un fichier vidéo par son type MIME
    if (type && type.startsWith('video/')) {
      console.log('✅ Fichier vidéo détecté via type MIME:', type);
      // Utiliser l'ID du fichier pour construire l'URL Directus
      return fileId;
    }
    
    // Vérifier si c'est un fichier vidéo par son extension
    if (filename && isVideoFile(filename)) {
      console.log('✅ Fichier vidéo détecté via extension:', filename);
      return fileId;
    }
    
    console.log('❌ Ce n\'est pas un fichier vidéo');
    return null;
  };

  // Chercher dans le champ featured_image
  if (tedTalk.featured_image) {
    console.log('=== Analyse featured_image ===');
    
    if (typeof tedTalk.featured_image === 'object' && tedTalk.featured_image !== null) {
      console.log('featured_image est un objet:', tedTalk.featured_image);
      
      const videoFileId = extractVideoFromDirectusFile(tedTalk.featured_image);
      if (videoFileId) {
        const directusUrl = import.meta.env.VITE_DIRECTUS_URL || 'http://localhost:8055';
        const videoUrl = `${directusUrl}/assets/${videoFileId}`;
        console.log('✅ URL vidéo construite depuis featured_image objet:', videoUrl);
        return videoUrl;
      }
    } else if (typeof tedTalk.featured_image === 'string') {
      console.log('featured_image est une string (ID ou URL):', tedTalk.featured_image);
      
      // Vérifier si c'est une URL YouTube/Vimeo (priorité absolue)
      if (tedTalk.featured_image.includes('youtube.com') || 
          tedTalk.featured_image.includes('youtu.be') || 
          tedTalk.featured_image.includes('vimeo.com') ||
          tedTalk.featured_image.includes('www.youtube.com') ||
          tedTalk.featured_image.includes('m.youtube.com')) {
        
        console.log('🎬 URL externe détectée:', tedTalk.featured_image);
        console.log('📝 URL brute copiée:', tedTalk.featured_image);
        
        // Nettoyer l'URL (supprimer espaces, caractères invisibles)
        const cleanUrl = tedTalk.featured_image.trim();
        console.log('🧹 URL nettoyée:', cleanUrl);
        
        // Fonction pour extraire l'ID YouTube de manière robuste
        interface ExtractYouTubeId {
            (url: string): string | null;
        }

        const extractYouTubeId: ExtractYouTubeId = (url: string): string | null => {
            const patterns: RegExp[] = [
                /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&\n?#]+)/,
                /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^&\n?#]+)/,
                /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([^&\n?#]+)/,
                /(?:https?:\/\/)?youtu\.be\/([^&\n?#]+)/,
                /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([^&\n?#]+)/,
                /(?:https?:\/\/)?(?:m\.)?youtube\.com\/watch\?v=([^&\n?#]+)/
            ];
            
            for (const pattern of patterns) {
                const match: RegExpMatchArray | null = url.match(pattern);
                if (match) {
                    console.log('📹 Video ID extrait avec pattern:', pattern, '=> ID:', match[1]);
                    return match[1];
                }
            }
            return null;
        };
        
        // Fonction pour extraire l'ID Vimeo
        const extractVimeoId = (url: string): string | null => {
          const match = url.match(/(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(?:video\/)?([0-9]+)/);
          if (match) {
            console.log('📹 Vimeo ID extrait:', match[1]);
            return match[1];
          }
          return null;
        };
        
        let embedUrl = cleanUrl;
        
        if (cleanUrl.includes('youtube.com') || cleanUrl.includes('youtu.be')) {
          const videoId = extractYouTubeId(cleanUrl);
          if (videoId) {
            embedUrl = `https://www.youtube.com/embed/${videoId}`;
            console.log('✅ URL YouTube convertie en embed:', embedUrl);
          } else {
            console.log('⚠️ Impossible d\'extraire l\'ID YouTube, utilisation URL brute');
          }
        } else if (cleanUrl.includes('vimeo.com')) {
          const videoId = extractVimeoId(cleanUrl);
          if (videoId) {
            embedUrl = `https://player.vimeo.com/video/${videoId}`;
            console.log('✅ URL Vimeo convertie en embed:', embedUrl);
          } else {
            console.log('⚠️ Impossible d\'extraire l\'ID Vimeo, utilisation URL brute');
          }
        }
        
        return embedUrl;
      }
      
      // Si c'est une chaîne qui ressemble à un ID Directus (UUID), construire l'URL asset
      if (tedTalk.featured_image.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        const directusUrl = import.meta.env.VITE_DIRECTUS_URL || 'http://localhost:8055';
        const videoUrl = `${directusUrl}/assets/${tedTalk.featured_image}`;
        console.log('✅ URL vidéo construite depuis featured_image ID:', videoUrl);
        return videoUrl;
      }
      
      // Vérifier si c'est un nom de fichier vidéo
      if (isVideoFile(tedTalk.featured_image)) {
        const directusUrl = import.meta.env.VITE_DIRECTUS_URL || 'http://localhost:8055';
        const videoUrl = `${directusUrl}/assets/${tedTalk.featured_image}`;
        console.log('✅ URL vidéo construite depuis string featured_image:', videoUrl);
        return videoUrl;
      }
    }
  }

  // Chercher dans le champ cover UNIQUEMENT si c'est une vidéo
  if (tedTalk.cover) {
    console.log('=== Analyse cover ===');
    
    if (typeof tedTalk.cover === 'object' && tedTalk.cover !== null) {
      const videoFileId = extractVideoFromDirectusFile(tedTalk.cover);
      if (videoFileId) {
        const directusUrl = import.meta.env.VITE_DIRECTUS_URL || 'http://localhost:8055';
        const videoUrl = `${directusUrl}/assets/${videoFileId}`;
        console.log('✅ URL vidéo construite depuis cover objet:', videoUrl);
        return videoUrl;
      }
    } else if (typeof tedTalk.cover === 'string') {
      console.log('cover est une string (ID ou URL):', tedTalk.cover);
      
      // Vérifier si c'est une URL YouTube/Vimeo dans le champ cover aussi
      if (tedTalk.cover.includes('youtube.com') || 
          tedTalk.cover.includes('youtu.be') || 
          tedTalk.cover.includes('vimeo.com') ||
          tedTalk.cover.includes('www.youtube.com') ||
          tedTalk.cover.includes('m.youtube.com')) {
        
        console.log('🎬 URL externe détectée dans cover:', tedTalk.cover);
        
        // Convertir différents formats d'URL YouTube en URL d'embed
        let embedUrl = tedTalk.cover;
        
        if (tedTalk.cover.includes('youtube.com/watch?v=')) {
          const videoId = tedTalk.cover.split('v=')[1]?.split('&')[0];
          if (videoId) {
            embedUrl = `https://www.youtube.com/embed/${videoId}`;
            console.log('✅ URL YouTube (cover) convertie en embed:', embedUrl);
          }
        } else if (tedTalk.cover.includes('youtu.be/')) {
          const videoId = tedTalk.cover.split('youtu.be/')[1]?.split('?')[0];
          if (videoId) {
            embedUrl = `https://www.youtube.com/embed/${videoId}`;
            console.log('✅ URL YouTube courte (cover) convertie en embed:', embedUrl);
          }
        } else if (tedTalk.cover.includes('vimeo.com/')) {
          const videoId = tedTalk.cover.split('vimeo.com/')[1]?.split('?')[0];
          if (videoId) {
            embedUrl = `https://player.vimeo.com/video/${videoId}`;
            console.log('✅ URL Vimeo (cover) convertie en embed:', embedUrl);
          }
        }
        
        return embedUrl;
      }
      
      // Si c'est une chaîne qui ressemble à un ID Directus (UUID), construire l'URL asset
      if (tedTalk.cover.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        // Vérifier dans la base si c'est un fichier vidéo avant de construire l'URL
        console.log('Cover est un UUID, à vérifier si c\'est une vidéo');
        const directusUrl = import.meta.env.VITE_DIRECTUS_URL || 'http://localhost:8055';
        const videoUrl = `${directusUrl}/assets/${tedTalk.cover}`;
        console.log('URL construite depuis cover ID (à vérifier):', videoUrl);
        // On ne retourne pas directement ici car on ne sait pas si c'est une vidéo
        // Cette partie sera gérée par le type MIME check plus tard
      }
      
      // Vérifier si c'est un nom de fichier vidéo
      if (isVideoFile(tedTalk.cover)) {
        const directusUrl = import.meta.env.VITE_DIRECTUS_URL || 'http://localhost:8055';
        const videoUrl = `${directusUrl}/assets/${tedTalk.cover}`;
        console.log('✅ URL vidéo construite depuis string cover:', videoUrl);
        return videoUrl;
      }
    }
  }
  
  // Chercher dans d'autres champs potentiels
  if (tedTalk.video_url) {
    console.log('video_url trouvé:', tedTalk.video_url);
    return tedTalk.video_url;
  }
  
  console.log('❌ Aucune URL vidéo trouvée');
  console.log('=== FIN DEBUG ===');
  return '';
};

// Fonction pour détecter si c'est une vidéo uploadée ou externe
const isUploadedVideo = (url: string) => {
  if (!url) return false;
  
  console.log('=== Détection type vidéo ===');
  console.log('URL à analyser:', url);
  
  // Si c'est YouTube ou Vimeo, c'est externe
  if (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com')) {
    console.log('✅ Vidéo externe détectée (YouTube/Vimeo)');
    return false;
  }
  
  // Si l'URL contient le domaine Directus ET /assets/, c'est un fichier uploadé
  const directusUrl = import.meta.env.VITE_DIRECTUS_URL || 'http://localhost:8055';
  if (url.includes(directusUrl) && url.includes('/assets/')) {
    console.log('✅ Vidéo uploadée détectée (Directus assets)');
    return true;
  }
  
  // Vérifier l'extension du fichier dans l'URL
  const videoExtensions = ['.mp4', '.avi', '.mov', '.webm', '.mkv', '.flv', '.wmv', '.m4v'];
  const urlLower = url.toLowerCase();
  const hasVideoExtension = videoExtensions.some(ext => urlLower.includes(ext));
  
  if (hasVideoExtension) {
    console.log('✅ Extension vidéo détectée dans URL');
    return true;
  }
  
  // Si ce n'est pas une URL complète et pas reconnu comme externe, considérer comme uploadé
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    console.log('✅ Fichier local détecté');
    return true;
  }
  
  console.log('❓ Type non déterminé, défaut: externe');
  return false;
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

const formatViews = (views: number) => {
  if (views < 1000) return views.toString();
  if (views < 1000000) return Math.floor(views / 1000) + 'k';
  return Math.floor(views / 1000000) + 'M';
};

// Fonction pour obtenir le thumbnail YouTube d'un TED Talk
const getYoutubeThumbnail = (tedItem: any): string | null => {
  if (!tedItem) return null;

  console.log('=== DEBUG THUMBNAIL YOUTUBE ===');
  console.log('TED Talk:', tedItem.title);
  console.log('featured_image:', tedItem.featured_image, 'type:', typeof tedItem.featured_image);
  console.log('cover:', tedItem.cover, 'type:', typeof tedItem.cover);

  // Fonction pour extraire l'ID YouTube
  const extractYouTubeId = (url: string): string | null => {
    if (!url) return null;
    
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&\n?#]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^&\n?#]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([^&\n?#]+)/,
      /(?:https?:\/\/)?youtu\.be\/([^&\n?#]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([^&\n?#]+)/,
      /(?:https?:\/\/)?(?:m\.)?youtube\.com\/watch\?v=([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        console.log('✅ Video ID trouvé:', match[1], 'via pattern:', pattern);
        return match[1];
      }
    }
    console.log('❌ Aucun ID YouTube trouvé dans:', url);
    return null;
  };

  // Vérifier featured_image
  if (tedItem.featured_image && typeof tedItem.featured_image === 'string') {
    if (tedItem.featured_image.includes('youtube.com') || tedItem.featured_image.includes('youtu.be')) {
      console.log('🎬 YouTube URL détectée dans featured_image');
      const videoId = extractYouTubeId(tedItem.featured_image);
      if (videoId) {
        const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
        console.log('✅ Thumbnail YouTube créée:', thumbnailUrl);
        return thumbnailUrl;
      }
    } else {
      console.log('❌ featured_image n\'est pas une URL YouTube');
    }
  }

  // Vérifier cover
  if (tedItem.cover && typeof tedItem.cover === 'string') {
    if (tedItem.cover.includes('youtube.com') || tedItem.cover.includes('youtu.be')) {
      console.log('🎬 YouTube URL détectée dans cover');
      const videoId = extractYouTubeId(tedItem.cover);
      if (videoId) {
        const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
        console.log('✅ Thumbnail YouTube créée depuis cover:', thumbnailUrl);
        return thumbnailUrl;
      }
    } else {
      console.log('❌ cover n\'est pas une URL YouTube');
    }
  }

  console.log('❌ Aucune URL YouTube trouvée pour les thumbnails');
  return null;
};

// Fonction pour obtenir le cover Directus d'un TED Talk
const getDirectusCover = (tedItem: any): string | undefined => {
  if (!tedItem) return undefined;

  const directusUrl = import.meta.env.VITE_DIRECTUS_URL || 'http://localhost:8055';

  // PRIORITÉ 1: Vérifier cover en premier (dédié aux images de couverture)
  if (tedItem.cover) {
    if (typeof tedItem.cover === 'object' && tedItem.cover.id) {
      return `${directusUrl}/assets/${tedItem.cover.id}?width=400&height=225&fit=cover`;
    } else if (typeof tedItem.cover === 'string' && 
               tedItem.cover.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      return `${directusUrl}/assets/${tedItem.cover}?width=400&height=225&fit=cover`;
    }
  }

  // PRIORITÉ 2: Vérifier featured_image SEULEMENT si c'est une image (pas une vidéo)
  if (tedItem.featured_image) {
    // Si c'est un objet, vérifier le type MIME
    if (typeof tedItem.featured_image === 'object' && tedItem.featured_image.id) {
      // Vérifier si c'est une image (pas une vidéo)
      if (tedItem.featured_image.type && tedItem.featured_image.type.startsWith('image/')) {
        return `${directusUrl}/assets/${tedItem.featured_image.id}?width=400&height=225&fit=cover`;
      }
    } 
    // Si c'est un UUID string, on ne peut pas vérifier le type facilement ici
    // Donc on passe cette vérification pour éviter d'afficher des vidéos comme thumbnails
  }

  return undefined;
};

// Fonction pour gérer les erreurs de thumbnail
const onThumbnailError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  // Masquer l'image et laisser le fallback s'afficher
  img.style.display = 'none';
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

const navigateToTedTalk = (tedItem: any) => {
  if (!tedItem) {
    console.error('Aucun TED Talk fourni pour la navigation');
    return;
  }

  console.log('=== NAVIGATION TED TALK ===');
  console.log('TED Talk sélectionné:', tedItem);
  console.log('ID:', tedItem.id);
  console.log('Title:', tedItem.title);
  console.log('Slug:', tedItem.slug);
  console.log('Type slug:', typeof tedItem.slug);
  
  try {
    let targetRoute = '';
    
    if (tedItem.slug && tedItem.slug.trim() !== '') {
      targetRoute = `/inspirations/teds/${tedItem.slug}`;
      console.log('✅ Navigation via slug:', targetRoute);
    } else if (tedItem.id) {
      targetRoute = `/inspirations/teds/${tedItem.id}`;
      console.log('✅ Navigation via ID:', targetRoute);
    } else {
      console.error('❌ TED Talk sans slug ni ID:', tedItem);
      return;
    }
    
    console.log('🚀 Redirection vers:', targetRoute);
    router.push(targetRoute).then(() => {
      console.log('✅ Navigation réussie');
    }).catch((error) => {
      console.error('❌ Erreur de navigation:', error);
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de la navigation:', error);
  }
};

const loadTedTalk = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const slug = route.params.slug as string;
    console.log('=== CHARGEMENT TED TALK ===');
    console.log('Slug demandé:', slug);
    console.log('Route complète:', route.path);
    
    // Charger tous les articles si pas encore fait
    await fetchArticles();
    console.log('Articles chargés, total:', articles.value.length);
    
    // Trouver le TED Talk spécifique
    const foundTedTalk = articles.value.find(article => {
      // Vérifier que c'est un TED Talk
      const articleCatId = typeof article.category === 'object' ? article.category?.id : article.category;
      const isTedTalkArticle = articleCatId === 'a1ffbb1b-8b84-49a4-bd58-8a6b5220cee0'; // ID catégorie TED Talks
      
      // Correspondance par slug ou ID
      const matchBySlug = article.slug === slug;
      const matchById = article.id === slug;
      
      console.log(`Article "${article.title}":`, {
        id: article.id,
        slug: article.slug,
        isTedTalk: isTedTalkArticle,
        matchBySlug,
        matchById
      });
      
      return isTedTalkArticle && (matchBySlug || matchById);
    });
    
    if (foundTedTalk) {
      console.log('✅ TED Talk trouvé:', {
        id: foundTedTalk.id,
        title: foundTedTalk.title,
        slug: foundTedTalk.slug,
        cover: foundTedTalk.cover,
        featured_image: foundTedTalk.featured_image
      });
      
      // Réinitialiser l'état précédent
      tedTalk.value = null;
      
      // Délai court pour éviter les problèmes de réactivité
      setTimeout(() => {
        tedTalk.value = foundTedTalk;
        console.log('🎬 TED Talk assigné à la réactive');
      }, 50);
      
    } else {
      console.error('❌ Aucun TED Talk trouvé avec le slug:', slug);
      
      // Debug: lister tous les TED Talks disponibles
      const allTedTalks = articles.value.filter(article => {
        const articleCatId = typeof article.category === 'object' ? article.category?.id : article.category;
        return articleCatId === 'a1ffbb1b-8b84-49a4-bd58-8a6b5220cee0';
      });
      console.log('📋 TED Talks disponibles:', allTedTalks.map(t => ({ 
        id: t.id, 
        title: t.title, 
        slug: t.slug 
      })));
      
      error.value = 'TED Talk non trouvé';
    }
    
  } catch (err) {
    console.error('Erreur lors du chargement du TED Talk:', err);
    error.value = 'Erreur lors du chargement du TED Talk';
  } finally {
    loading.value = false;
  }
};

// Lifecycle
onMounted(() => {
  loadTedTalk();
});

// Watch route changes
watch(() => route.params.slug, (newSlug) => {
  if (newSlug) {
    loadTedTalk();
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

.ted-content {
  line-height: 1.8;
}

.ted-content :deep(h2) {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 2rem 0 1rem 0;
  color: rgb(var(--v-theme-primary));
}

.ted-content :deep(h3) {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 1.5rem 0 0.75rem 0;
}

.ted-content :deep(p) {
  margin-bottom: 1.25rem;
}

.ted-content :deep(ul),
.ted-content :deep(ol) {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

.ted-content :deep(li) {
  margin-bottom: 0.5rem;
}

.ted-content :deep(blockquote) {
  border-left: 4px solid rgb(var(--v-theme-primary));
  padding: 1rem 1.5rem;
  margin: 1.5rem 0;
  background-color: #f8f9fa;
  font-style: italic;
}

.ted-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 1.5rem 0;
}

/* Styles pour la section TED */
.ted-section {
  background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
  border-radius: 12px;
  padding: 24px;
  border-left: 4px solid #FF1744;
}

.video-player-section {
  width: 100%;
}

.video-player-card {
  border-radius: 12px !important;
  transition: all 0.3s ease;
  overflow: hidden;
}

.video-container {
  position: relative;
  width: 100%;
  min-height: 300px;
}

.video-wrapper {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; /* Ratio 16:9 */
  overflow: hidden;
  border-radius: 12px;
}

.ted-video-player {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 12px;
}

.ted-info-section {
  margin-top: 24px;
}

.article-card {
  cursor: pointer;
  transition: all 0.2s ease;
}

.article-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.thumbnail-container {
  position: relative;
  overflow: hidden;
}

.thumbnail-image {
  transition: transform 0.2s ease;
}

.article-card:hover .thumbnail-image {
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .h2-article-title {
    font-size: 32px;
  }

  .ted-content :deep(h2) {
    font-size: 1.25rem;
  }

  .ted-content :deep(h3) {
    font-size: 1.1rem;
  }

  .video-container {
    min-height: 200px;
  }
}

@media (max-width: 960px) {
  .ted-section .v-col {
    margin-bottom: 16px;
  }
}
</style>
