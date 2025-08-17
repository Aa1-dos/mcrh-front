import { createDirectus, rest, readItems, readItem, createItem, updateItem, deleteItem, uploadFiles, staticToken } from '@directus/sdk';

// Interface pour les fichiers Directus
export interface DirectusFile {
  id: string;
  storage: string;
  filename_disk?: string;
  filename_download: string;
  title?: string;
  type?: string;
  folder?: string | null;
  uploaded_by?: string;
  uploaded_on?: string;
  modified_by?: string;
  modified_on?: string;
  charset?: string;
  filesize?: number;
  width?: number;
  height?: number;
  duration?: number;
  embed?: string;
  description?: string;
  location?: string;
  tags?: string[];
  metadata?: any;
}

// Types pour les collections
export interface Article {
  id?: string;
  status?: 'draft' | 'published' | 'archived';
  sort?: number;
  user_created?: string;
  date_created?: string;
  user_updated?: string;
  date_updated?: string;
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  featured_image?: string | { id: string } | DirectusFile;
  cover?: string | { id: string } | DirectusFile;
  image?: string; // Champ local pour le traitement côté frontend
  category?: string | Category;
  author?: string | Author;
  published_date?: string;
  reading_time?: number;
  views?: number;
  tags?: Array<Tag | { tags_id: Tag }>;
  is_featured?: boolean;
  seo_title?: string;
  seo_description?: string;
}

export interface Category {
  id?: string;
  status?: 'published' | 'draft' | 'archived';
  name: string;
  slug?: string;
  description?: string;
  color?: string;
  icon?: string;
  sort?: number;
}

export interface Tag {
  id?: string;
  name: string;
  slug?: string;
  color?: string;
}

export interface Author {
  id?: string;
  status?: 'published' | 'draft' | 'archived';
  first_name: string;
  last_name: string;
  email?: string;
  bio?: string;
  avatar?: string;
  social_links?: any;
}

// Interface pour articles_tags
export interface ArticleTag {
  id?: string;
  article_id: string;
  tag_id: string;
}

// Schéma complet
export interface Schema {
  articles: Article[];
  categories: Category[];
  tags: Tag[];
  authors: Author[];
  articles_tags: ArticleTag[];
}

// Configuration du client Directus
const directusUrl = import.meta.env.VITE_DIRECTUS_URL || 'http://localhost:8055';

export const directus = createDirectus<Schema>(directusUrl).with(rest());

// Token administrateur (à remplacer par votre token)
const adminToken = import.meta.env.VITE_DIRECTUS_TOKEN;
if (adminToken) {
  directus.with(staticToken(adminToken));
}

// Services pour les articles
export class ArticleService {
  
  // Récupérer tous les articles
  static async getAllArticles(filters?: any) {
    try {
      console.log('Tentative de récupération des articles depuis:', directusUrl);
      
      // Vérifier si l'API est accessible
      try {
        const testResponse = await fetch(`${directusUrl}/server/ping`);
        console.log('Test de connexion au serveur Directus:', testResponse.ok ? 'OK' : 'Échec', testResponse.status);
        if (!testResponse.ok) {
          console.warn('Le serveur Directus est peut-être inaccessible');
        }
      } catch (pingError) {
        console.error('Impossible de contacter le serveur Directus:', pingError);
      }
      
      // Forcer le filtre pour ne récupérer que les articles publiés
      const combinedFilters = {
        ...filters,
        // Toujours filtrer par statut 'published' quelle que soit la valeur dans filters
        status: { _eq: 'published' }
      };
      
      console.log('Préparation de la requête articles avec filtre:', combinedFilters);
      const articles = await directus.request(
        readItems('articles', {
          fields: [
            'id', 'title', 'slug', 'excerpt', 'content', 'featured_image', 'cover',
            'category', 'author', 'published_date', 'reading_time', 'views', 'status'
            // Tags récupérés séparément pour éviter les erreurs
          ],
          filter: combinedFilters,
          sort: ['-published_date'],
          limit: 50
        })
      );
      
      console.log('Articles récupérés:', articles);
      
      // Vérifier si les données sont dans le bon format
      if (!Array.isArray(articles)) {
        console.warn('Format de réponse inattendu:', articles);
        // Si ce n'est pas un tableau, essayer d'extraire les données
        if (articles && typeof articles === 'object' && 'data' in articles) {
          const extractedData = (articles as any).data;
          if (Array.isArray(extractedData)) {
            console.log('Données extraites avec succès du format:', extractedData);
            // Transformer les articles pour garantir la cohérence du champ image
            return extractedData.map((article: Article) => ({
              ...article,
              image: getImageIdFromArticle(article.featured_image) || ''
            }));
          }
        }
        // Si on ne peut pas extraire de données, renvoyer un tableau vide pour éviter les erreurs
        return [];
      }
      
      // Analyser le format des featured_image dans les articles
      if (articles.length > 0 && articles[0].featured_image) {
        console.log('Exemple de featured_image dans getAllArticles:', 
                   typeof articles[0].featured_image,
                   'Valeur:', 
                   JSON.stringify(articles[0].featured_image));
      }
      
      // Transformer les articles pour garantir la cohérence du champ image
      const processedArticles = articles.map(article => ({
        ...article,
        image: getImageIdFromArticle(article.featured_image) || ''
      }));
      
      console.log('Premier article traité - image:', processedArticles[0].image);
      return processedArticles;
    } catch (error) {
      console.error('Erreur détaillée lors de la récupération des articles:', error);
      
      // Tentative alternative avec fetch
      try {
        console.log('Tentative alternative avec fetch API');
        const response = await fetch(`${directusUrl}/items/articles`);
        const result = await response.json();
        console.log('Résultat alternatif:', result);
        
        if (result && result.data && Array.isArray(result.data)) {
          console.log('Récupération alternative réussie');
          return result.data;
        }
      } catch (fetchError) {
        console.error('Échec de la récupération alternative:', fetchError);
      }
      
      throw error;
    }
  }

