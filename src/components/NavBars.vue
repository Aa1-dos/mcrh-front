<template>
  <!-- Top Bar avec réseaux sociaux -->
  <v-app-bar app flat color="white" class="top-app-bar">
    <v-container class="d-flex align-center pa-0 nav-container">
      <SocialLinks />
      <v-spacer />
      <div class="d-none d-md-flex align-center">
        <img src="@/assets/images/icons/icon1.png" alt="Icône MCRH" height="40" class="" />
        <v-btn variant="text" class="text-supnav" append-icon="mdi-arrow-top-right"
          :to="{ name: 'PortraitsInspirants' }">
          Portraits inspirants
        </v-btn>
        <img src="@/assets/images/icons/icon2.png" alt="Icône MCRH" height="40" class="">
        <v-btn variant="text" class="text-supnav text-capitalize" append-icon="mdi-arrow-top-right"
          :to="{ name: 'LivresPodcastsTED' }">
          Livres, Podcasts, TED Talks
        </v-btn>
      </div>
    </v-container>
  </v-app-bar>

  <!-- Main Navigation Bar -->
  <v-app-bar app flat color="white" height="80" class="main-nav-bar border-b">
    <v-container class="d-flex align-center pa-0 nav-container">
      <!-- Logo -->
      <div class="d-flex align-center">
        <router-link :to="{ name: 'Home', params: { id: 1 } }">
          <img src="@/assets/images/logos/logo.png" alt="MCRH Conseil" height="58" />
        </router-link>
      </div>

      <v-spacer />

      <!-- Desktop Menu -->
      <v-toolbar-items class="d-none d-lg-flex">
        <v-menu :close-on-content-click="false">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" variant="text" class="nav-text text-capitalize" append-icon="mdi-chevron-down">
              MCRH Conseil
            </v-btn>
          </template>
          <!-- card -->
          <v-card class="menu-card" flat>
            <!-- Structure flex pour les éléments -->
            <div class="menu-row">
              <div class="menu-column">
                <!-- Autres classes possibles : rounded, rounded-xl, rounded-0, rounded-pill -->
                <!-- Pour les couleurs : color="primary", color="accent", etc. -->
                <!-- Pour les variantes : variant="text", variant="outlined", variant="flat" -->
                <!-- Pour les tailles : density="comfortable", density="compact" -->
                <v-list-item class="custom-list-item rounded-lg">
                  <!--  :to="{ name: 'APropos' }" title="Qui suis-je ?" -->
                  <div class="d-flex align-center justify-space-between w-100">
                    <div class="menu-text">MCRH Conseil-À propos de nous</div>
                    <v-icon size="small" color="grey">mdi-chevron-right</v-icon>
                  </div>
                </v-list-item>
              </div>

              <div class="menu-column-second">
                <v-list-item class="custom-list-item-second rounded-lg" :to="{ name: 'APropos' }">
                  <div class="d-flex align-center justify-space-between w-100">
                    <div class="menu-text">Qui suis-je ?</div>
                  </div>
                </v-list-item>
                <v-list-item class="custom-list-item-second rounded-lg" :to="{ name: 'NotreEquipe' }">
                  <div class="d-flex align-center justify-space-between w-100">
                    <div class="menu-text">Le regard d'une DRH</div>
                  </div>
                </v-list-item>
              </div>
            </div>
          </v-card>
        </v-menu>

        <!-- Menu Le carnet RH -->

          <v-menu :close-on-content-click="true" offset="0" location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" variant="text" class="nav-text text-capitalize" append-icon="mdi-chevron-down">
               Le carnet RH
            </v-btn>
          </template>
          <v-card class="menu-card" flat>
            <!-- Structure flex pour les éléments -->
            <div class="menu-row">
              <div class="menu-column">
                <v-list-item class="custom-list-item rounded-lg">
                  <div class="d-flex align-center justify-space-between w-100">
                    <div class="menu-text">Le carnet RH-Comprendre & Agir</div>
                    <v-icon size="small" color="grey">mdi-chevron-right</v-icon>
                  </div>
                </v-list-item>
              </div>

              <div class="menu-column-second">
                <v-list-item class="custom-list-item-second rounded-lg" :to="{ name: 'Articles' }">
                  <div class="d-flex align-center justify-space-between w-100">
                    <div class="menu-text">Analyse Rh</div>
                  </div>
                </v-list-item>
                <v-list-item class="custom-list-item-second rounded-lg" ><!-- :to="{ name: 'CarnetRHIndex' }" -->
                  <div class="d-flex align-center justify-space-between w-100">
                    <div class="menu-text">Décryptage de tendances RH</div>
                  </div>
                </v-list-item>
                <v-list-item class="custom-list-item-second rounded-lg" ><!-- :to="{ name: 'AnalyseTendances' }" -->
                  <div class="d-flex align-center justify-space-between w-100">
                    <div class="menu-text">Regards croisés</div>
                  </div>
                </v-list-item>
              </div>
            </div>
          </v-card>
        </v-menu>

        <!-- Menu Nos ressources -->
        <v-menu :close-on-content-click="true" offset="0" location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" variant="text" class="nav-text text-capitalize" append-icon="mdi-chevron-down">
              Nos ressources
            </v-btn>
          </template>
          <v-card class="menu-card" flat>
            <!-- Structure flex pour les éléments -->
            <div class="menu-row">
              <div class="menu-column">
                <v-list-item class="custom-list-item rounded-lg">
                  <div class="d-flex align-center justify-space-between w-100">
                    <div class="menu-text">Inspiration RH</div>
                    <v-icon size="small" color="grey">mdi-chevron-right</v-icon>
                  </div>
                </v-list-item>
                <v-list-item class="custom-list-item-second rounded-lg">
                  <div class="d-flex align-center justify-space-between w-100">
                    <div class="menu-text">La boîte à outils-Pratique & seconds</div>
                  </div>
                </v-list-item>
                <v-list-item class="custom-list-item-second rounded-lg">
                  <div class="d-flex align-center justify-space-between w-100">
                    <div class="menu-text">L'atelier du Mindset</div>
                  </div>
                </v-list-item>
              </div>

              <div class="menu-column-second">
                <v-list-item class="custom-list-item-second rounded-lg" :to="{ name: 'Livres' }">
                  <div class="d-flex align-center justify-space-between w-100">
                    <div class="menu-text">Livres</div>
                  </div>
                </v-list-item>
                <v-list-item class="custom-list-item-second rounded-lg" ><!-- :to="{ name: 'Podcasts' }" -->
                  <div class="d-flex align-center justify-space-between w-100">
                    <div class="menu-text">Podcasts</div>
                  </div>
                </v-list-item>
                <v-list-item class="custom-list-item-second rounded-lg" ><!-- :to="{ name: 'LivresPodcastsTED' }" -->
                  <div class="d-flex align-center justify-space-between w-100">
                    <div class="menu-text">TEDs Talks</div>
                  </div>
                </v-list-item>
                <v-list-item class="custom-list-item-second rounded-lg" ><!-- :to="{ name: 'PortraitsInspirants' }" -->
                  <div class="d-flex align-center justify-space-between w-100">
                    <div class="menu-text">Portraits Inspirants</div>
                  </div>
                </v-list-item>
              </div>
            </div>
          </v-card>
        </v-menu>

        <v-menu :close-on-content-click="true" offset="0" location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" variant="text" class="nav-text text-capitalize" append-icon="mdi-chevron-down">
              Nos offres
            </v-btn>
          </template>
          <v-card class="menu-card" flat>
            <!-- Structure flex pour les éléments -->
            <div class="menu-row">
              <div class="menu-column">
                <v-list-item class="custom-list-item rounded-lg">
                  <div class="d-flex align-center justify-space-between w-100">
                    <div class="menu-text">Nos offres-Agir pour les RH Vivantes</div>
                    <v-icon size="small" color="grey">mdi-chevron-right</v-icon>
                  </div>
                </v-list-item>
              </div>

              <div class="menu-column-second">
                <v-list-item class="custom-list-item-second rounded-lg" :to="{ name: 'Formations' }">
                  <div class="d-flex align-center justify-space-between w-100">
                    <div class="menu-text">Formations</div>
                  </div>
                </v-list-item>
                <v-list-item class="custom-list-item-second rounded-lg" :to="{ name: 'Conseil' }">
                  <div class="d-flex align-center justify-space-between w-100">
                    <div class="menu-text">Ateliers</div>
                  </div>
                </v-list-item>
                <v-list-item class="custom-list-item-second rounded-lg" :to="{ name: 'Coaching' }">
                  <div class="d-flex align-center justify-space-between w-100">
                    <div class="menu-text">interventions & Conférences </div>
                  </div>
                </v-list-item>
              </div>
            </div>
          </v-card>
        </v-menu>

        <v-btn variant="text" class="nav-text text-capitalize" @click="scrollToContact">
          Contact
        </v-btn>
      </v-toolbar-items>

      <v-spacer class="d-none d-lg-flex" />

      <!-- Actions -->
      <div class="d-flex align-center">
        <v-btn icon variant="outlined" color="accent" height="40" width="40" class="padding-0">
          <v-icon class="bg-accent rounded-pill mx-auto d-flex align-center justify-center"
            style="margin: 0 auto;">mdi-magnify</v-icon>
        </v-btn>
        <v-btn class="text-capitalize bg-accent ml-2 rounded-pill bold-800 d-none d-sm-flex" elevation="0">
          Rejoindre la lettre RH & Mindset
        </v-btn>
      </div>
      <!-- Mobile Menu Button -->
      <v-app-bar-nav-icon class="d-lg-none" @click="toggleDrawer" />
    </v-container>
  </v-app-bar>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import SocialLinks from './SocialLinks.vue';

