// Utilitaires de validation pour les médias TED Talks
export const MediaValidator = {
  /**
   * Vérifie si une URL est une vidéo valide (YouTube, Vimeo, etc.)
   */
  isValidVideoUrl(url) {
    if (!url || typeof url !== 'string') return false;
    
    const videoUrlPatterns = [
      // YouTube
      /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/)|youtu\.be\/|youtube\.com\/shorts\/)[\w-]+/i,
      // Vimeo
      /^(https?:\/\/)?(www\.)?(vimeo\.com\/)[\d]+/i,
      // Dailymotion
      /^(https?:\/\/)?(www\.)?(dailymotion\.com\/video\/)[\w-]+/i,
      // Twitch
      /^(https?:\/\/)?(www\.)?(twitch\.tv\/videos\/)[\d]+/i
    ];
    
    return videoUrlPatterns.some(pattern => pattern.test(url));
  },

  /**
   * Vérifie si un UUID Directus correspond à un fichier vidéo
   */
  async isValidDirectusVideo(uuid, directusUrl = 'http://localhost:8055') {
    if (!uuid || uuid.length !== 36) return false; // UUID format check
    
    try {
      const response = await fetch(`${directusUrl}/files/${uuid}`);
      if (!response.ok) return false;
      
      const fileData = await response.json();
      const mimeType = fileData.data?.type || '';
      
      // Vérifier que c'est bien un fichier vidéo
      const videoMimeTypes = [
        'video/mp4',
        'video/webm', 
        'video/ogg',
        'video/avi',
        'video/mov',
        'video/quicktime'
      ];
      
      return videoMimeTypes.includes(mimeType);
    } catch (error) {
      console.error('Erreur validation fichier Directus:', error);
      return false;
    }
  },

  /**
   * Valide une source vidéo (URL ou UUID)
   */
  async validateVideoSource(source) {
    console.log('🔍 Validation source vidéo:', source);
    
    if (!source) {
      console.log(' Source vide');
      return { valid: false, type: 'empty', error: 'Aucune source vidéo fournie' };
    }

    // Test URL vidéo
    if (this.isValidVideoUrl(source)) {
      console.log('✅ URL vidéo valide détectée');
      return { valid: true, type: 'url', source };
    }

    // Test UUID Directus
    if (typeof source === 'string' && source.length === 36) {
      const isValidVideo = await this.isValidDirectusVideo(source);
      if (isValidVideo) {
        console.log('✅ Fichier vidéo Directus valide');
        return { valid: true, type: 'directus', source };
      } else {
        console.log('❌ UUID Directus ne correspond pas à une vidéo');
        return { valid: false, type: 'invalid_file', error: 'Le fichier n\'est pas une vidéo valide' };
      }
    }

    console.log('❌ Format de source non reconnu');
    return { valid: false, type: 'unknown', error: 'Format de source vidéo non reconnu' };
  },

  /**
   * Nettoie et corrige les données vidéo corrompues
   */
  async cleanupCorruptedVideoData(articles) {
    console.log('🧹 Nettoyage des données vidéo corrompues...');
    const cleanedArticles = [];
    
    for (const article of articles) {
      const validation = await this.validateVideoSource(article.featured_image);
      
      if (!validation.valid) {
        console.warn(`⚠️ Article "${article.title}" a une source vidéo invalide:`, validation.error);
        
        // Essayer avec le champ cover comme fallback
        if (article.cover) {
          const coverValidation = await this.validateVideoSource(article.cover);
          if (coverValidation.valid) {
            console.log(`✅ Utilisation du champ cover comme source vidéo pour "${article.title}"`);
            article.featured_image = article.cover;
          }
        }
        
        // Si toujours invalide, marquer comme problématique
        if (!validation.valid) {
          article._hasVideoIssue = true;
          article._videoError = validation.error;
        }
      }
      
      cleanedArticles.push(article);
    }
    
    return cleanedArticles;
  }
};

export default MediaValidator;