  // Récupérer un article par ID
  static async getArticleById(id: string) {
    try {
      console.log('Récupération de l\'article avec ID:', id);
      const article = await directus.request(
        readItem('articles', id, {
          fields: [
            'id', 'title', 'slug', 'excerpt', 'content', 'featured_image', 
            'category', 'author', 'published_date', 'reading_time', 'views', 'status'
            // Tags récupérés séparément pour éviter les erreurs
          ]
        })
      );
      
      // Examiner le format exact du champ featured_image
      console.log('Article récupéré:', article);
      if (article && article.featured_image) {
        console.log('Format de featured_image:', 
                   typeof article.featured_image, 
                   'Valeur:', 
                   JSON.stringify(article.featured_image));
      }
      
      // Assurer que le champ image est correctement défini
      const processedArticle = {
        ...article,
        image: getImageIdFromArticle(article.featured_image) || ''
      };
      
      console.log('Image extraite:', processedArticle.image);
      return processedArticle;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'article:', error);
      throw error;
    }
  }

  // Récupérer un article par slug
  static async getArticleBySlug(slug: string) {
    try {
      console.log('Récupération de l\'article avec slug:', slug);
      
      // Tentative 1 : Utiliser les relations directement
      try {
        const articles = await directus.request(
          readItems('articles', {
            fields: [
              'id', 'title', 'slug', 'excerpt', 'content', 'featured_image', 
              'published_date', 'reading_time', 'views', 'status',
              // Définir les relations explicitement
              { 
                category: ['id', 'name', 'slug', 'color'],
                author: ['id', 'first_name', 'last_name', 'avatar']
              }
            ],
            filter: {
              slug: { _eq: slug },
              status: { _eq: 'published' }
            },
            limit: 1
          })
        );
        
        if (articles && articles.length > 0) {
          console.log('Article trouvé par slug (avec relations):', articles[0]);
          return articles[0];
        }
      } catch (relationError) {
        console.warn('Erreur lors de la récupération avec relations, tentative de fallback:', relationError);
      }
      
      // Tentative 2 : Fallback sans relations
      const articles = await directus.request(
        readItems('articles', {
          fields: [
            'id', 'title', 'slug', 'excerpt', 'content', 'featured_image', 
            'category', 'author', 'published_date', 'reading_time', 'views', 'status'
          ],
          filter: {
            slug: { _eq: slug },
            status: { _eq: 'published' }
          },
          limit: 1
        })
      );
      
      if (articles && articles.length > 0) {
        console.log('Article trouvé par slug (sans relations):', articles[0]);
        return articles[0];
      }
      
      // Tentative 3 : Utiliser fetch API directement
      try {
        console.log('Tentative avec fetch API directement');
        const directusUrl = import.meta.env.VITE_DIRECTUS_URL || 'http://localhost:8055';
        const response = await fetch(`${directusUrl}/items/articles?filter[slug][_eq]=${encodeURIComponent(slug)}&limit=1`);
        
        if (response.ok) {
          const data = await response.json();
          if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
            console.log('Article trouvé par fetch direct:', data.data[0]);
            return data.data[0];
          }
        } else {
          console.warn('Échec de la requête fetch:', response.status);
        }
      } catch (fetchError) {
        console.error('Erreur lors de la récupération via fetch:', fetchError);
      }
      
      return null;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'article par slug:', error);
      throw error;
    }
  }

  // Récupérer les articles par catégorie
  static async getArticlesByCategory(categorySlug: string) {
    try {
      const articles = await directus.request(
        readItems('articles', {
          fields: [
            '*',
            { 
              category: ['name', 'slug', 'color'],
              author: ['first_name', 'last_name', 'avatar']
            }
          ],
          filter: {
            status: { _eq: 'published' },
            'category.slug': { _eq: categorySlug }
          },
          sort: ['-published_date']
        })
      );
      return articles;
    } catch (error) {
      console.error('Erreur lors de la récupération des articles par catégorie:', error);
      throw error;
    }
  }

  // Créer un nouvel article
  static async createArticle(article: Partial<Article>) {
    try {
      const newArticle = await directus.request(
        createItem('articles', article)
      );
      return newArticle;
    } catch (error) {
      console.error('Erreur lors de la création de l\'article:', error);
      throw error;
    }
  }

  // Mettre à jour un article
  static async updateArticle(id: string, article: Partial<Article>) {
    try {
      const updatedArticle = await directus.request(
        updateItem('articles', id, article)
      );
      return updatedArticle;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'article:', error);
      throw error;
    }
  }

  // Supprimer un article
  static async deleteArticle(id: string) {
    try {
      await directus.request(deleteItem('articles', id));
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'article:', error);
      throw error;
    }
  }

  // Incrémenter les vues
  static async incrementViews(id: string) {
    try {
      const article = await this.getArticleById(id);
      const views = (article.views || 0) + 1;
      await this.updateArticle(id, { views });
      return views;
    } catch (error) {
      console.error('Erreur lors de l\'incrémentation des vues:', error);
      throw error;
    }
  }
  
  // Récupérer les tags d'un article spécifique
  static async getArticleTags(articleId: string) {
    try {
      console.log('Récupération des tags pour l\'article:', articleId);
      const relations = await directus.request(
        readItems('articles_tags', {
          filter: {
            article_id: { _eq: articleId }
          }
        })
      );
      
      if (!relations || relations.length === 0) {
        return [];
      }
      
      // Extraire les IDs des tags
      const tagIds = relations.map((rel: any) => rel.tag_id);
      
      // Récupérer les détails des tags
      const tags = await directus.request(
        readItems('tags', {
          filter: {
            id: { _in: tagIds }
          }
        })
      );
      
      return tags;
    } catch (error) {
      console.error('Erreur lors de la récupération des tags de l\'article:', error);
      return [];
    }
  }
}