const router = useRouter();
const emit = defineEmits(['update:drawer']);

// Function to toggle the drawer
const toggleDrawer = () => {
  emit('update:drawer', true);
};

// Function to scroll to contact section on homepage
const scrollToContact = async () => {
  // Si déjà sur la page d'accueil
  if (router.currentRoute.value.name === 'Home') {
    // Scroll vers l'élément avec l'id 'contact-section'
    const contactSection = document.getElementById('contact-section');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  } else {
    // Navigue vers la page d'accueil avec le hash pour la section contact
    await router.push({ name: 'Home', hash: '#contact-section' });

    // Attendre que la navigation soit terminée puis scroller
    setTimeout(() => {
      const contactSection = document.getElementById('contact-section');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 500);
  }
};
</script>

<style scoped>
.top-app-bar {
  height: 64px !important;
}

.nav-container {
  max-width: 1440px;
  margin-left: auto;
  margin-right: auto;
  padding-top: 48px;
}

.main-nav-bar {
  background-color: #F2F4F6 !important;
}

.text-supnav {
  font-size: 14px;
}

.nav-text {
  font-size: 14px;
  font-weight: 600;
}

.border-b {
  border-bottom: 1px solid rgb(var(--v-theme-accent)) !important;
}

.v-btn {
  text-transform: none;
  font-weight: 500;
}

.v-btn.rounded-pill {
  border-radius: 50px !important;
}

/* Styles pour les menus déroulants */
.menu-card {
  border-radius: 14px !important;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
}

.menu-row {
  display: flex;
  min-width: 410px;
  height: 200px;
  width: 563px
}

.menu-column {
  flex: 1;
  min-width: 200px;
}

.menu-column-second {
  flex: 1;
  min-width: 200px;
  background-color: rgb(244, 244, 245);
}

.custom-list-item {
  /*  padding: 16px; */
      margin: 8px 8px 0px 8px !important;
  transition: background-color 0.2s;
}

.custom-list-item-second {
  transition: background-color 0.2s;
  margin: 8px 8px 0px 8px;
}

.menu-column-second .custom-list-item-second:not(:first-child) {
  margin-top: 0 !important;
}

/* .custom-list-item-ressource{
  padding-bottom: 15px;  margin: 8px 6px !important;
  transition: background-color 0.2s;
} */

.custom-list-item {
  background-color: #ffefef;
  cursor: pointer;
}

.menu-text {
  font-size: 14px;
  font-weight: 700;
}

:deep(.custom-list-item-second.v-list-item--active .menu-text) {
  color: #E15361;
  font-weight: 600;
}

/* Empêcher la mise en surbrillance active sur les custom-list-item de première colonne */
:deep(.custom-list-item.v-list-item--active) {
  background-color: transparent !important;
}
:deep(.custom-list-item.v-list-item--active .menu-text) {
  color: inherit !important;
  font-weight: 700 !important;
}

/* Modifier la position du contenu des overlays/menus */
:deep(.v-overlay__content) {
  top: 145px !important;
}

@media (max-with: 600px) {
  .v-main {
    padding-top: 112px !important;
  }
}
</style>