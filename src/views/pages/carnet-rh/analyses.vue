<template>
  <v-app>
    <NavBars v-model:drawer="drawer" />

    <v-navigation-drawer v-model="drawer" temporary app location="right" width="300">
      <!-- Contenu du menu mobile -->
    </v-navigation-drawer>

    <v-main>
      <HeroSection/>

      <!-- Barre de filtres et recherche -->
      <section class="py-4">
        <v-container class="nav-container">
          <div class="d-flex flex-wrap align-center justify-space-between">
            <div style="
              width: 101px;
              height: 40px;
              border-radius: 400px;
              display: flex;
              font-size: 14px;
              align-items: center;
              ">
              <v-btn icon color="primary" class="mr-3 mb-2 mb-sm-0" to="/carnet-rh/articles" style="
                border-radius: 400px;
                width: 100%;
                height: 100%;
                min-width: 0;
                padding: 0;
              ">
                <v-icon>mdi-arrow-left</v-icon>
                Retour
              </v-btn>
            </div>

            <SocialLinks />
          </div>
        </v-container>
      </section>

      <!-- Liste des articles -->
      <section class="py-6">
        <v-container class="nav-container">
          <v-row style="width: 100%; overflow: hidden;">
            <!-- Article principal -->
            <!--  <v-col cols="12" md="9" class="mb-6">
              <v-card elevation="0" class="mb-6 rounded-lg overflow-hidden article-card">
                <router-link :to="{ name: 'Analyses', params: { id: 1 } }" class="d-block"
                  style="text-decoration: none;">
                  <v-img :src="art2Image" height="600" cover class="rounded-lg article-image">
                    <div class="article-overlay d-flex flex-column justify-end h-100">
                      <div class="pa-4">
                        <div class="align-center mb-2">
                          <div class="d-flex pa-6 flex-column  mb-2">
                            <h3 class="text-h6 font-weight-bold text-white mb-2">
                              Articles
                              <span class="bg-accent mx-2"
                                style="width: 8px; height: 8px; opacity: 50%; border-radius: 50%; display: inline-block;"></span>
                              Décryptage
                            </h3>
                            <h2 class="h2-article-title mb-2 text-white">
                              RSA, AHH, prime d’activité : les chiffres exacts depuis le 6 Mai 2024
                            </h2>
                            <p class="text-body-6 text-white">
                              CBD, cannabis, test salivaire… Le cas qui nous intéresse : un
                              salarié,
                              consommateur de CBD, peut être positif au test alors même que
                              cette
                              substance est légale. Le sujet est sensible. Le cadre juridique,
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </v-img>
                </router-link>
              </v-card>
            </v-col> -->
            <!-- Articles Section (détail principal intégré dans la carte principale) -->
            <v-col cols="12" md="9" class="mb-6">
              <v-card elevation="0" class="mb-6 rounded-lg overflow-hidden article-card">
                <router-link :to="{ name: 'AnalyseTendances', params: { id: 1 } }" class="d-block"
                  style="text-decoration: none;">
                  <v-img :src="art2Image" cover class="rounded-lg article-image"> <!-- height="600" -->
                   <!--  <div class="article-overlay d-flex flex-column justify-end h-100">
                      <div class="pa-4">
                        <div class="align-center mb-2">
                          <div class="d-flex pa-6 flex-column  mb-2">
                           
                          </div>
                        </div>
                      </div>
                    </div> -->
                  </v-img>
                </router-link>
                <!-- Ajout du contenu détaillé juste après l'image -->
                <div class="pa-4">
                  <!-- En-tête d'article avec fil d'ariane -->
                  <div class="d-flex align-center mb-3">
                    <router-link to="/carnet-rh" class="text-primary text-decoration-none">Le carnet RH</router-link>
                    <v-icon size="small" class="mx-2">mdi-chevron-right</v-icon>
                    <span class="text-primary">Articles d'analyse</span>
                  </div>

                  <!-- Titre principal -->
                  <h1 class="text-h3 font-weight-bold text-primary mb-4">
                    RSA, AHH, prime d'activité : les chiffres exacts depuis le 6 Mai 2024
                  </h1>

                  <!-- Métadonnées de l'article -->
                  <div class="d-flex align-center mb-6">
                    <span class="text-subtitle-2">Par <span class="text-accent-text">L'équipe MCRH</span></span>
                    <v-icon size="small" class="mx-2 text-grey">mdi-circle-small</v-icon>
                    <span class="text-subtitle-2 text-grey-darken-1">Publié le 03/07/2025</span>
                  </div>

                  <!-- Résumé de l'article -->
                  <p class="text-body-1 font-weight-medium mb-6">
                    Les prestations sociales, versées à partir du 06 Mai 2024, ont connu une revalorisation depuis le
                    1er
                    avril 2024.
                    Quels sont désormais leurs montants exacts ?
                  </p>

                  <!-- Tags associés -->
                  <div class="article-tags d-flex flex-wrap mb-8">
                    <span class="tag-pill mr-2 mb-2">changement climatique</span>
                    <span class="tag-pill mr-2 mb-2">environnement</span>
                    <span class="tag-pill mr-2 mb-2">science</span>
                    <span class="tag-pill mr-2 mb-2">durabilité</span>
                    <span class="tag-pill mr-2 mb-2">technologie</span>
                    <span class="tag-pill mr-2 mb-2">changement social</span>
                    <span class="tag-pill mr-2 mb-2">énergie</span>
                    <span class="tag-pill mr-2 mb-2">énergie solaire</span>
                    <span class="tag-pill mr-2 mb-2">données</span>
                    <span class="tag-pill mr-2 mb-2">Compte à rebour</span>
                    <span class="tag-pill mr-2 mb-2">énergie renouvelable</span>
                    <span class="tag-pill mr-2 mb-2">combustibles fossiles</span>
                  </div>

                  <!-- Contenu principal -->
                  <div class="article-content">
                    <h2 class="text-h5 font-weight-bold text-primary mb-4">Le RSA en augmentation</h2>

                    <p class="text-body-1 mb-4">
                      Depuis le 1er avril 2024, la France a procédé à une revalorisation significative de ses
                      prestations
                      sociales, incluant le
                      Revenu de solidarité active (RSA), l'Allocation adulte handicapé (AAH), et la prime d'activité.
                    </p>

                    <p class="text-body-1 mb-4">
                      Cette mise à jour intervient dans un contexte où l'Institut national de la statistique et des
                      études
                      économiques (Insee) a
                      relevé un taux d'inflation de 4,9 % pour l'année précédente, conduisant à une augmentation de 4,6
                      % des
                      aides sociales.
                    </p>

                    <p class="text-body-1 mb-6">
                      La revalorisation des prestations sociales depuis le 1er avril 2024 a particulièrement impacté le
                      Revenu
                      de solidarité
                      active (RSA), avec une augmentation notable pour les différents types de foyers bénéficiaires.
                    </p>

                    <ul class="mb-6 pl-4">
                      <li class="mb-2">
                        <p class="text-body-1">
                          Pour une personne seule, le montant mensuel est passé de 607,75 € à 635,71 €, soit une hausse
                          significative qui
                          reflète la volonté du gouvernement de soutenir les individus sans emploi ou aux revenus très
                          bas.
                        </p>
                      </li>
                      <li>
                        <p class="text-body-1">
                          Pour un couple sans enfant, ce montant atteint désormais 953,56 € par mois, et pour une
                          famille de
                          trois personnes,
                          le RSA s'élève à 1144,28 €, permettant ainsi un meilleur soutien financier adapté à la taille
                          du
                          foyer.
                        </p>
                      </li>
                    </ul>

                    <h2 class="text-h5 font-weight-bold text-primary mb-4">Prime d'Activité : pour compléter les revenus
                      existants</h2>

                    <p class="text-body-1 mb-4">
                      La prime d'activité, destinée à compléter le revenu des travailleurs à faible salaire, a également
                      connu
                      une augmentation
                      significative.
                    </p>

                    <ul class="pl-4">
                      <li class="mb-2">
                        <p class="text-body-1">
                          Le montant forfaitaire mensuel pour une personne seule est désormais de 622,63 €, ce qui
                          représente
                          une
                          augmentation de 27,96 € par rapport à l'année précédente.
                        </p>
                      </li>
                      <li>
                        <p class="text-body-1">
                          Ce montant augmente progressivement en fonction de la composition du foyer, allant jusqu'à
                          933,93 €
                          pour un
                          couple avec un enfant.
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
              </v-card>
            </v-col>

            <!-- Articles secondaires côte à côte -->
            <v-col cols="12" md="3">
              <v-row>
                <v-col cols="12" v-for="(article, index) in articles" :key="index">
                  <v-card class="article-card" flat>
                    <div class="d-flex flex-column rounded-lg h-100"><!-- style="height: 498px; width: 100%;" -->
                      <v-img :src="art3Image" cover></v-img>
                      <v-card-text class="px-0 pt-4">
                        <div class="d-flex align-center mb-2">
                          <span class="text-caption text-grey-darken-1 mr-2">Carnet RH</span>
                          <v-icon size="small" class="text-grey-darken-1 mr-2">mdi-circle-small</v-icon>
                          <span class="text-caption text-grey-darken-1">{{ article.category }}</span>
                        </div>
                        <h3 class="text-h6 font-weight-bold mb-3">
                          {{ article.title }}
                        </h3>
                        <p class="text-caption text-grey-darken-1">
                          Publié le {{ article.date }}
                        </p>
                      </v-card-text>
                    </div>
                  </v-card>


                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <SocialLinks />

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
import SocialLinks from '@/components/SocialLinks.vue';