// Services pour les catégories
export class CategoryService {
  static async getAllCategories() {
    try {
      const categories = await directus.request(
        readItems('categories', {
          filter: { status: { _eq: 'published' } },
          sort: ['sort', 'name']
        })
      );
      return categories;
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
      throw error;
    }
  }

  static async getCategoryBySlug(slug: string) {
    try {
      const categories = await directus.request(
        readItems('categories', {
          filter: {
            slug: { _eq: slug },
            status: { _eq: 'published' }
          },
          limit: 1
        })
      );
      return categories[0] || null;
    } catch (error) {
      console.error('Erreur lors de la récupération de la catégorie:', error);
      throw error;
    }
  }

  static async createCategory(data: Partial<Category>) {
    try {
      const newCategory = await directus.request(
        createItem('categories', data)
      );
      return newCategory;
    } catch (error) {
      console.error('Erreur lors de la création de la catégorie:', error);
      throw error;
    }
  }

  static async updateCategory(id: string, data: Partial<Category>) {
    try {
      const updatedCategory = await directus.request(
        updateItem('categories', id, data)
      );
      return updatedCategory;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la catégorie:', error);
      throw error;
    }
  }

  static async deleteCategory(id: string) {
    try {
      await directus.request(deleteItem('categories', id));
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de la catégorie:', error);
      throw error;
    }
  }
}

// Services pour les tags
export class TagService {
  static async getAllTags() {
    try {
      const tags = await directus.request(
        readItems('tags', {
          sort: ['name']
        })
      );
      return tags;
    } catch (error) {
      console.error('Erreur lors de la récupération des tags:', error);
      throw error;
    }
  }

