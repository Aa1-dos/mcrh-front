<template>
  <div class="breadcrumb-container d-flex align-center">
    <!-- Lien Accueil toujours présent -->
    <router-link :to="{ name: 'Home' }" class="accueil-link">
      Accueil
    </router-link>

    <!-- Flèche de séparation -->
    <v-icon size="small" class="mx-2">mdi-chevron-right</v-icon>
    
    <!-- Titre de la section actuelle -->
    <span class="actuelle-ligne">{{ currentSectionName }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

// Conserver la possibilité d'avoir un breadcrumb personnalisé
interface Props {
  customSectionName?: string;
}

const props = withDefaults(defineProps<Props>(), {
  customSectionName: ''
});

const route = useRoute();

// Dictionnaire simplifié pour les noms de sections
const sectionNameMap: Record<string, string> = {
  'carnet-rh': 'Le carnet RH',
  'articles': 'Le carnet RH',
  'analyses': 'Le carnet RH',
  'a-propos': 'À propos',
  'notre-equipe': 'Notre équipe',
  'contact': 'Contact',
  'ressources': 'Ressources',
  'offres': 'Nos offres',
};

// Détermine le nom de la section actuelle
const currentSectionName = computed(() => {
  // Si un nom personnalisé est fourni, l'utiliser
  if (props.customSectionName) {
    return props.customSectionName;
  }

  // Sinon, extraire le premier segment significatif du chemin
  const pathParts = route.path.split('/').filter(part => part);
  const firstSegment = pathParts[0] || '';
  
  // Retourner le nom correspondant ou le segment lui-même avec la première lettre en majuscule
  return sectionNameMap[firstSegment] || 
    (firstSegment.charAt(0).toUpperCase() + firstSegment.slice(1));
});
</script>

<style scoped>
.breadcrumb-container{
    padding-bottom: 18px;
}
.accueil-link {
  color: rgb(var(--v-theme-primary));
  text-decoration: none;
}
.actuelle-ligne {
  color: rgb(var(--v-theme-accent));
  font-size: 14px;
  font-weight: 600;
}
</style>