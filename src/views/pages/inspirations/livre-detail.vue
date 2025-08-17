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
        <h2 class="text-h4 mt-4 mb-2">Livre non trouvé</h2>
        <p class="text-grey-darken-1 mb-4">{{ error }}</p>
        <div class="d-flex justify-center gap-4 mt-6">
          <v-btn color="primary" to="/inspirations/livres">Retour aux livres</v-btn>
          <v-btn color="secondary" @click="loadBook" variant="outlined">Réessayer</v-btn>
        </div>
      </div>

      <!-- Book content -->
      <div v-else-if="book">
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

        <!-- Image mise en avant avec informations du livre -->
        <section class="">
          <v-container class="nav-container">
            <v-row>
              <v-col cols="12" md="9">
               <!--  <v-img :src="getBookCoverUrl(book)" height="500" class="rounded-lg featured-image" cover>
                  <template v-slot:placeholder>
                    <div class="d-flex align-center justify-center fill-height">
                      <v-progress-circular indeterminate color="primary"></v-progress-circular>
                    </div>
                  </template>
                </v-img> -->

                <div v-if="book" class="featured-image-container">
                  <!-- Article header -->
                  <div class="d-flex flex-column">
                    <div class="">
                      <div class="align-center mb-2">
                        <div class="d-flex flex-column mb-2">
                        <!--   <h3 class="text-h6 font-weight-bold mb-2">
                            <span class="actuelle-ligne">Inspirations RH</span>
                            <span class="bg-accent mx-2"
                              style="width: 8px; height: 8px; opacity: 50%; border-radius: 50%; display: inline-block;"></span>
                            Livre
                          </h3> -->
                         
                          
<!--                           <div class="d-flex align-center mb-6">
                            <span class="text-subtitle-2">Par <span class="text-accent-text">{{ getAuthorDisplayName(book) }}</span></span>
                            <v-icon size="small" class="mx-2 text-grey">mdi-circle-small</v-icon>
                            <span class="text-subtitle-2 text-grey-darken-1">Publié le {{ formatDate(book.published_date || book.date_created) }}</span>
                          </div> -->
                          
                          <p class="text-body-6">
                            {{ book.excerpt }}
                          </p>
                          
                          <!-- Section spéciale pour les livres avec cover -->
                          <div class="cover-section mb-6"><!-- cover-section -->
                            <v-row>
                              <!-- Image de couverture -->
                              <v-col cols="12" md="4" v-if="book.cover">
                                <div class="cover-display">
                                  <v-img 
                                    :src="getBookCoverUrl(book)" 
                                    height="300" 
                                    class="rounded-lg cover-image"
                                    cover
                                  >
                                    <template v-slot:placeholder>
                                      <div class="d-flex align-center justify-center h-100">
                                        <v-icon size="64" color="grey-lighten-2">mdi-book-open-page-variant</v-icon>
                                      </div>
                                    </template>
                                  </v-img>
                                </div>
                              </v-col>
                              
                              <!-- Informations spécifiques du livre -->
                              <v-col cols="12" :md="book.cover ? 8 : 12">
                                <div class="category-specific-info">
                                  <div class=""><!-- book-info -->
                                    <v-icon color="primary" size="24" class="mb-2">mdi-book-open-page-variant</v-icon>
                                    <!-- <h4 class="text-h6 mb-3">À propos de ce livre</h4> -->
                                      <h2 class="h2-article-title mb-2">
                            {{ book.title }}
                          </h2>
                                    <div class="d-flex flex-column gap-2">
                                      <div class="d-flex align-center">
                                        <v-icon size="16" class="me-2">mdi-account-edit</v-icon>
                                        <span class="text-body-2"><strong>Auteur:</strong> {{ getAuthorDisplayName(book) }}</span>
                                      </div>
                                      <div v-if="book.reading_time" class="d-flex align-center">
                                        <v-icon size="16" class="me-2">mdi-clock-outline</v-icon>
                                        <span class="text-body-2"><strong>Temps de lecture:</strong> ~{{ book.reading_time }} minutes</span>
                                      </div>
                                      <div class="d-flex align-center">
                                        <v-icon size="16" class="me-2">mdi-tag-outline</v-icon>
                                        <span class="text-body-2"><strong>Genre:</strong> Ressources Humaines</span>
                                      </div>
                                      <div v-if="book.pages_count" class="d-flex align-center">
                                        <v-icon size="16" class="me-2">mdi-book-multiple</v-icon>
                                        <span class="text-body-2"><strong>Nombre de pages:</strong> {{ book.pages_count }}</span>
                                      </div>
                                    </div>
                                    
                                    <!-- Bouton de téléchargement simple -->
                                    <v-btn 
                                      class="download-btn mt-4" 
                                      color="#FF6B35"
                                      variant="flat"
                                      :loading="downloading"
                                      @click="downloadBook"
                                      size="large"
                                    >
                                      <v-icon class="mr-2">mdi-download</v-icon>
                                      Télécharger
                                    </v-btn>
                                  </div>
                                </div>
                              </v-col>
                            </v-row>
                          </div>
                          
                          <!-- Contenu du livre -->
                          <div class="article-content text-body-1" v-if="book && book.content" v-html="sanitizeContent(book.content)"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Actions sociales -->
                <SocialLinks :article="book" class="mb-6" />
              </v-col>

              <!-- Sidebar pour autres livres -->
              <v-col cols="12" md="3">
                <v-row>
                  <v-col cols="12" v-for="livre in otherBooks.slice(0, 3)" :key="livre.id">
                    <v-card class="article-card" flat @click="navigateToBook(livre)">
                      <div class="d-flex flex-column rounded-lg">
                        <v-img :src="getBookCoverUrl(livre)" cover class="rounded-t-lg" height="125"></v-img>
                        <v-card-text class="px-1 pt-2">
                          <v-chip size="small" class="mb-3 category-chip" variant="flat" :color="getCategoryColor(livre.category)">
                              {{ getCategoryName(livre.category) }}
                          </v-chip>
                          <h3 class="text-h6 font-weight-bold mb-1">
                            {{ livre.title }}
                          </h3>
                          <p class="text-caption text-grey-darken-1">
                            Publié le {{ formatDate(livre.published_date || livre.date_created) }}
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
const book = ref<any>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const downloading = ref(false);