  static async getTagBySlug(slug: string) {
    try {
      const tags = await directus.request(
        readItems('tags', {
          filter: {
            slug: { _eq: slug }
          },
          limit: 1
        })
      );
      return tags[0] || null;
    } catch (error) {
      console.error('Erreur lors de la récupération du tag:', error);
      throw error;
    }
  }

  static async createTag(data: Partial<Tag>) {
    try {
      const newTag = await directus.request(
        createItem('tags', data)
      );
      return newTag;
    } catch (error) {
      console.error('Erreur lors de la création du tag:', error);
      throw error;
    }
  }

  static async updateTag(id: string, data: Partial<Tag>) {
    try {
      const updatedTag = await directus.request(
        updateItem('tags', id, data)
      );
      return updatedTag;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du tag:', error);
      throw error;
    }
  }

  static async deleteTag(id: string) {
    try {
      await directus.request(deleteItem('tags', id));
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression du tag:', error);
      throw error;
    }
  }
  
  static async getArticlesByTag(tagSlug: string) {
    try {
      // Première étape : trouver le tag par son slug
      const tag = await directus.request(
        readItems('tags', {
          filter: { slug: { _eq: tagSlug } },
          limit: 1
        })
      );

      if (!tag || tag.length === 0) {
        return [];
      }

      const tagId = tag[0].id;

      // Deuxième étape : trouver les relations articles_tags
      const relations = await directus.request(
        readItems('articles_tags', {
          filter: { tag_id: { _eq: tagId } }
        })
      );

      if (!relations || relations.length === 0) {
        return [];
      }

      // Troisième étape : récupérer les articles
      const articleIds = relations.map((rel: any) => rel.article_id);
      
      const articles = await directus.request(
        readItems('articles', {
          fields: [
            'id', 'title', 'slug', 'excerpt', 'content', 'featured_image', 
            'category', 'author', 'published_date', 'reading_time', 'views', 'status'
          ],
          filter: {
            status: { _eq: 'published' },
            id: { _in: articleIds }
          },
          sort: ['-published_date']
        })
      );
      
      return articles;
    } catch (error) {
      console.error('Erreur lors de la récupération des articles par tag:', error);
      throw error;
    }
  }
}

// Services pour les auteurs
export class AuthorService {
  static async getAllAuthors() {
    try {
      const authors = await directus.request(
        readItems('authors', {
          filter: { status: { _eq: 'published' } }
        })
      );
      return authors;
    } catch (error) {
      console.error('Erreur lors de la récupération des auteurs:', error);
      throw error;
    }
  }

  static async createAuthor(data: Partial<Author>) {
    try {
      const newAuthor = await directus.request(
        createItem('authors', data)
      );
      return newAuthor;
    } catch (error) {
      console.error('Erreur lors de la création de l\'auteur:', error);
      throw error;
    }
  }

  static async updateAuthor(id: string, data: Partial<Author>) {
    try {
      const updatedAuthor = await directus.request(
        updateItem('authors', id, data)
      );
      return updatedAuthor;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'auteur:', error);
      throw error;
    }
  }

  static async deleteAuthor(id: string) {
    try {
      await directus.request(deleteItem('authors', id));
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'auteur:', error);
      throw error;
    }
  }
}

/**
 * Utilitaire pour extraire l'ID d'image à partir du champ featured_image
 * qui peut être soit un string (ID directement), soit un objet {id: string},
 * soit un objet DirectusFile complet
 */
export function getImageIdFromArticle(featured_image: string | { id: string } | DirectusFile | undefined): string | undefined {
  console.log('getImageIdFromArticle appelé avec:', JSON.stringify(featured_image));
  
  if (!featured_image) {
    console.log('featured_image est undefined ou null');
    return undefined;
  }
  
  if (typeof featured_image === 'string') {
    console.log('featured_image est une chaîne:', featured_image);
    return featured_image;
  } else if (typeof featured_image === 'object' && featured_image !== null) {
    if ('id' in featured_image) {
      console.log('featured_image est un objet avec id:', featured_image.id);
      return featured_image.id;
    }
  }
  
  console.log('featured_image a un format non reconnu:', typeof featured_image);
  return undefined;
}

/**
 * Utilitaire pour construire l'URL d'une image à partir de l'ID de l'image
 */
export function getImageUrlFromId(imageId: string | undefined): string {
  if (!imageId) return '';
  
  const directusUrl = import.meta.env.VITE_DIRECTUS_URL || 'http://localhost:8055';
  const cacheBreaker = new Date().getTime();
  return `${directusUrl}/assets/${imageId}?width=400&height=200&fit=cover&quality=80&v=${cacheBreaker}`;
}

export default directus;
