import { ref, computed } from 'vue';
import type { Ref } from 'vue';
import { ArticleService, CategoryService, type Article, type Category } from '@/plugins/directus';
import { useNotification } from '@/composables/useNotification';

export interface ArticleFilters {
  category?: string;
  tag?: string;
  author?: string;
  search?: string;
  featured?: boolean;
  limit?: number;
  page?: number;
  seo_title?: string;
  seo_description?: string;
}

export function useArticles() {
  const { showError, showSuccess } = useNotification();
  
  // État réactif
  const articles: Ref<Article[]> = ref([]);
  const currentArticle: Ref<Article | null> = ref(null);
  const categories: Ref<Category[]> = ref([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  
  // Pagination
  const currentPage = ref(1);
  const totalPages = ref(1);
  const itemsPerPage = ref(12);
  const totalItems = ref(0);

  // Filtres
  const filters = ref<ArticleFilters>({});

  // Articles paginés
  const paginatedArticles = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return articles.value.slice(start, end);
  });

  // Articles filtrés
  const filteredArticles = computed(() => {
    let filtered = [...articles.value];

    // Filtre par catégorie
    if (filters.value.category) {
      filtered = filtered.filter(article => 
        typeof article.category === 'object' ? 
        article.category?.slug === filters.value.category :
        article.category === filters.value.category
      );
    }

    // Filtre par recherche
    if (filters.value.search) {
      const searchTerm = filters.value.search.toLowerCase();
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm) ||
        article.excerpt?.toLowerCase().includes(searchTerm) ||
        article.content.toLowerCase().includes(searchTerm)
      );
    }

    // Filtre par articles mis en avant
    if (filters.value.featured !== undefined) {
      filtered = filtered.filter(article => article.is_featured === filters.value.featured);
    }
    
    // Filtre par tag
    if (filters.value.tag) {
      // Nous devons récupérer les tags via ArticleService.getArticleTags pour chaque article
      // Cette approche est simplifiée et moins optimisée pour l'instant
      // Dans un environnement production, il faudrait pré-charger les tags ou utiliser une autre approche
      console.log('Filtrage par tag désactivé - les tags doivent être récupérés via ArticleService.getArticleTags');
    }

    return filtered;
  });

  // Articles par catégorie
  const articlesByCategory = computed(() => {
    const grouped: Record<string, Article[]> = {};
    articles.value.forEach(article => {
      const categoryName = typeof article.category === 'object' ? 
        article.category?.name || 'Sans catégorie' : 
        'Sans catégorie';
      
      if (!grouped[categoryName]) {
        grouped[categoryName] = [];
      }
      grouped[categoryName].push(article);
    });
    return grouped;
  });

  // Articles récents
  const recentArticles = computed(() => {
    return [...articles.value]
      .sort((a, b) => new Date(b.published_date || b.date_created || '').getTime() - 
                      new Date(a.published_date || a.date_created || '').getTime())
      .slice(0, 5);
  });

  // Articles populaires (basés sur les vues)
  const popularArticles = computed(() => {
    return [...articles.value]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 5);
  });

  // Articles mis en avant
  const featuredArticles = computed(() => {
    return articles.value.filter(article => article.is_featured);
  });

  // Fonctions
  
  // Charger tous les articles
  const fetchArticles = async (customFilters?: ArticleFilters) => {
    loading.value = true;
    error.value = null;
    
    try {
      console.log('Chargement des articles avec filtres:', customFilters);
      console.log('URL Directus:', import.meta.env.VITE_DIRECTUS_URL || 'http://localhost:8055');
      
      // S'assurer que le filtre de statut est toujours présent et a priorité
      const directusFilters: any = {
        // Forcer le statut published
        status: { _eq: 'published' }
      };
      
      // Simplifier les filtres - ne pas utiliser de relations
      if (customFilters?.featured !== undefined) {
        directusFilters.is_featured = { _eq: customFilters.featured };
      }

      console.log('Avant appel API - Tentative de récupération des articles');
      
      try {
        const fetchedArticles = await ArticleService.getAllArticles(directusFilters);
        console.log('Articles récupérés depuis l\'API:', fetchedArticles);
        
        // Vérifier si on a des données
        if (fetchedArticles && Array.isArray(fetchedArticles) && fetchedArticles.length > 0) {
          console.log('Premier article - featured_image:', fetchedArticles[0].featured_image);
          
          // Traitement des articles
          // Filtrer pour ne garder que les articles publiés
          const publishedArticles = fetchedArticles.filter(article => article.status === 'published');
          
          console.log('Total des articles récupérés:', fetchedArticles.length);
          console.log('Articles publiés après filtrage:', publishedArticles.length);
          
          articles.value = publishedArticles.map(article => ({
            ...article,
            // Le champ image est déjà défini dans le service
            // Assurer que les champs nécessaires existent
            excerpt: article.excerpt || '',
            reading_time: article.reading_time || 5,
            views: article.views || 0,
            is_featured: article.is_featured || false,
            published_date: article.published_date || article.date_created
          }));
          // Debug: afficher le slug de catégorie pour chaque article
          console.log('Debug Articles catégories:', articles.value.map(a => ({ title: a.title, slug: typeof a.category === 'object' ? a.category?.slug : a.category })));
          
          totalItems.value = publishedArticles.length;
          totalPages.value = Math.ceil(totalItems.value / itemsPerPage.value);
          
          console.log('Articles traités:', articles.value.length, 'articles');
          return articles.value;
        } else {
          console.log('Aucun article récupéré ou tableau vide');
          articles.value = [];
          totalItems.value = 0;
          totalPages.value = 0;
          return [];
        }
      } catch (apiError) {
        console.error('Erreur lors de l\'appel API:', apiError);
        throw apiError;
      }
    } catch (err) {
      console.error('Erreur détaillée:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des articles';
      error.value = errorMessage;
      showError(errorMessage);
      
      // Fallback : essayer une requête directe
      try {
        console.log('Tentative de récupération directe via fetch');
        const directusUrl = import.meta.env.VITE_DIRECTUS_URL || 'http://localhost:8055';
        
        // Authentification
        const authResponse = await fetch(`${directusUrl}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'admin@mcrh.com',
            password: '123456'
          })
        });
        
        if (authResponse.ok) {
          const authData = await authResponse.json();
          const token = authData.data?.access_token;
          
          if (token) {
            const articlesResponse = await fetch(`${directusUrl}/items/articles?fields=id,title,slug,excerpt,content,featured_image,cover,category,author,published_date,reading_time,views,status&filter[status][_eq]=published`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
            
            if (articlesResponse.ok) {
              const articlesData = await articlesResponse.json();
              console.log('Articles récupérés via fetch direct:', articlesData);
              
              if (articlesData.data && Array.isArray(articlesData.data)) {
                // Filtrer pour ne garder que les articles publiés
                const publishedArticles = articlesData.data.filter((article: any) => article.status === 'published');
                
                console.log('Total des articles récupérés via fetch:', articlesData.data.length);
                console.log('Articles publiés après filtrage:', publishedArticles.length);
                
                articles.value = publishedArticles.map((article: any) => ({
                  ...article,
                  // Le champ image est déjà défini dans le service
                  excerpt: article.excerpt || '',
                  reading_time: article.reading_time || 5,
                  views: article.views || 0,
                  is_featured: article.is_featured || false,
                  published_date: article.published_date || article.date_created
                }));
                totalItems.value = articles.value.length;
                totalPages.value = Math.ceil(totalItems.value / itemsPerPage.value);
                error.value = null;
                return articles.value;
              }
            }
          }
        }
      } catch (fetchError) {
        console.error('Erreur fetch direct:', fetchError);
      }
      
      return [];
    } finally {
      loading.value = false;
    }
  };

  // Charger un article par slug
  const fetchArticleBySlug = async (slug: string) => {
    loading.value = true;
    error.value = null;
    
    try {
      console.log('Chargement de l\'article avec slug:', slug);
      
      // Méthode 1: Utiliser le service ArticleService
      try {
        // S'assurer de ne récupérer que les articles publiés
        const article = await ArticleService.getArticleBySlug(slug);
        if (article) {
          // Vérifier que l'article est bien publié
          if (article.status === 'published') {
            console.log('Article trouvé via ArticleService:', article);
            // Le champ image est déjà défini dans le service
            currentArticle.value = article;
          
            // Incrémenter les vues
            try {
              if (article.id) {
                await ArticleService.incrementViews(article.id);
              }
            } catch (viewError) {
              console.warn('Impossible d\'incrémenter les vues:', viewError);
              // Ne pas bloquer le processus si l'incrémentation des vues échoue
            }
          
            console.log('Article chargé par slug:', currentArticle.value);
            return article;
          } else {
            console.warn('Aucun article trouvé pour le slug:', slug);
          }
        }
      } catch (serviceError) {
        console.error('Erreur avec ArticleService:', serviceError);
        // Continuer avec les méthodes alternatives
      }
      
      // Méthode 2: Essayer de trouver l'article dans les articles déjà chargés
      if (articles.value.length > 0) {
        console.log('Tentative de trouver l\'article dans les articles déjà chargés');
        const foundArticle = articles.value.find(a => a.slug === slug);
        if (foundArticle) {
          console.log('Article trouvé dans les articles existants:', foundArticle);
          currentArticle.value = foundArticle;
          return foundArticle;
        }
      } else {
        // Si les articles n'ont pas été chargés, essayons de les charger
        console.log('Chargement des articles pour trouver celui correspondant au slug');
        await fetchArticles();
        
        const foundArticle = articles.value.find(a => a.slug === slug);
        if (foundArticle) {
          console.log('Article trouvé après chargement des articles:', foundArticle);
          currentArticle.value = foundArticle;
          return foundArticle;
        }
      }
      
      // Méthode 3: Fallback - requête directe via fetch
      try {
        console.log('Tentative de récupération directe via fetch');
        const directusUrl = import.meta.env.VITE_DIRECTUS_URL || 'http://localhost:8055';
        
        // Authentification si nécessaire
        let token = '';
        
        try {
          const authResponse = await fetch(`${directusUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: 'admin@mcrh.com',
              password: '123456'
            })
          });
          
          if (authResponse.ok) {
            const authData = await authResponse.json();
            token = authData.data?.access_token;
          }
        } catch (authError) {
          console.warn('Erreur d\'authentification, tentative sans token:', authError);
        }
        
        // Headers avec ou sans token
        const headers: HeadersInit = {
          'Content-Type': 'application/json'
        };
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        // Récupération de l'article
        const articleResponse = await fetch(`${directusUrl}/items/articles?filter[slug][_eq]=${encodeURIComponent(slug)}&limit=1`, {
          headers
        });
        
        if (articleResponse.ok) {
          const articleData = await articleResponse.json();
          console.log('Article récupéré via fetch direct:', articleData);
          
          if (articleData.data && Array.isArray(articleData.data) && articleData.data.length > 0) {
            const article = articleData.data[0];
            currentArticle.value = article;
            return article;
          }
        } else {
          console.error('Erreur de réponse API:', articleResponse.status, await articleResponse.text());
        }
      } catch (fetchError) {
        console.error('Erreur fetch direct pour l\'article:', fetchError);
      }
      
      throw new Error(`Article introuvable avec le slug: ${slug}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement de l\'article';
      error.value = errorMessage;
      showError(errorMessage);
      console.error('Erreur complète:', err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // Charger un article par ID
  const fetchArticleById = async (id: string) => {
    loading.value = true;
    error.value = null;
    
    try {
      console.log('Chargement de l\'article avec ID:', id);
      const article = await ArticleService.getArticleById(id);
      // Le champ image est déjà défini dans le service
      currentArticle.value = article;
      console.log('Article chargé par ID:', currentArticle.value);
      return article;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement de l\'article';
      error.value = errorMessage;
      showError(errorMessage);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // Charger les catégories
  const fetchCategories = async () => {
    try {
      console.log('Chargement des catégories...');
      const fetchedCategories = await CategoryService.getAllCategories();
      
      if (fetchedCategories && Array.isArray(fetchedCategories)) {
        categories.value = fetchedCategories;
        // Debug: afficher les slugs des catégories chargées
        console.log('Debug Categories:', categories.value.map(c => ({ name: c.name, slug: c.slug })));        
        console.log('Catégories chargées:', categories.value.length);
        return fetchedCategories;
      } else {
        console.log('Aucune catégorie récupérée');
        categories.value = [];
        return [];
      }
    } catch (err) {
      console.error('Erreur lors du chargement des catégories:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des catégories';
      showError(errorMessage);
      
      // Fallback : essayer une requête directe pour les catégories
      try {
        const directusUrl = import.meta.env.VITE_DIRECTUS_URL || 'http://localhost:8055';
        
        // Authentification
        const authResponse = await fetch(`${directusUrl}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'admin@mcrh.com',
            password: '123456'
          })
        });
        
        if (authResponse.ok) {
          const authData = await authResponse.json();
          const token = authData.data?.access_token;
          
          if (token) {
            const categoriesResponse = await fetch(`${directusUrl}/items/categories?fields=id,name,slug,description,color&filter[status][_eq]=published`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
            
            if (categoriesResponse.ok) {
              const categoriesData = await categoriesResponse.json();
              console.log('Catégories récupérées via fetch direct:', categoriesData);
              
              if (categoriesData.data && Array.isArray(categoriesData.data)) {
                categories.value = categoriesData.data;
                return categories.value;
              }
            }
          }
        }
      } catch (fetchError) {
        console.error('Erreur fetch direct pour les catégories:', fetchError);
      }
      
      return [];
    }
  };

  // Appliquer des filtres
  const applyFilters = (newFilters: ArticleFilters) => {
    filters.value = { ...filters.value, ...newFilters };
    currentPage.value = 1; // Reset à la première page
  };

  // Réinitialiser les filtres
  const resetFilters = () => {
    filters.value = {};
    currentPage.value = 1;
  };

  // Changer de page
  const setPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
    }
  };

  // Rechercher des articles
  const searchArticles = async (searchTerm: string) => {
    filters.value.search = searchTerm;
    currentPage.value = 1;
  };

  // Obtenir les articles d'une catégorie
  const getArticlesByCategory = async (categorySlug: string) => {
    loading.value = true;
    try {
      const categoryArticles = await ArticleService.getArticlesByCategory(categorySlug);
      return categoryArticles;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des articles de la catégorie';
      showError(errorMessage);
      return [];
    } finally {
      loading.value = false;
    }
  };

  // Générer le slug à partir du titre
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
      .replace(/[^a-z0-9\s-]/g, '') // Supprimer les caractères spéciaux
      .replace(/\s+/g, '-') // Remplacer les espaces par des tirets
      .replace(/-+/g, '-') // Supprimer les tirets multiples
      .trim();
  };

  // Calculer le temps de lecture
  const calculateReadingTime = (content: string): number => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  // Formater la date de publication
  const formatPublishedDate = (date: string | undefined): string => {
    if (!date) return '';
    
    const publishedDate = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - publishedDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    if (diffDays < 30) return `Il y a ${Math.ceil(diffDays / 7)} semaines`;
    
    return publishedDate.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return {
    // État
    articles,
    currentArticle,
    categories,
    loading,
    error,
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    filters,
    
    // Computed
    paginatedArticles,
    filteredArticles,
    articlesByCategory,
    recentArticles,
    popularArticles,
    featuredArticles,
    
    // Fonctions
    fetchArticles,
    fetchArticleBySlug,
    fetchArticleById,
    fetchCategories,
    applyFilters,
    resetFilters,
    setPage,
    searchArticles,
    getArticlesByCategory,
    generateSlug,
    calculateReadingTime,
    formatPublishedDate
  };
}
