import type { Article } from '@/plugins/directus';

// IDs des catégories qui utilisent le champ cover
export const MULTIMEDIA_CATEGORIES = {
  LIVRES: '1580c32a-73cf-434e-90e5-f0066d67b69a',
  PODCASTS: '0b9edfa2-c2a8-4af1-bdf8-f027784f4e10',
  TED_TALKS: 'c21e89a5-6314-43a3-b264-9af3a6d4cc41'
};

/**
 * Détermine si une catégorie doit utiliser le champ cover au lieu de featured_image
 */
export function shouldUseCoverImage(categoryId: string): boolean {
  return Object.values(MULTIMEDIA_CATEGORIES).includes(categoryId);
}

/**
 * Récupère l'image appropriée d'un article selon sa catégorie
 */
export function getArticleImage(article: Article): string | { id: string } | any {
  const categoryId = typeof article.category === 'string' 
    ? article.category 
    : article.category?.id;

  if (categoryId && shouldUseCoverImage(categoryId)) {
    // Pour les catégories multimedia, privilégier cover puis featured_image en fallback
    return article.cover || article.featured_image;
  }
  
  // Pour les autres catégories, utiliser featured_image
  return article.featured_image;
}

/**
 * Récupère le nom de la catégorie selon son ID
 */
export function getCategoryName(categoryId: string): string {
  switch (categoryId) {
    case MULTIMEDIA_CATEGORIES.LIVRES:
      return 'Livres';
    case MULTIMEDIA_CATEGORIES.PODCASTS:
      return 'Podcasts';
    case MULTIMEDIA_CATEGORIES.TED_TALKS:
      return 'TED Talks';
    default:
      return '';
  }
}

/**
 * Récupère le slug de la catégorie pour les URLs
 */
export function getCategorySlug(categoryId: string): string {
  switch (categoryId) {
    case MULTIMEDIA_CATEGORIES.LIVRES:
      return 'livres';
    case MULTIMEDIA_CATEGORIES.PODCASTS:
      return 'podcasts';
    case MULTIMEDIA_CATEGORIES.TED_TALKS:
      return 'ted-talks';
    default:
      return '';
  }
}