// Composables
const { articles, fetchArticles } = useArticles();

// Computed properties
const otherBooks = computed(() => {
  const bookCategoryId = '7a76533b-411d-4760-b396-f6ac1509394f'; // ID catégorie livres
  
  return articles.value
    .filter(article => {
      // Filtrer les livres seulement
      const articleCatId = typeof article.category === 'object' ? article.category?.id : article.category;
      const isBookArticle = articleCatId === bookCategoryId;
      
      // Exclure le livre courant
      return isBookArticle && article.id !== book.value?.id;
    })
    .sort((a, b) => {
      const dateA = new Date(a.published_date || a.date_created || '').getTime();
      const dateB = new Date(b.published_date || b.date_created || '').getTime();
      return dateB - dateA;
    });
});

// Fonctions utilitaires

// Retourne le nom de la catégorie à partir de l'ID ou de l'objet catégorie
const getCategoryName = (category: any): string => {
  if (!category) return 'Catégorie inconnue';
  if (typeof category === 'object' && category !== null) {
    return category.name || category.title || 'Catégorie inconnue';
  }
  // Si c'est un ID, vous pouvez ajouter une correspondance ici si besoin
  if (typeof category === 'string') {
    // Ajoutez ici la logique pour retourner le nom à partir de l'ID si nécessaire
    if (category === '7a76533b-411d-4760-b396-f6ac1509394f') return 'Livre';
    // Ajoutez d'autres correspondances si besoin
    return 'Catégorie inconnue';
  }
  return 'Catégorie inconnue';
};

// Retourne la couleur de la catégorie à partir de l'ID ou de l'objet catégorie
const getCategoryColor = (category: any): string => {
  // Ajoutez ici vos correspondances de couleurs selon les catégories
  const categoryId = typeof category === 'object' && category !== null ? category.id : category;
  if (categoryId === '7a76533b-411d-4760-b396-f6ac1509394f') return 'primary'; // Livre
  // Ajoutez d'autres correspondances si besoin
  return 'grey-lighten-1';
};

