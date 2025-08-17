// Utilitaires pour gérer les différents types de fichiers multimedia
// dans le champ featured_image

export interface MediaFile {
  id: string;
  type: 'image' | 'audio' | 'video' | 'pdf' | 'unknown';
  mimeType?: string;
  filename_download?: string;
  title?: string;
}

/**
 * Détermine le type de média basé sur le MIME type ou l'extension
 */
export function getMediaType(file: any): MediaFile['type'] {
  if (!file) return 'unknown';
  
  const mimeType = file.type || '';
  const filename = file.filename_download || file.title || '';
  
  // Vérifier par MIME type d'abord
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType === 'application/pdf') return 'pdf';
  
  // Vérifier par extension si MIME type n'est pas disponible
  const extension = filename.split('.').pop()?.toLowerCase();
  
  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  const audioExts = ['mp3', 'wav', 'ogg', 'aac', 'm4a'];
  const videoExts = ['mp4', 'mpeg', 'mov', 'avi', 'webm', 'mkv'];
  const pdfExts = ['pdf'];
  
  if (extension && imageExts.includes(extension)) return 'image';
  if (extension && audioExts.includes(extension)) return 'audio';
  if (extension && videoExts.includes(extension)) return 'video';
  if (extension && pdfExts.includes(extension)) return 'pdf';
  
  return 'unknown';
}

/**
 * Génère l'URL pour afficher/télécharger le fichier
 */
export function getMediaUrl(file: any, options: {
  width?: number;
  height?: number;
  quality?: number;
  fit?: 'cover' | 'contain' | 'inside' | 'outside';
} = {}): string {
  if (!file) return '';
  
  const directusUrl = import.meta.env.VITE_DIRECTUS_URL || 'http://localhost:8055';
  const fileId = typeof file === 'string' ? file : file.id;
  
  if (!fileId) return '';
  
  const mediaType = getMediaType(file);
  
  // Pour les images, on peut appliquer des transformations
  if (mediaType === 'image') {
    const params = new URLSearchParams();
    if (options.width) params.set('width', options.width.toString());
    if (options.height) params.set('height', options.height.toString());
    if (options.quality) params.set('quality', options.quality.toString());
    if (options.fit) params.set('fit', options.fit);
    
    const queryString = params.toString();
    return `${directusUrl}/assets/${fileId}${queryString ? `?${queryString}` : ''}`;
  }
  
  // Pour les autres types de fichiers, URL directe
  return `${directusUrl}/assets/${fileId}`;
}

/**
 * Génère une URL de thumbnail pour les vidéos (si supporté par Directus)
 */
export function getVideoThumbnail(file: any, options: {
  width?: number;
  height?: number;
} = {}): string {
  if (!file || getMediaType(file) !== 'video') return '';
  
  const directusUrl = import.meta.env.VITE_DIRECTUS_URL || 'http://localhost:8055';
  const fileId = typeof file === 'string' ? file : file.id;
  
  if (!fileId) return '';
  
  const params = new URLSearchParams();
  params.set('thumbnail', 'true');
  if (options.width) params.set('width', options.width.toString());
  if (options.height) params.set('height', options.height.toString());
  
  return `${directusUrl}/assets/${fileId}?${params.toString()}`;
}

/**
 * Obtient le nom d'affichage du fichier
 */
export function getMediaDisplayName(file: any): string {
  if (!file) return 'Fichier inconnu';
  
  return file.title || file.filename_download || file.id || 'Fichier sans nom';
}

/**
 * Obtient l'icône Material Design appropriée pour le type de fichier
 */
export function getMediaIcon(file: any): string {
  const mediaType = getMediaType(file);
  
  switch (mediaType) {
    case 'image': return 'mdi-image';
    case 'audio': return 'mdi-music-note';
    case 'video': return 'mdi-video';
    case 'pdf': return 'mdi-file-pdf';
    default: return 'mdi-file';
  }
}

/**
 * Vérifie si le fichier peut être affiché dans le navigateur
 */
export function canPlayInBrowser(file: any): boolean {
  const mediaType = getMediaType(file);
  const mimeType = file?.type || '';
  
  if (mediaType === 'image') return true;
  if (mediaType === 'pdf') return true;
  
  if (mediaType === 'audio') {
    return ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3', 'audio/mp4'].includes(mimeType);
  }
  
  if (mediaType === 'video') {
    return ['video/mp4', 'video/webm', 'video/ogg'].includes(mimeType);
  }
  
  return false;
}
