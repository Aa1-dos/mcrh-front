<template>
  <section class="footer-section">
    <v-container class="nav-container pt-16 pb-10">
      <div class="d-flex footer-box align-center">
        <!-- Première ligne : Logo et tagline -->
        <div class="footer-top mb-12">
          <div class="d-flex flex-column align-start">
            <!-- Logo -->
            <div class="d-flex align-center">
              <img src="@/assets/images/logos/logo-footer.png" alt="MCRH Conseil" height="58" />
            </div>
            <h3 class="footer-tagline">
              <span class="text-accent">L'espace dédié</span> aux
              professionnels RH, managers
              et agents du changement
            </h3>
          </div>
        </div>

        <!-- Deuxième ligne : Navigation en colonnes -->
        <div>
          <v-row class="footer-nav">
            <v-col cols="12" sm="6" md="3">
              <h4 class="footer-heading">MCRH CONSEIL</h4>
              <v-list density="compact" bg-color="transparent" class="footer-list pa-0">
                <v-list-item density="compact" class="footer-list-item ps-0" style="gap: 4px;">
                  <v-list-item-title>Accueil</v-list-item-title>
                </v-list-item>
                <v-list-item density="compact" class="footer-list-item ps-0">
                  <v-list-item-title>À propos de nous</v-list-item-title>
                </v-list-item>
                <v-list-item density="compact" class="footer-list-item ps-0">
                  <v-list-item-title>Le carnet RH</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-col>

            <v-col cols="12" sm="6" md="3">
              <h4 class="footer-heading">ACTUALITÉS</h4>
              <v-list density="compact" bg-color="transparent" class="footer-list pa-0">
                <v-list-item density="compact" class="footer-list-item ps-0">
                  <v-list-item-title class="d-flex align-center">
                    Articles
                    <v-icon size="14" class="ms-2">mdi-arrow-top-right</v-icon>
                  </v-list-item-title>
                </v-list-item>
                <v-list-item density="compact" class="footer-list-item ps-0">
                  <v-list-item-title class="d-flex align-center">
                    Communiqués
                    <v-icon size="14" class="ms-2">mdi-arrow-top-right</v-icon>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-col>

            <v-col cols="12" sm="6" md="3">
              <h4 class="footer-heading">NOS OFFRES</h4>
              <v-list density="compact" bg-color="transparent" class="footer-list pa-0">
                <v-list-item density="compact" class="footer-list-item ps-0">
                  <v-list-item-title>Formations & ateliers</v-list-item-title>
                </v-list-item>
                <v-list-item density="compact" class="footer-list-item ps-0">
                  <v-list-item-title>Coaching de posture managériale</v-list-item-title>
                </v-list-item>
                <v-list-item density="compact" class="footer-list-item ps-0">
                  <v-list-item-title>Accompagnement RH</v-list-item-title>
                </v-list-item>
                <v-list-item density="compact" class="footer-list-item ps-0">
                  <v-list-item-title>Interventions / Conférences</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-col>

            <v-col cols="12" sm="6" md="3">
              <h4 class="footer-heading">NOS OFFRES</h4>
              <v-list density="compact" bg-color="transparent" class="footer-list pa-0">
                <v-list-item density="compact" class="footer-list-item ps-0">
                  <v-list-item-title>La boîtes à outils</v-list-item-title>
                </v-list-item>
                <v-list-item density="compact" class="footer-list-item ps-0">
                  <v-list-item-title>L'atelier du Mindset</v-list-item-title>
                </v-list-item>
                <v-list-item density="compact" class="footer-list-item ps-0">
                  <v-list-item-title>Inspiration RH</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
        </div>
      </div>

      <!-- Ligne de séparation -->
      <v-divider class="my-6 footer-divider"></v-divider>

      <!-- Troisième ligne : Informations légales et réseaux sociaux -->
      <div class="d-flex flex-wrap justify-space-between align-center footer-bottom">
        <div class="footer-copyright d-flex align-center">
          <span class="copyright-text">©2025 Tous droits réservés, mcrh-conseil.fr</span>
          <span class="phone-number mx-6">
            <v-icon size="16" class="me-1">mdi-phone</v-icon>
            +33 00 00 00 00 00
          </span>
          <span class="address">31-1 Av. Rachel, 92000 Nanterre, France</span>
        </div>

        <div class="footer-social">
          <div class="social-icons">
           <!--  <span class="">Réseaux sociaux:</span>
            <v-btn icon="mdi-facebook" variant="text" density="comfortable" color="white" class="social-icon"></v-btn>
            <v-btn icon="mdi-twitter" variant="text" density="comfortable" color="white" class="social-icon"></v-btn>
            <v-btn icon="mdi-tiktok" variant="text" density="comfortable" color="white" class="social-icon"></v-btn>
            <v-btn icon="mdi-instagram" variant="text" density="comfortable" color="white" class="social-icon"></v-btn> -->
            <SocialLinks />
          </div>
        </div>
      </div>

      <!-- Barre de recherche -->
      <div class="search-bar-wrapper mt-8 d-flex justify-center">
        <div class="search-bar d-flex align-center">
          <v-btn icon color="accent" class="search-icon" variant="text">
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
          <input type="text" class="search-input" placeholder="Rechercher...">
          <v-btn class="search-button" color="white" variant="text">
            <v-icon>mdi-arrow-right</v-icon>
          </v-btn>
        </div>
      </div>
    </v-container>
  </section>
