<template>
  <section id="hero" class="mb-16 bg-hero">
    <slot>
      <!-- Le contenu par défaut sera remplacé par ce que vous passez dans le slot -->
      <v-container class="nav-container">
        <v-row align="center">
          <v-col cols="12" md="12" class="text-center">
            <div class="first-content">
              <h1 class="text-h2 font-weight-bold mb-6">
                Contenu par défaut
              </h1>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </slot>
  </section>
</template>

<script setup lang="ts">
// Aucune logique particulière n'est nécessaire pour ce composant
</script>

<style scoped>
.bg-hero {
  background-image: url('@/assets/images/backgrounds/bg-hero.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 1% 75%;
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
}

.first-content {
  position: relative;
}

.text-accent-hero {
  color: rgb(var(--v-theme-accent)) !important;
  font-weight: 600 !important;
  font-size: 49px !important;
}

.text-primary-hero {
  color: rgb(var(--v-theme-primary)) !important;
  font-weight: 600 !important;
  font-size: 50px !important;
  display: block;
  white-space: normal !important;
}
</style>