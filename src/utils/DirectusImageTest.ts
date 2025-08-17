// DirectusImageTest.ts
// Fichier de test pour la gestion des images Directus

import { getImageIdFromArticle, getImageUrlFromId } from '@/plugins/directus';

/**
 * Tests des différentes configurations possibles du champ featured_image
 */
export function testImageHandling() {
  console.log('=== Test de gestion des images Directus ===');
  
  // Cas 1: featured_image est une chaîne (ID)
  const article1 = {
    id: '123',
    title: 'Test Article 1',
    featured_image: 'a559be3c-453e-4e6a-afe1-ddf2350ca270'
  };
  
  // Cas 2: featured_image est un objet avec ID
  const article2 = {
    id: '456',
    title: 'Test Article 2',
    featured_image: { id: 'fc6d8e55-9bca-495b-b718-23587e0263af' }
  };
  
  // Cas 3: featured_image est undefined
  const article3 = {
    id: '789',
    title: 'Test Article 3',
    featured_image: undefined
  };
  
  // Cas 4: featured_image est null
  const article4 = {
    id: '101112',
    title: 'Test Article 4',
    featured_image: null as any
  };
  
  // Cas 5: featured_image est un objet DirectusFile complet
  const article5 = {
    id: '131415',
    title: 'Test Article 5',
    featured_image: {
      id: 'a559be3c-453e-4e6a-afe1-ddf2350ca270',
      storage: 'local',
      filename_disk: 'a559be3c-453e-4e6a-afe1-ddf2350ca270.png',
      filename_download: 'image.png',
      title: 'Mon image',
      type: 'image/png',
      filesize: 12345,
      width: 800,
      height: 600
    }
  };
  
  console.log('\nTest 1: featured_image est une chaîne');
  const imageId1 = getImageIdFromArticle(article1.featured_image);
  console.log('ID d\'image extrait:', imageId1);
  const imageUrl1 = getImageUrlFromId(imageId1);
  console.log('URL d\'image générée:', imageUrl1);
  
  console.log('\nTest 2: featured_image est un objet avec ID');
  const imageId2 = getImageIdFromArticle(article2.featured_image);
  console.log('ID d\'image extrait:', imageId2);
  const imageUrl2 = getImageUrlFromId(imageId2);
  console.log('URL d\'image générée:', imageUrl2);
  
  console.log('\nTest 3: featured_image est undefined');
  const imageId3 = getImageIdFromArticle(article3.featured_image);
  console.log('ID d\'image extrait:', imageId3);
  const imageUrl3 = getImageUrlFromId(imageId3);
  console.log('URL d\'image générée:', imageUrl3);
  
  console.log('\nTest 4: featured_image est null');
  const imageId4 = getImageIdFromArticle(article4.featured_image);
  console.log('ID d\'image extrait:', imageId4);
  const imageUrl4 = getImageUrlFromId(imageId4);
  console.log('URL d\'image générée:', imageUrl4);
  
  console.log('\nTest 5: featured_image est un objet DirectusFile complet');
  const imageId5 = getImageIdFromArticle(article5.featured_image);
  console.log('ID d\'image extrait:', imageId5);
  const imageUrl5 = getImageUrlFromId(imageId5);
  console.log('URL d\'image générée:', imageUrl5);
  
  console.log('\n=== Fin des tests ===');
}

// Exporter une fonction pour appeler le test depuis l'application
export function runImageTests() {
  testImageHandling();
}

export default { runImageTests };