</template>

<script setup lang="ts">
import SocialLinks from './SocialLinks.vue';
</script>

<style scoped>
/* Styles pour le footer */

.nav-container {
    max-width: 1440px;
    margin-left: auto;
    margin-right: auto;
    padding-top: 48px;
    /* padding-left: 58px; */
}

.footer-section {   
background: linear-gradient(256.15deg, #002444 -0.4%, #01325E 113.91%);
  color: white;
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  padding-top: 40px;
}

.footer-box
{
    margin-bottom: 130px;
    height: 206px;
    justify-content: space-between;
}

.footer-tagline {
  font-size: 28px;
  font-weight: 500;
  line-height: 1.4;
  color: white;
  margin-top: 16px;
  width: 395px;
}

.footer-heading {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 20px;
  color: rgb(var(--v-theme-accent)) !important;
}

.footer-list {
  background-color: transparent !important;
}

.footer-list-item {
  padding-left: 0;
}

.footer-list :deep(.v-list-item-title) {
  font-size: 14px !important;
   color: white !important;
  transition: color 0.2s ease;
    font-weight: 500 !important;
}

.footer-divider {
  border-color: #FBCFCB !important;
  height: 56px !important;
}

.footer-bottom {
  font-size: 14px;
  color: white;
}

.copyright-text, .phone-number, .address {
  font-size: 14px;
}

.social-text {
  font-size: 14px;
  font-weight: 500;
}

.social-icon {
  opacity: 0.8;
  transition: opacity 0.2s ease;
}

.social-icon:hover {
  opacity: 1;
}

.search-bar-wrapper {
  margin-top: 40px;
}

.search-bar {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 30px;
  max-width: 500px;
  width: 100%;
  height: 50px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.search-icon {
  margin-left: 8px;
}

.search-input {
  background: transparent;
  border: none;
  color: white;
  flex-grow: 1;
  padding: 0 16px;
  font-size: 14px;
  outline: none;
}

.v-footer .v-list-item {
    min-height: 32px !important;
}

.v-footer .v-list-item__title {
    color: white !important;
    opacity: 0.8;
}

.v-footer .v-list-item:hover .v-list-item__title {
    opacity: 1;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.search-button {
  width: 50px;
  height: 50px;
  border-radius: 0;
  margin-right: 0;
  border-left: 1px solid rgba(255, 255, 255, 0.2);
}

/* Media queries */
@media (max-width: 960px) {
  .footer-bottom {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .footer-copyright {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .phone-number {
    margin: 8px 0;
  }
}

@media (max-width: 600px) {
  .footer-tagline {
    font-size: 20px;
  }
  
  .footer-nav {
    row-gap: 30px;
  }
}
</style>