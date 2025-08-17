<template>
  <v-app>
    <NavBars v-model:drawer="drawer" />

    <v-navigation-drawer v-model="drawer" temporary app location="right" width="300">
      <!-- Contenu du menu mobile -->
    </v-navigation-drawer>

    <v-main>
      <HeroSection>
        <!-- Fil d'Ariane -->
        <v-container class="nav-container breadcrumb-container pt-4 pb-0">
          <div class="d-flex align-center">
            <router-link to="/" class="text-body-2 text-grey-darken-1 text-decoration-none">Accueil</router-link>
            <v-icon size="small" class="mx-2 text-grey-darken-1">mdi-chevron-right</v-icon>
            <router-link to="/carnet-rh/articles" class="text-body-2 text-grey-darken-1 text-decoration-none">Le carnet RH</router-link>
            <v-icon size="small" class="mx-2 text-grey-darken-1">mdi-chevron-right</v-icon>
            <span class="text-body-2 text-grey-darken-1">Analyse {{ id }}</span>
          </div>
        </v-container>
      </HeroSection>
      
      <!-- Contenu de l'analyse -->
      <v-container class="py-16">
        <v-row>
          <v-col cols="12" md="8" offset-md="2">
            <h1 class="text-h3 font-weight-bold mb-6">Mémo - CBD/cannabis : la frontière du licite</h1>
            
            <div class="d-flex align-center mb-8">
              <v-avatar size="40" color="grey-lighten-2" class="mr-3">
                <v-img src="@/assets/images/avatars/author.png" alt="Auteur"></v-img>
              </v-avatar>
              <div>
                <div class="text-body-1 font-weight-medium">Marie Laurent</div>
                <div class="text-caption text-grey">Publié le 15 juillet 2025</div>
              </div>
            </div>

            <v-img 
              src="@/assets/images/articles/art-2.png"
              alt="Illustration de l'article" 
              height="400" 
              class="rounded-lg mb-8"
            ></v-img>
            
            <div class="text-body-1 text-grey-darken-3">
              <p class="mb-4">
                CBD, cannabis, test salivaire… Le cas qui nous intéresse : un salarié, consommateur de CBD, peut être positif au test alors même que cette substance est légale. Le sujet est sensible. Le cadre juridique est complexe. 
              </p>
              <p class="mb-4">
                Le CBD (cannabidiol) est une molécule présente dans le cannabis. Contrairement au THC (tétrahydrocannabinol), le CBD n'a pas d'effet psychotrope. Il est légal en France si son taux de THC est inférieur à 0,3%. Cependant, les tests salivaires ne font pas la distinction entre CBD et THC.
              </p>
              <h2 class="text-h5 font-weight-bold my-6">Le cadre juridique en entreprise</h2>
              <p class="mb-4">
                L'employeur a une obligation de sécurité envers ses salariés. Il peut mettre en place des tests de dépistage pour les postes de sécurité ou à risque. Mais ces tests doivent être proportionnés et justifiés.
              </p>
              <p class="mb-4">
                La jurisprudence récente montre que la consommation de CBD légal ne peut justifier un licenciement si elle n'impacte pas la prestation de travail ou la sécurité.
              </p>
              <!-- Plus de contenu... -->
            </div>
          </v-col>
        </v-row>
      </v-container>
      
      <FooterSection />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import NavBars from '@/components/NavBars.vue';
import HeroSection from '@/components/HeroSection.vue';
import FooterSection from '@/components/FooterSection.vue';

const route = useRoute();
const id = ref(route.params.id);
const drawer = ref(false);

// Ici vous pourriez charger les détails de l'analyse en fonction de l'ID
onMounted(() => {
  console.log(`Chargement de l'analyse avec l'ID: ${id.value}`);
  // fetchAnalyseDetails(id.value)
});
</script>

<style scoped>
.breadcrumb-container {
  padding-top: 20px;
  position: relative;
}
</style>