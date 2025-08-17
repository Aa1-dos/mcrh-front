<template>
  <div class="debug-panel">
    <h3>Panneau de débogage des images</h3>
    <v-btn color="primary" @click="runTests">
      Tester le traitement des images
    </v-btn>
    <div v-if="results.length > 0" class="mt-4">
      <h4>Résultats des tests:</h4>
      <pre>{{ results.join('\n') }}</pre>
    </div>
    
    <div class="mt-4">
      <h4>Images de test:</h4>
      <div v-for="(image, index) in testImages" :key="index" class="mt-2">
        <div>Type: {{ image.type }}</div>
        <v-img 
          :src="image.url" 
          width="200" 
          height="120"
          cover
          class="mt-1 rounded-lg"
        >
          <template v-slot:placeholder>
            <div class="d-flex align-center justify-center fill-height">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </div>
          </template>
        </v-img>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { runImageTests } from '@/utils/DirectusImageTest';
import { getImageUrlFromId } from '@/plugins/directus';

const results = ref<string[]>([]);
const testImages = ref<{ type: string; url: string }[]>([]);

// Intercepter console.log pour afficher les résultats dans l'interface
const originalConsoleLog = console.log;
console.log = function(...args) {
  originalConsoleLog(...args);
  results.value.push(args.join(' '));
};

const runTests = () => {
  results.value = [];
  runImageTests();
  
  // Ajouter des images de test pour vérifier l'affichage
  testImages.value = [
    {
      type: 'ID direct (string)',
      url: getImageUrlFromId('a559be3c-453e-4e6a-afe1-ddf2350ca270')
    },
    {
      type: 'URL brute sans traitement',
      url: 'http://localhost:8055/assets/a559be3c-453e-4e6a-afe1-ddf2350ca270'
    }
  ];
};

// Rétablir console.log à sa fonction d'origine lorsque le composant est détruit
onMounted(() => {
  return () => {
    console.log = originalConsoleLog;
  };
});
</script>

<style scoped>
.debug-panel {
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin: 1rem;
  background-color: #f5f5f5;
}

pre {
  white-space: pre-wrap;
  background-color: #eee;
  padding: 0.5rem;
  border-radius: 4px;
  max-height: 300px;
  overflow-y: auto;
}
</style>
