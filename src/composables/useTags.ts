import { ref, computed } from 'vue';
import type { Ref } from 'vue';
import { TagService, type Tag, type Article } from '@/plugins/directus';
import { useNotification } from '@/composables/useNotification';

export function useTags() {
  const { showError } = useNotification();
  
  // État réactif
  const tags: Ref<Tag[]> = ref([]);
  const currentTag: Ref<Tag | null> = ref(null);
  const taggedArticles: Ref<Article[]> = ref([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  
  // Charger tous les tags
  const fetchTags = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      console.log('Chargement des tags...');
      const fetchedTags = await TagService.getAllTags();
      tags.value = fetchedTags;
      console.log('Tags chargés:', tags.value);
      return fetchedTags;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des tags';
      error.value = errorMessage;
      showError(errorMessage);
      return [];
    } finally {
      loading.value = false;
    }
  };
  
  // Charger un tag par slug
  const fetchTagBySlug = async (slug: string) => {
    loading.value = true;
    error.value = null;
    
    try {
      console.log('Chargement du tag avec slug:', slug);
      const tag = await TagService.getTagBySlug(slug);
      if (tag) {
        currentTag.value = tag;
        console.log('Tag chargé:', currentTag.value);
      }
      return tag;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement du tag';
      error.value = errorMessage;
      showError(errorMessage);
      return null;
    } finally {
      loading.value = false;
    }
  };
  
  // Charger des articles par tag
  const fetchArticlesByTag = async (slug: string) => {
    loading.value = true;
    error.value = null;
    
    try {
      console.log('Chargement des articles avec tag:', slug);
      const articles = await TagService.getArticlesByTag(slug);
      taggedArticles.value = articles;
      console.log('Articles avec tag chargés:', taggedArticles.value);
      return articles;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des articles par tag';
      error.value = errorMessage;
      showError(errorMessage);
      return [];
    } finally {
      loading.value = false;
    }
  };
  
  // Créer un nouveau tag
  const createTag = async (tag: Partial<Tag>) => {
    loading.value = true;
    error.value = null;
    
    try {
      const newTag = await TagService.createTag(tag);
      tags.value.push(newTag);
      return newTag;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création du tag';
      error.value = errorMessage;
      showError(errorMessage);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  // Mettre à jour un tag
  const updateTag = async (id: string, tag: Partial<Tag>) => {
    loading.value = true;
    error.value = null;
    
    try {
      const updatedTag = await TagService.updateTag(id, tag);
      const index = tags.value.findIndex(t => t.id === id);
      if (index !== -1) {
        tags.value[index] = { ...tags.value[index], ...updatedTag };
      }
      return updatedTag;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour du tag';
      error.value = errorMessage;
      showError(errorMessage);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  // Supprimer un tag
  const deleteTag = async (id: string) => {
    loading.value = true;
    error.value = null;
    
    try {
      await TagService.deleteTag(id);
      tags.value = tags.value.filter(t => t.id !== id);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression du tag';
      error.value = errorMessage;
      showError(errorMessage);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  // Générer un slug à partir du nom du tag
  const generateTagSlug = (name: string): string => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
      .replace(/[^a-z0-9\s-]/g, '') // Supprimer les caractères spéciaux
      .replace(/\s+/g, '-') // Remplacer les espaces par des tirets
      .replace(/-+/g, '-') // Supprimer les tirets multiples
      .trim();
  };
  
  return {
    tags,
    currentTag,
    taggedArticles,
    loading,
    error,
    fetchTags,
    fetchTagBySlug,
    fetchArticlesByTag,
    createTag,
    updateTag,
    deleteTag,
    generateTagSlug
  };
}
