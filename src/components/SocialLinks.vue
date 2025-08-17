<template>
  <div class="d-flex align-center">
    <span class="text-supnav mr-4">Réseaux sociaux :</span>
    <v-btn 
      v-for="(platform, key) in platforms" 
      :key="key" 
      density="comfortable" 
      variant="text" 
      icon
      size="small" 
      class="mx-1 social-link" 
      :aria-label="`Partager sur ${platform.label}`"
      @click.prevent="handleShare(key)"
    >
<!--       <component 
        :is="platform.icon" 
        :icon="platform.iconName" 
        color="grey-darken-1"
        class="custom-fa-icon" 
        size="small" 
      /> -->
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
// import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
// import { library } from "@fortawesome/fontawesome-svg-core";
/* import {
  faFacebookF,
  faXTwitter,
  faTiktok,
  faInstagram
} from "@fortawesome/free-brands-svg-icons"; */

// Ajout des icônes à la bibliothèque Font Awesome
/* library.add(faFacebookF, faXTwitter, faTiktok, faInstagram); */

// Contenu à partager par défaut
const defaultContent = {
  url: window.location.href,
  title: "MCRH Conseil - Travailler autrement, ensemble, avec sens, exigence et équilibre",
  description: "MCRH accompagne les DRH, les managers et leurs équipes dans leurs transformations pour un travail qui a du sens."
};

// Configuration des plateformes de partage
const platforms = computed(() => ({
  facebook: {
    // icon: FontAwesomeIcon,
    iconName: ["fab", "facebook-f"],
    label: "Facebook",
    getUrl: () =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(defaultContent.url)}&quote=${encodeURIComponent(defaultContent.title)}`,
  },
  twitter: {
    // icon: FontAwesomeIcon,
    iconName: ["fab", "x-twitter"],
    label: "X (Twitter)",
    getUrl: () =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(defaultContent.title)}&url=${encodeURIComponent(defaultContent.url)}`,
  },
  tiktok: {
    // icon: FontAwesomeIcon,
    iconName: ["fab", "tiktok"],
    label: "TikTok",
    getUrl: () =>
      `https://www.tiktok.com/share?url=${encodeURIComponent(defaultContent.url)}&title=${encodeURIComponent(defaultContent.title)}`,
  },
  instagram: {
    // icon: FontAwesomeIcon,
    iconName: ["fab", "instagram"],
    label: "Instagram",
    getUrl: () =>
      `https://www.instagram.com/?url=${encodeURIComponent(defaultContent.url)}`,
  },
}));

// Gérer le partage
const handleShare = (key: string) => {
  const platform = platforms.value[key as keyof typeof platforms.value];
  if (platform) {
    window.open(platform.getUrl(), '_blank');
  }
};
</script>

<style scoped>
.text-supnav {
  font-size: 14px;
}

.social-link {
  transition: transform 0.3s ease;
  color: rgb(var(--v-theme-accent)) !important;
  border: 1px solid #F2F4F6;
  background-color: #F2F4F6;
  padding: 16px;
  display: flex;
  align-items: center;
  border-radius: 8px;
}

.social-link:hover {
  transform: translateY(-3px);
}

.custom-fa-icon {
  font-size: 1.2rem;
}
</style>