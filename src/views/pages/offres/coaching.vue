<template>
  <v-app>
    <NavBars v-model:drawer="drawer" />
    
    <v-navigation-drawer v-model="drawer" temporary app location="right" width="300">
      <!-- Mobile menu content -->
    </v-navigation-drawer>

    <v-main>
      <HeroSection>
        <v-container class="nav-container">
          <v-row align="center" justify="center">
            <v-col cols="12" md="8" class="text-center">
              <h1 class="text-h2 font-weight-bold mb-6">
                <span class="text-accent-hero">Articles</span>
                <span class="text-primary-hero">RH</span>
              </h1>
              <p class="text-subtitle-1 font-weight-regular text-grey-darken-1 mb-8">
                Découvrez nos derniers articles sur les ressources humaines
              </p>
            </v-col>
          </v-row>
        </v-container>
      </HeroSection>

      <!-- Contenu spécifique aux articles -->
      <section class="py-16">
        <v-container>
          <!-- Liste des articles -->
        </v-container>
      </section>

      <FooterSection />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import NavBars from '@/components/NavBars.vue';
import HeroSection from '@/components/HeroSection.vue';
import FooterSection from '@/components/FooterSection.vue';

const drawer = ref(false);
</script>