const getBookCoverUrl = (book: any) => {
  if (!book) return '';

  const directusUrl = import.meta.env.VITE_DIRECTUS_URL || 'http://localhost:8055';
  
  // Vérifier d'abord le champ cover pour les livres
  if (book.cover) {
    let imageId: string | undefined;
    if (typeof book.cover === 'object' && book.cover !== null) {
      imageId = book.cover.id;
    } else if (typeof book.cover === 'string') {
      imageId = book.cover;
    }
    
    if (imageId) {
      const cacheBreaker = new Date().getTime();
      return `${directusUrl}/assets/${imageId}?width=400&height=600&fit=cover&quality=90&v=${cacheBreaker}`;
    }
  }
  
  // Fallback sur featured_image
  if (book.featured_image) {
    let imageId: string | undefined;
    if (typeof book.featured_image === 'object' && book.featured_image !== null) {
      imageId = book.featured_image.id;
    } else if (typeof book.featured_image === 'string') {
      imageId = book.featured_image;
    }
    
    if (imageId) {
      const cacheBreaker = new Date().getTime();
      return `${directusUrl}/assets/${imageId}?width=400&height=600&fit=cover&quality=90&v=${cacheBreaker}`;
    }
  }
  
  return '';
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

const downloadBook = async () => {
  if (!book.value) return;
  
  downloading.value = true;
  
  try {
    console.log('Démarrage du téléchargement du livre:', book.value.title);
    console.log('Données complètes du livre:', book.value);
    
    const directusUrl = import.meta.env.VITE_DIRECTUS_URL || 'http://localhost:8055';
    
    // Le document est dans le champ featured_image
    if (book.value.featured_image) {
      console.log('Featured_image trouvé:', book.value.featured_image);
      
      let fileId = '';
      let fileName = '';
      
      // Extraire l'ID et le nom du fichier selon le format
      if (typeof book.value.featured_image === 'object' && book.value.featured_image !== null) {
        fileId = book.value.featured_image.id || book.value.featured_image.filename_disk || book.value.featured_image.filename;
        fileName = book.value.featured_image.filename_download || book.value.featured_image.title || book.value.featured_image.name || 'document';
      } else if (typeof book.value.featured_image === 'string') {
        fileId = book.value.featured_image;
        fileName = `${book.value.title}_document`;
      }
      
      if (fileId) {
        // Vérifier d'abord les informations du fichier dans la base
        console.log(`ID du fichier: ${fileId}`);
        
        const fileUrl = `${directusUrl}/assets/${fileId}`;
        console.log(`Téléchargement du fichier depuis: ${fileUrl}`);
        
        // Créer un lien de téléchargement
        const link = document.createElement('a');
        link.href = fileUrl;
        
        // Assurer que le nom du fichier a la bonne extension
        if (!fileName.includes('.')) {
          fileName = `${fileName}.docx`; // Extension par défaut basée sur ce qu'on a vu dans la base
        }
        
        link.download = fileName;
        link.target = '_blank';
        
        // Ajouter le lien au DOM temporairement pour déclencher le téléchargement
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log(`Document téléchargé: ${fileName}`);
        return;
      }
    }
    
    // Si vraiment aucun document n'est trouvé dans featured_image
    console.warn('Aucun document trouvé dans featured_image pour ce livre');
    alert(`Désolé, aucun document n'est disponible pour le téléchargement pour "${book.value.title}". Veuillez contacter l'administrateur.`);
    
  } catch (err) {
    console.error('Erreur lors du téléchargement:', err);
    alert('Erreur lors du téléchargement. Veuillez réessayer plus tard.');
  } finally {
    downloading.value = false;
  }
};

const navigateToBook = (livre: any) => {
  if (!livre) {
    console.error('Aucun livre fourni pour la navigation');
    return;
  }

  console.log('Navigation vers le livre:', livre.id, livre.title, livre.slug);
  
  try {
    if (livre.slug && livre.slug.trim() !== '') {
      router.push(`/inspirations/livres/${livre.slug}`);
    } else if (livre.id) {
      router.push(`/inspirations/livres/${livre.id}`);
    } else {
      console.error('Livre sans slug ni ID:', livre);
    }
  } catch (error) {
    console.error('Erreur lors de la navigation:', error);
  }
};

const loadBook = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const slug = route.params.slug as string;
    
    // Charger tous les articles si pas encore fait
    await fetchArticles();
    
    // Trouver le livre spécifique
    const foundBook = articles.value.find(article => {
      // Vérifier que c'est un livre
      const articleCatId = typeof article.category === 'object' ? article.category?.id : article.category;
      const isBookArticle = articleCatId === '7a76533b-411d-4760-b396-f6ac1509394f'; // ID catégorie livres
      
      // Correspondance par slug ou ID
      return isBookArticle && (article.slug === slug || article.id === slug);
    });
    
    if (foundBook) {
      book.value = foundBook;
      console.log('Livre trouvé:', foundBook);
    } else {
      error.value = 'Livre non trouvé';
    }
    
  } catch (err) {
    console.error('Erreur lors du chargement du livre:', err);
    error.value = 'Erreur lors du chargement du livre';
  } finally {
    loading.value = false;
  }
};

// Lifecycle
onMounted(() => {
  loadBook();
});

// Watch route changes
watch(() => route.params.slug, (newSlug) => {
  if (newSlug) {
    loadBook();
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

.featured-image-container {
  position: relative;
  margin-bottom: 2rem;
}

.featured-image {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.actuelle-ligne {
  color: rgb(var(--v-theme-primary));
}

.text-accent-text {
  color: rgb(var(--v-theme-accent));
}

/* Styles pour la section cover */
.cover-section {
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
  border-radius: 12px;
  padding: 24px;
  border-left: 4px solid #006FFF;
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

.download-card {
  border-radius: 12px !important;
  cursor: pointer;
  transition: all 0.3s ease;
}

.download-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(142, 36, 170, 0.3);
}

.download-btn {
  border-radius: 8px !important;
  color: white !important;
  font-weight: 500;
  text-transform: none;
  letter-spacing: normal;
  padding: 12px 24px !important;
  min-width: 150px;
}

.download-btn:hover {
  background-color: rgb(var(--v-theme-accent)) !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
}

.article-card {
  cursor: pointer;
  transition: all 0.2s ease;
}

.article-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.gap-3 {
  gap: 12px;
}

@media (max-width: 768px) {
  .h2-article-title {
    font-size: 32px;
  }

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

@media (max-width: 960px) {
  .cover-section .v-col {
    margin-bottom: 16px;
  }
  
  .category-specific-info {
    justify-content: flex-start;
  }
}
</style>