const drawer = ref(false);
const activeFilter = ref('analyse');
const searchQuery = ref('');
const page = ref(1);

const articles = [
  {
    title: 'Zone de génie des collaborateurs : 3 étapes clés pour la révéler',
    image: 'https://placehold.co/400x300',
    category: 'Articles d\'analyse',
    date: '10/07/25'
  },
  {
    title: 'Les 5 qualités d\'un bon manager en 2025',
    image: 'https://placehold.co/400x300',
    category: 'Articles d\'analyse',
    date: '10/07/25'
  },
  {
    title: 'Comment mettre en place une politique de bien-être efficace',
    image: 'https://placehold.co/400x300',
    category: 'Décryptage de tendances RH',
    date: '05/07/25'
  },
  {
    title: 'L\'intelligence émotionnelle au service du leadership',
    image: 'https://placehold.co/400x300',
    category: 'Regards croisés',
    date: '01/07/25'
  }
];

// Import image for article card
import art1Image from '@/assets/images/articles/art-1.png';
import art2Image from '@/assets/images/articles/art-2.png';
import art3Image from '@/assets/images/articles/art-3.png';
</script>

<style scoped>


.breadcrumb-container {
  padding-top: 20px;
  position: relative;
}


.active-filter {
  background-color: rgb(var(--v-theme-primary)) !important;
  color: white !important;
}

.featured-image::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.2) 60%, rgba(0, 0, 0, 0) 100%);
}

.article-overlay {
  position: relative;
  z-index: 2;
}

.search-field {
  /*   border: 1px solid var(--v-primary); */
  border-radius: 24px;
}

.search-field :deep(.v-field__input) {
  padding-left: 8px !important;
}

@media (max-width: 600px) {
  .search-field {
    width: 100%;
    max-width: none;
  }
}

/* Nouveaux styles pour l'article détaillé */
.article-detailed {
  border-radius: 8px;
}

.tag-pill {
  display: inline-block;
  padding: 4px 12px;
  background-color: #f5f5f5;
  border-radius: 20px;
  font-size: 12px;
  color: #666;
}

.article-content h2 {
  color: #003366;
}

.article-content ul {
  list-style-type: disc;
}

.article-content li {
  margin-bottom: 10px;
}
</style>