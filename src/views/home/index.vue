<template>
    <v-app>
      <NavBars v-model:drawer="drawer" />

        <!-- Mobile Navigation Drawer -->
        <v-navigation-drawer v-model="drawer" temporary app location="right" width="300">
          <v-list>
            <v-list-group value="MCRH Conseil">
              <template v-slot:activator="{ props }">
                <v-list-item v-bind="props" title="MCRH Conseil"></v-list-item>
              </template>
              <v-list-item :to="{ name: 'APropos' }" title="Qui suis-je ?"></v-list-item>
              <v-list-item :to="{ name: 'NotreEquipe' }" title="Le regard d'une DRH"></v-list-item>
            </v-list-group>
            
            <v-list-group value="Le carnet RH">
              <template v-slot:activator="{ props }">
                <v-list-item v-bind="props" title="Le carnet RH"></v-list-item>
              </template>
              <v-list-item :to="{ name: 'Articles' }" title="Articles"></v-list-item>
              <v-list-item :to="{ name: 'AnalyseTendances' }" title="Analyses"></v-list-item>
            </v-list-group>
            
            <v-list-group value="Nos ressources">
              <template v-slot:activator="{ props }">
                <v-list-item v-bind="props" title="Nos ressources"></v-list-item>
              </template>
              <v-list-item :to="{ name: 'Livres' }" title="Livres"></v-list-item>
              <v-list-item :to="{ name: 'Podcasts' }" title="Podcasts"></v-list-item>
              <v-list-item :to="{ name: 'TEDTalks' }" title="TED Talks"></v-list-item>
              <v-list-item :to="{ name: 'PortraitsInspirants' }" title="Portraits Inspirants"></v-list-item>
              <v-list-item :to="{ name: 'Outils' }" title="Outils"></v-list-item>
              <v-list-item :to="{ name: 'Templates' }" title="Templates"></v-list-item>
            </v-list-group>
            
            <v-list-group value="Nos offres">
              <template v-slot:activator="{ props }">
                <v-list-item v-bind="props" title="Nos offres"></v-list-item>
              </template>
              <v-list-item :to="{ name: 'Formations' }" title="Formations"></v-list-item>
              <v-list-item :to="{ name: 'Conseil' }" title="Conseil"></v-list-item>
            </v-list-group>
            
            <v-list-item :to="{ name: 'Contact' }" title="Contact"></v-list-item>
            <v-divider class="my-4"></v-divider>
            <v-list-item>
              <v-btn color="accent" block class="text-capitalize rounded-pill" elevation="0">
                Rejoindre la lettre RH & Mindset
              </v-btn>
            </v-list-item>
          </v-list>
        </v-navigation-drawer>

        <v-main> <!-- style="padding-top: 128px;" -->
            <!-- Hero Section -->
            <section id="hero" class="mb-16 bg-hero">
                <HeroSection>
                    <v-container class="nav-container">
                        <v-row align="center">
                            <v-col cols="12" md="6" class="">
                                <div class="first-content">
                                    <h1 class="text-h2 font-weight-bold mb-6" style="line-height: 1.2;">
                                        <span class="text-accent-hero">Travailler autrement,</span>
                                        <span class="text-primary-hero">ensemble, avec sens, exigence et équilibre</span>
                                        <!-- style="white-space: nowrap; -->
                                    </h1>
                                    <p class="text-subtitle-1 font-weight-regular text-grey-darken-1 mb-8">
                                        Faites évoluer vos pratiques RH, développez vos talents et impulsez une dynamique
                                        positive au
                                        sein de votre organisation
                                    </p>
                                    <div class="d-flex flex-wrap" style="gap: 16px;">
                                        <v-btn size="large" variant="outlined" color="primary"
                                            class="text-capitalize rounded-pill" prepend-icon="mdi-play-circle-outline">
                                            Regarder la vidéo
                                        </v-btn>
                                        <v-btn size="large" color="accent" class="text-capitalize rounded-pill">
                                            Rejoindre la lettre RH & Mindset
                                        </v-btn>
                                    </div>
                                </div>
                            </v-col>
                            <v-col cols="12" md="6" lg="" class="d-flex justify-center">
                                <v-card flat class="pa-4 rounded-xl border">
                                    <v-img src="https://placehold.co/" height="300" cover class="position-relative"
                                        style="background-color: #F4F4F5;">
                                        <div
                                            style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); cursor: pointer;">
                                            <v-icon size="45" class="elevation-1"
                                                style=" border-radius: 50%; padding: 16px;">
                                                mdi-play-circle-outline
                                            </v-icon>
                                        </div>
                                    </v-img>
                                </v-card>
                            </v-col>
                        </v-row>
                </v-container>
                </HeroSection>
            </section>

            <!-- Articles Section avec Carousel -->
            <section id="articles" class="mb-16">
                <div class="d-flex justify-space-between align-center mx-6 pa-4 mb-4 text-h6"
                    style="height: 48px; background-color: #F4F4F5; border-radius: 8px;">
                    <span>À la une</span>
                    <div class="d-flex">
                        <v-btn icon="mdi-chevron-left" density="comfortable" variant="plain" @click="prevSlide"
                            class="bg-primary mr-2" color="white"></v-btn>
                        <v-btn icon="mdi-chevron-right" density="comfortable" class="bg-primary" variant="plain"
                            @click="nextSlide" color="white"></v-btn>
                    </div>
                </div>
                <v-container>
                    <v-carousel v-model="currentSlide" hide-delimiter-background delimiter-icon="mdi-circle"
                        height="auto" :show-arrows="false">
                        <v-carousel-item>
                            <v-row>
                                <v-col cols="12" md="4">
                                    <v-card class="h-100" flat>
                                        <v-img :src="art1Image" height="200" cover class="rounded-t-lg"></v-img>
                                        <v-card-text class="pa-4">
                                            <div class="text-overline text-accent-text mb-1 d-flex align-center">
                                                Articles
                                                <span class="bg-accent mx-2"
                                                    style="width: 8px; height: 8px; opacity: 50%; border-radius: 50%; display: inline-block;"></span>
                                                Communiqués
                                            </div>
                                            <div class="text-h5 font-weight-bold mb-2">Comment créer une culture
                                                d'entreprise
                                                favorable au bien-être?</div>
                                            <div class="text-body-2 text-grey-darken-1">Le soleil se lève doucement sur
                                                l’horizon.
                                                Les oiseaux chantent et la nature s’éveille.
                                                Une nouvelle journée pleine de promesses commence.</div>
                                        </v-card-text>
                                    </v-card>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-card class="h-100" flat>
                                        <v-img :src="art2Image" height="200" cover class="rounded-t-lg"></v-img>
                                        <v-card-text class="pa-4">
                                            <div class="text-overline text-accent-text mb-1">
                                                Articles
                                                <span class="bg-accent mx-2"
                                                    style="width: 8px; height: 8px; opacity: 50%; border-radius: 50%; display: inline-block;"></span>
                                                Droit du travail
                                            </div>
                                            <div class="text-h5 font-weight-bold mb-2">Les meilleures pratiques pour un
                                                recrutement efficace</div>
                                            <div class="text-body-2 text-grey-darken-1">Le soleil se lève doucement sur
                                                l’horizon.
                                                Les oiseaux chantent et la nature s’éveille.
                                                Une nouvelle journée pleine de promesses commence.</div>
                                        </v-card-text>
                                    </v-card>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-card class="h-100" flat>
                                        <v-img :src="art3Image" height="200" cover class="rounded-t-lg"></v-img>
                                        <v-card-text class="pa-4">
                                            <div class="text-overline text-accent-text mb-1">
                                                Articles
                                                <span class="bg-accent mx-2"
                                                    style="width: 8px; height: 8px; opacity: 50%; border-radius: 50%; display: inline-block;"></span>
                                                Santé & Ovt
                                            </div>
                                            <div class="text-h5 font-weight-bold mb-2">5 habitudes pour améliorer votre
                                                leadership</div>
                                            <div class="text-body-2 text-grey-darken-1">Le soleil se lève doucement sur
                                                l’horizon.
                                                Les oiseaux chantent et la nature s’éveille.
                                                Une nouvelle journée pleine de promesses commence.</div>
                                        </v-card-text>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-carousel-item>

                        <v-carousel-item>
                            <v-row>
                                <v-col cols="12" md="4">
                                    <v-card class="h-100" flat>
                                        <v-img src="https://placehold.co/400x300" height="200" cover
                                            class="rounded-t-lg"></v-img>
                                        <v-card-text class="pa-4">
                                            <div class="text-overline text-accent-text mb-1">Articles <span
                                                    class="bg-accent mx-2"
                                                    style="width: 8px; height: 8px; opacity: 50%; border-radius: 50%; display: inline-block;"></span>
                                                INNOVATION</div>
                                            <div class="text-h5 font-weight-bold mb-2">Technologies émergentes en RH :
                                                les
                                                tendances 2025</div>
                                            <div class="text-body-2 text-grey-darken-1">Le soleil se lève doucement sur
                                                l’horizon.
                                                Les oiseaux chantent et la nature s’éveille.
                                                Une nouvelle journée pleine de promesses commence.</div>
                                        </v-card-text>
                                    </v-card>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-card class="h-100" flat>
                                        <v-img src="https://placehold.co/400x300" height="200" cover
                                            class="rounded-t-lg"></v-img>
                                        <v-card-text class="pa-4">
                                            <div class="text-overline text-accent-text mb-1">Articles <span
                                                    class="bg-accent mx-2"
                                                    style="width: 8px; height: 8px; opacity: 50%; border-radius: 50%; display: inline-block;"></span>
                                                BIEN-ÊTRE</div>
                                            <div class="text-h5 font-weight-bold mb-2">L'équilibre vie pro-perso :
                                                nouvelles
                                                approches</div>
                                            <div class="text-body-2 text-grey-darken-1">Le soleil se lève doucement sur
                                                l’horizon.
                                                Les oiseaux chantent et la nature s’éveille.
                                                Une nouvelle journée pleine de promesses commence.</div>
                                        </v-card-text>
                                    </v-card>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-card class="h-100" flat>
                                        <v-img src="https://placehold.co/400x300" height="200" cover
                                            class="rounded-t-lg"></v-img>
                                        <v-card-text class="pa-4">
                                            <div class="text-overline text-accent-text mb-1">Article <span
                                                    class="bg-accent mx-2"
                                                    style="width: 8px; height: 8px; opacity: 50%; border-radius: 50%; display: inline-block;"></span>
                                                FORMATION</div>
                                            <div class="text-h5 font-weight-bold mb-2">L'upskilling : un investissement
                                                stratégique</div>
                                            <div class="text-body-2 text-grey-darken-1">Le soleil se lève doucement sur
                                                l’horizon.
                                                Les oiseaux chantent et la nature s’éveille.
                                                Une nouvelle journée pleine de promesses commence.</div>
                                        </v-card-text>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-carousel-item>
                    </v-carousel>
                </v-container>
            </section>

            <!-- Les 10 derniers carnets editorial -->
            <section id="derniers-carnets" class="mb-16">
                <v-container class="nav-container">
                    <v-row>
                        <v-col cols="12" md="6" lg="4">
                            <v-card elevation="0" class="mb-6 rounded-lg overflow-hidden">
                                <!--  <V-card-title>Les 10 derniers contenus éditoriaux</V-card-title> -->
                                <v-card-text class="pa-4">
                                    <div class="editorial-header mb-6">
                                        <div class="editorial-title-box border-info">
                                            <h2 class="text-h4-edit font-weight-bold text-primary">Les 10 derniers
                                                contenus
                                                éditoriaux</h2>
                                            <!--  <div class="title-suffix text-caption text-grey-darken-1">Fill (14$) × 100 Pug</div> -->
                                        </div>
                                        <p class="text-subtitle-1 text-grey-darken-1 mt-3">
                                            Explorez les dernières tendances et insights en ressources humaines, et
                                            partagez vos
                                            réflexions avec vos pairs.
                                        </p>
                                    </div>
                                </v-card-text>
                            </v-card>
                        </v-col>

                        <v-col cols="12" md="6" lg="4">
                            <v-card elevation="0" class="mb-6 rounded-lg overflow-hidden article-card">
                                <v-img :src="edit1Image" height="500" cover class="rounded-lg article-image">
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
                                                    <h2 class="mb-2 text-white">
                                                        Mémo - CBD/cannabis : la frontière du licite
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
                            </v-card>
                        </v-col>

                        <v-col cols="12" md="6" lg="4">
                            <v-card elevation="0" class="mb-6 rounded-lg overflow-hidden article-card">
                                <v-img :src="edit3Image" height="500" cover class="rounded-lg article-image">
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
                                                    <h2 class="mb-2 text-white">
                                                        Mémo - CBD/cannabis : la frontière du licite
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
                            </v-card>
                        </v-col>
                    </v-row>
                    <!-- deuxième niveau -->
                    <v-row>
                        <v-col cols="12" md="6" lg="4">
                            <v-card elevation="0" class="mb-6 rounded-lg overflow-hidden article-card">
                                <v-img :src="edit2Image" height="500" cover class="rounded-lg article-image">
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
                                                    <h2 class="mb-2 text-white">
                                                        Mémo - CBD/cannabis : la frontière du licite
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
                            </v-card>
                        </v-col>
                        <v-col cols="12" md="6" lg="4">
                            <v-card elevation="0" class="mb-6 rounded-lg overflow-hidden article-card">
                                <v-img :src="edit4Image" height="500" cover class="rounded-lg article-image">
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
                                                    <h2 class="mb-2 text-white">
                                                        Mémo - CBD/cannabis : la frontière du licite
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
                            </v-card>
                        </v-col>
                        <v-col cols="12" md="6" lg="4">
                            <v-card elevation="0" class="mb-6 rounded-lg overflow-hidden article-card">
                                <v-img :src="edit5Image" height="500" cover class="rounded-lg article-image">
                                </v-img>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-container>
            </section>

            <!-- Ressource et outils -->
            <section id="resources-outils" class="mb-16 resources-bg bg-ressource">
                <v-container>
                    <!-- En-tête -->
                    <div class="d-flex align-center justify-center mb-8" style="gap: 214px;">
                        <!-- padding: 32px 112px; -->
                        <div class="mb-12" style="width: 595px;">
                            <h2 class="text-h2-resource font-weight-bold mb-4">Parcourez nos ressources et outils</h2>
                            <p class="text-subtitle-1 text-grey-darken-1 mb-8" style="max-width: 800px;">
                                Découvrez notre vaste sélection de ressources et d'outils conçus pour enrichir vos
                                connaissances
                                en ressources humaines et optimiser vos pratiques professionnelles.
                            </p>
                        </div>
                        <div class="mb-12">
                            <img :src="ressourceImage" alt="" width="334" height="334"
                                style="width:334px; height:334px; object-fit:cover;" />
                        </div>
                    </div>

                    <!-- Tabs -->
                    <div class="text-center mb-8">
                        <div class="tab d-inline-flex">
                            <v-btn class="tab-button mx-2 px-6" :class="{ 'active-tab': activeTab === 0 }"
                                color="primary" variant="plain" rounded="pill" @click="activeTab = 0">
                                <span class="font-weight-medium">La boîte à outils</span>
                                <v-icon size="16" class="ml-2 tab-arrow" :class="{ 'active-arrow': activeTab === 0 }">
                                    mdi-chevron-down
                                </v-icon>
                                </v-btn>
                            <v-btn class="tab-button mx-2 px-6" :class="{ 'active-tab': activeTab === 1 }"
                                variant="outlined" rounded="pill" @click="activeTab = 1">
                                <span class="font-weight-medium">L'atelier du Mindset</span>
                                <v-icon size="16" class="ml-2 tab-arrow" :class="{ 'active-arrow': activeTab === 1 }">
                                    mdi-chevron-down
                                </v-icon>
                            </v-btn>
                        </div>
                    </div>

                    <!-- Cards -->
                    <!-- Contenu de "La boîte à outils" -->
                    <v-row v-if="activeTab === 0" class="tab-content">
                        <v-col cols="12" md="4" class="card-item" style="animation-delay: 0.1s;">
                            <v-card class="resource-card pa-8 text-center" flat>
                                <div class="icon-circle mb-4 mx-auto d-flex align-center justify-center">
                                    <img src="@/assets/images/icons/icon3.png" alt="Modèles de documents RH" width="40"
                                        height="40" />
                                </div>
                                <h3 class="text-h5-doc font-weight-bold mb-3">Modèles de documents RH</h3>
                                <p class="text-18 text-grey-darken-1 mb-4 mx-auto" style="width: 234px; overflow: hidden; text-overflow: ellipsis;">
                                    {{ "Transformez vos pratiques en ressources humaines, cultivez les compétences de vos équipes équipes...".slice(0, 49) + ( "Transformez vos pratiques en ressources humaines, cultivez les compétences de vos équipes équipes...".length > 50 ? "..." : "" ) }}
                                </p>
                                <v-btn class="view-all-btn" variant="text" color="primary"
                                    append-icon="mdi-arrow-right">
                                    Voir tous les modèles
                                </v-btn>
                            </v-card>
                        </v-col>

                        <v-col cols="12" md="4" class="card-item" style="animation-delay: 0.2s;">
                            <v-card class="resource-card pa-8 text-center" flat>
                                <div class="icon-circle mb-4 mx-auto d-flex align-center justify-center">
                                    <img src="@/assets/images/icons/icon4.png" alt="Grilles d'entretien" width="40"
                                        height="40" />
                                </div>
                                <h3 class="text-h5-doc font-weight-bold mb-3">Grilles d'entretien</h3>
                                <p class="text-18 text-grey-darken-1 mb-4 mx-auto" style="width: 234px; overflow: hidden; text-overflow: ellipsis;">
                                    {{ "Transformez vos pratiques en ressources humaines, cultivez les compétences de vos équipes équipes...".slice(0, 49) + ( "Transformez vos pratiques en ressources humaines, cultivez les compétences de vos équipes équipes...".length > 50 ? "..." : "" ) }}
                                </p>
                                 <v-btn class="view-all-btn" variant="text" color="primary"
                                    append-icon="mdi-arrow-right">
                                    Voir toutes les grilles
                                </v-btn>
                            </v-card>
                        </v-col>

                        <v-col cols="12" md="4" class="card-item" style="animation-delay: 0.3s;">
                            <v-card class="resource-card pa-8 text-center" flat>
                                <div class="icon-circle mb-4 mx-auto d-flex align-center justify-center">
                                    <img src="@/assets/images/icons/icon5.png" alt="Fiches pratiques téléchargeables"
                                        width="40" height="40" />
                                </div>
                                <h3 class="text-h5-doc font-weight-bold mb-3">Fiches pratiques téléchargeables</h3>
                                <p class="text-18 text-grey-darken-1 mb-4 mx-auto" style="width: 234px; overflow: hidden; text-overflow: ellipsis;">
                                    {{ "Transformez vos pratiques en ressources humaines, cultivez les compétences de vos équipes équipes...".slice(0, 49) + ( "Transformez vos pratiques en ressources humaines, cultivez les compétences de vos équipes équipes...".length > 50 ? "..." : "" ) }}
                                </p>
                                <v-btn class="view-all-btn" variant="text" color="primary"
                                    append-icon="mdi-arrow-right">
                                    Voir toutes les fiches
                                </v-btn>
                            </v-card>
                        </v-col>
                    </v-row>

                    <!-- Contenu de "L'atelier du Mindset" -->
                    <v-row v-else class="tab-content">
                        <v-col cols="12" md="4" class="card-item" style="animation-delay: 0.1s;">
                            <v-card class="resource-card pa-8 text-center" flat>
                                <div class="icon-circle mb-4 mx-auto d-flex align-center justify-center">
                                    <v-icon color="white" size="24">mdi-brain</v-icon>
                                </div>
                                <h3 class="text-h5-doc font-weight-bold mb-3">Développement personnel</h3>
                                <p class="text-body-2 text-grey-darken-1 mb-4">
                                    Développez votre mindset positif et votre résilience avec nos exercices pratiques
                                    pour tous
                                    les niveaux...
                                </p>
                                <v-btn class="view-all-btn" variant="text" color="primary"
                                    append-icon="mdi-arrow-right">
                                    Voir tous les exercices
                                </v-btn>
                            </v-card>
                        </v-col>

                        <v-col cols="12" md="4" class="card-item" style="animation-delay: 0.2s;">
                            <v-card class="resource-card pa-8 text-center" flat>
                                <div class="icon-circle mb-4 mx-auto d-flex align-center justify-center">
                                    <v-icon color="white" size="24">mdi-book-open-variant</v-icon>
                                </div>
                                <h3 class="text-h5-doc font-weight-bold mb-3">Lectures recommandées</h3>
                                <p class="text-body-2 text-grey-darken-1 mb-4">
                                    Découvrez notre sélection de livres, articles et podcasts pour nourrir votre
                                    croissance
                                    personnelle...
                                </p>
                                <v-btn class="view-all-btn" variant="text" color="primary"
                                    append-icon="mdi-arrow-right">
                                    Voir toutes les recommandations
                                </v-btn>
                            </v-card>
                        </v-col>

                        <v-col cols="12" md="4" class="card-item" style="animation-delay: 0.3s;">
                            <v-card class="resource-card pa-8 text-center" flat>
                                <div class="icon-circle mb-4 mx-auto d-flex align-center justify-center">
                                    <v-icon color="white" size="24">mdi-meditation</v-icon>
                                </div>
                                <h3 class="text-h5-doc font-weight-bold mb-3">Techniques de bien-être au travail</h3>
                                <p class="text-body-2 text-grey-darken-1 mb-4">
                                    Apprenez à cultiver un environnement de travail équilibré et bienveillant pour
                                    vous-même et
                                    votre équipe...
                                </p>
                                <v-btn class="view-all-btn" variant="text" color="primary"
                                    append-icon="mdi-arrow-right">
                                    Voir toutes les techniques
                                </v-btn>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-container>
            </section>


            <!-- Les 10 dernières inspirations RH -->
            <section id="inspirations-rh" class="mb-16">
                <v-container class="nav-container">
                    <v-row>
                        <!-- Sidebar avec navigation -->
                        <v-col cols="12" md="6" lg="5" class="pe-6">
                            <div class="inspiration-sidebar-capture">
                                <h2 class="inspiration-title mb-4">Les 10 dernières inspirations RH</h2>
                                <p class="inspiration-description mb-6">
                                    Découvrez les dernières innovations et réflexions en matière de ressources humaines,
                                    et
                                    engagez-vous dans des discussions enrichissantes avec vos collègues.
                                </p>

                                <div class="grouped-btns-capture">
                                    <v-btn v-for="(category, index) in inspirationCategories" :key="category.id"
                                        :class="['rh-articles-btn', 'mb-3', 'd-flex', 'justify-space-between', 'align-center', { 'active-nav': activeCategory === index }]"
                                        variant="text" block rounded="lg" size="large" @click="toggleCategory(index)">
                                        <span>{{ category.name }}</span>
                                        <v-icon size="20">mdi-chevron-right</v-icon>
                                    </v-btn>
                                </div>
                            </div>
                        </v-col>

                        <!-- Contenu principal -->
                        <v-col cols="12" md="8" lg="7" class="inspiration-content-capture">
                            <v-row>
                                <!-- Grandes cartes (2x1) -->
                                <v-col cols="12" sm="6" class="inspiration-card-item" style="animation-delay: 0.1s;">
                                    <v-card class="h-100" flat>
                                        <v-img :src="inspirationCategories[activeCategory].items[0].image" height="280"
                                            cover class="position-relative rounded-t-lg">
                                        </v-img>
                                        <v-card-text class="pl-0">
                                            <div class="card-content-capture">
                                                <v-chip
                                                    :color="inspirationCategories[activeCategory].items[0].category.color"
                                                    size="small" class="mb-3 category-chip" variant="flat">
                                                    {{ inspirationCategories[activeCategory].items[0].category.name }}
                                                </v-chip>
                                                <h3 class="card-title-capture text-h5 mb-2">
                                                    {{ inspirationCategories[activeCategory].items[0].title }}
                                                </h3>
                                                <p class="card-description-capture mb-3">
                                                    {{ inspirationCategories[activeCategory].items[0].description }}
                                                </p>
                                                <div class="card-date-capture">
                                                    Publié le {{ inspirationCategories[activeCategory].items[0].date }}
                                                </div>
                                            </div>
                                        </v-card-text>
                                    </v-card>
                                </v-col>

                                <v-col cols="12" sm="6" class="inspiration-card-item" style="animation-delay: 0.2s;">
                                    <v-card class="h-100" flat>
                                        <v-img :src="inspirationCategories[activeCategory].items[1].image" height="280"
                                            cover class="position-relative rounded-t-lg">
                                        </v-img>
                                        <v-card-text class="pl-0">
                                            <div class="card-content-capture">
                                                <v-chip
                                                    :color="inspirationCategories[activeCategory].items[1].category.color"
                                                    size="small" class="mb-3 category-chip" variant="flat">
                                                    {{ inspirationCategories[activeCategory].items[1].category.name }}
                                                </v-chip>
                                                <h3 class="card-title-capture mb-2">
                                                    {{ inspirationCategories[activeCategory].items[1].title }}
                                                </h3>
                                                <p class="card-description-capture mb-3">
                                                    {{ inspirationCategories[activeCategory].items[1].description }}
                                                </p>
                                                <div class="card-date-capture">
                                                    Publié le {{ inspirationCategories[activeCategory].items[1].date }}
                                                </div>
                                            </div>
                                        </v-card-text>
                                    </v-card>
                                </v-col>
                            </v-row>

                            <v-row class="mt-2">
                                <!-- Grandes cartes (2x1) -->
                                <v-col cols="12" sm="6" class="inspiration-card-item" style="animation-delay: 0.3s;">
                                    <v-card class="h-100" flat>
                                        <v-img :src="inspirationCategories[activeCategory].items[2].image" height="280"
                                            cover class="position-relative rounded-t-lg">
                                        </v-img>
                                        <v-card-text class="pl-0">
                                            <div class="card-content-capture">
                                                <v-chip
                                                    :color="inspirationCategories[activeCategory].items[2].category.color"
                                                    size="small" class="mb-3 category-chip" variant="flat">
                                                    {{ inspirationCategories[activeCategory].items[2].category.name }}
                                                </v-chip>
                                                <h3 class="card-title-capture mb-2">
                                                    {{ inspirationCategories[activeCategory].items[2].title }}
                                                </h3>
                                                <p class="card-description-capture mb-3">
                                                    {{ inspirationCategories[activeCategory].items[2].description }}
                                                </p>
                                                <div class="card-date-capture">
                                                    Publié le {{ inspirationCategories[activeCategory].items[2].date }}
                                                </div>
                                            </div>
                                        </v-card-text>
                                    </v-card>
                                </v-col>

                                <v-col cols="12" sm="6" class="inspiration-card-item" style="animation-delay: 0.4s;">
                                    <v-card class="h-100" flat>
                                        <v-img :src="inspirationCategories[activeCategory].items[3].image" height="280"
                                            cover class="position-relative rounded-t-lg">
                                        </v-img>
                                        <v-card-text class="pl-0">
                                            <div class="card-content-capture">
                                                <v-chip
                                                    :color="inspirationCategories[activeCategory].items[3].category.color"
                                                    size="small" class="mb-3 category-chip" variant="flat">
                                                    {{ inspirationCategories[activeCategory].items[3].category.name }}
                                                </v-chip>
                                                <h3 class="card-title-capture mb-2">
                                                    {{ inspirationCategories[activeCategory].items[3].title }}
                                                </h3>
                                                <p class="card-description-capture mb-3">
                                                    {{ inspirationCategories[activeCategory].items[3].description }}
                                                </p>
                                                <div class="card-date-capture">
                                                    Publié le {{ inspirationCategories[activeCategory].items[3].date }}
                                                </div>
                                            </div>
                                        </v-card-text>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-container>
            </section>

          
<!-- Newsletter Section -->
<NewsletterSection
    :news-icon-image="news1Image"
    :illustration-image="news2Image"
    @subscription="handleNewsletterSubscription"
/>

<!-- Contact Section -->
<ContactSection
    :decorative-image="contactTitle"
    :main-illustration="contactIllustration"
    :secondary-illustration="anotherIllustration"
    @submit="handleContactForm"
/>

<!-- Footer -->
<FooterSection />

        </v-main>
    </v-app>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
// Importer le nouveau composant
import NavBars from '@/components/NavBars.vue';
import HeroSection from '@/components/HeroSection.vue';
import NewsletterSection from '@/components/NewsletterSection.vue';
import ContactSection from '@/components/ContactSection.vue';
import FooterSection from '@/components/FooterSection.vue';
import { VBtn, VIcon } from "vuetify/components";

const drawer = ref(false);
// Indice du slide actuel du carousel
const currentSlide = ref(0);

// Onglet actif dans la section ressources (0 = Boîte à outils, 1 = Atelier du Mindset)
const activeTab = ref(0);

// Variables pour la newsletter
const email = ref('');
const isSubmitting = ref(false);

// Règle de validation pour l'email
const emailRule = (value: string) => {
    if (!value) return 'L\'email est requis';
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(value) || 'Veuillez entrer un email valide';
};

// Nombre total de slides (2 dans notre cas)
const totalSlides = 2;

// Fonctions pour contrôler le carousel
const nextSlide = () => {
    console.log('Next button clicked, current slide:', currentSlide.value);
    // Passer au slide suivant (avec retour au début si on est à la fin)
    currentSlide.value = (currentSlide.value + 1) % totalSlides;
};

const prevSlide = () => {
    console.log('Prev button clicked, current slide:', currentSlide.value);
    // Passer au slide précédent (avec retour à la fin si on est au début)
    currentSlide.value = (currentSlide.value - 1 + totalSlides) % totalSlides;
};

// Fonction pour gérer l'inscription à la newsletter
const handleNewsletterSubscription = async () => {
    if (!email.value || emailRule(email.value) !== true) {
        return;
    }
    
    isSubmitting.value = true;
    
    try {
        // Simuler l'envoi (remplacez par votre logique d'API)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Afficher un message de succès (vous pouvez utiliser une notification)
        console.log('Email inscrit:', email.value);
        alert('Inscription réussie ! Merci de votre inscription à notre newsletter.');
        
        // Reset du formulaire
        email.value = '';
    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
        isSubmitting.value = false;
    }
};

const quickLinks = [
    'Accueil',
    'À propos',
    'Blog',
    'Ressources',
    'Contact'
];

const services = [
    'Conseil RH',
    'Formation',
    'Coaching',
    'Audit',
    'Transformation'
];
// Import image for editorial card
// @ts-ignore
import edit1Image from '@/assets/images/backgrounds/edit-1.png';
import edit2Image from '@/assets/images/backgrounds/edit-2.png';
import edit3Image from '@/assets/images/backgrounds/edit-3.png';
import edit4Image from '@/assets/images/backgrounds/edit-4.png';
import edit5Image from '@/assets/images/backgrounds/edit-5.png';
// Import image for article card
import art1Image from '@/assets/images/articles/art-1.png';
import art2Image from '@/assets/images/articles/art-2.png';
import art3Image from '@/assets/images/articles/art-3.png';
// Import image for resources section
import ressourceImage from '@/assets/images/backgrounds/ressource.png';
// Import image for newsletter section
import news1Image from '@/assets/images/backgrounds/newsletter-bg.png';
import news2Image from '@/assets/images/backgrounds/newsletter-bg-2.png';
// Import image for illustration
import anotherIllustration from '@/assets/images/backgrounds/form-text.png';
import contactIllustration from '@/assets/images/backgrounds/bg-contact.png';
// Import image for contact title
import contactTitle from '@/assets/images/backgrounds/bgcontact-title.png';

// Catégorie active dans la section inspirations RH (0 = Livres, 1 = TED Talks, 2 = Podcasts, 3 = Portraits)
const activeCategory = ref(0);

// Pour gérer les catégories actives (pour le style des boutons)
const activeCategories = ref<number[]>([]);

// Fonction pour gérer le clic sur une catégorie
const toggleCategory = (index: number) => {
    activeCategory.value = index;
    if (!activeCategories.value.includes(index)) {
        activeCategories.value = [index];
    }
};

// Données pour les inspirations RH
const inspirationCategories = ref([
    {
        id: 0,
        name: "Tous les articles",
        items: [
            {
                title: "Mixité dans l'IA : ces groupes démographiques américains qui bougent...",
                description: "En s'appuyant sur des relais locaux en France, des groupes comme Microsoft, Equinix ou IB...",
                date: "10/07/25",
                image: art1Image,
                color: "red-darken-2",
                category: { name: "TED Talks", color: "#FF0000" }
            },
            {
                title: "Le petit RH: L'essentiel en bref",
                description: "Maîtrisez les notions et pratiques indispensables de la RH. La fonction RH doit à la fois être capable de...",
                date: "10/07/25",
                image: edit1Image,
                color: "blue-darken-2",
                category: { name: "Livres", color: "#006FFF" }
            },
            {
                title: "Workspace : LumApps et Beekeeper visent l'expérience « AI Employee ...",
                description: "LumApps (France) et Beekeeper (Suisse) se rapprochent pour former un acteur de poids...",
                date: "10/07/25",
                image: edit3Image,
                color: "deep-orange-darken-2",
                category: { name: "Podcast", color: "#EE82EE" }
            },
            {
                title: "Portrait de Béatrice, responsable ressources humaines",
                description: "Le métier de Responsable RH est un métier à forte valeur ajoutée puisqu'il contribue au re...",
                date: "10/07/25",
                image: art3Image,
                color: "indigo-accent-3",
                category: { name: "Portraits", color: "#008000" }
            },
            {
                title: "Révolution RH : Vers un Management Agile",
                description: "Explorez les nouvelles approches du management dans un monde en mutation.",
                date: "12 nov. 2024",
                image: edit2Image,
                color: "teal-darken-2",
                category: { name: "Livres", color: "#006FFF" }
            }
        ]
    },
    {
        id: 1,
        name: "Livres",
        items: [
            {
                title: "Le petit RH: L'essentiel en bref",
                description: "Maîtrisez les notions et pratiques indispensables de la RH. La fonction RH doit à la fois être capable de...",
                date: "10/07/25",
                image: edit1Image,
                color: "blue-darken-2",
                category: { name: "Livres", color: "#006FFF" }
            },
            {
                title: "Révolution RH : Vers un Management Agile",
                description: "Explorez les nouvelles approches du management dans un monde en mutation.",
                date: "12 nov. 2024",
                image: edit2Image,
                color: "teal-darken-2",
                category: { name: "Livres", color: "#006FFF" }
            },
            {
                title: "La Psychologie Positive au Travail",
                description: "Comment cultiver le bien-être et la performance en entreprise.",
                date: "08 nov. 2024",
                image: edit3Image,
                color: "#EE82EE-darken-2",
                category: { name: "Livres", color: "#006FFF" }
            },
            {
                title: "Digital RH : L'Humain au Cœur",
                description: "L'intelligence artificielle au service des ressources humaines.",
                date: "05 nov. 2024",
                image: edit4Image,
                color: "#008000-darken-2",
                category: { name: "Livres", color: "#006FFF" }
            },
            {
                title: "Générations Y et Z au Travail",
                description: "Comprendre et manager les nouvelles générations.",
                date: "02 nov. 2024",
                image: edit5Image,
                color: "indigo-darken-2",
                category: { name: "Livres", color: "#006FFF" }
            }
        ]
    },
    {
        id: 2,
        name: "TED Talks",
        items: [
            {
                title: "Mixité dans l'IA : ces groupes démographiques américains qui bougent...",
                description: "En s'appuyant sur des relais locaux en France, des groupes comme Microsoft, Equinix ou IB...",
                date: "10/07/25",
                image: art1Image,
                color: "red-darken-2",
                category: { name: "TED Talks", color: "#FF0000" }
            },
            {
                title: "Building Resilient Teams",
                description: "Comment créer des équipes résilientes face aux défis.",
                date: "18 nov. 2024",
                image: art2Image,
                color: "amber-darken-2",
                category: { name: "TED Talks", color: "#FF0000" }
            },
            {
                title: "The Power of Inclusive Leadership",
                description: "L'importance de l'inclusion dans le leadership moderne.",
                date: "16 nov. 2024",
                image: art3Image,
                color: "cyan-darken-2",
                category: { name: "TED Talks", color: "#FF0000" }
            },
            {
                title: "Innovation Through Diversity",
                description: "Comment la diversité stimule l'innovation en entreprise.",
                date: "14 nov. 2024",
                image: edit1Image,
                color: "lime-darken-2",
                category: { name: "TED Talks", color: "#FF0000" }
            },
            {
                title: "Emotional Intelligence at Work",
                description: "L'intelligence émotionnelle comme clé du succès professionnel.",
                date: "11 nov. 2024",
                image: edit2Image,
                color: "pink-darken-2",
                category: { name: "TED Talks", color: "#FF0000" }
            }
        ]
    },
    {
        id: 3,
        name: "Podcasts",
        items: [
            {
                title: "Workspace : LumApps et Beekeeper visent l'expérience « AI Employee ...",
                description: "LumApps (France) et Beekeeper (Suisse) se rapprochent pour former un acteur de poids...",
                date: "10/07/25",
                image: edit3Image,
                color: "deep-orange-darken-2",
                category: { name: "Podcast", color: "#EE82EE" }
            },
            {
                title: "Future of HR",
                description: "Intelligence artificielle et RH : opportunités et défis.",
                date: "19 nov. 2024",
                image: edit4Image,
                color: "brown-darken-2",
                category: { name: "Podcast", color: "#EE82EE" }
            },
            {
                title: "Leadership Stories",
                description: "Témoignages de leaders inspirants sur leur parcours.",
                date: "17 nov. 2024",
                image: edit5Image,
                color: "blue-grey-darken-2",
                category: { name: "Podcast", color: "#EE82EE" }
            },
            {
                title: "Work-Life Balance",
                description: "Trouver l'équilibre parfait entre vie pro et perso.",
                date: "13 nov. 2024",
                image: art1Image,
                color: "deep-#EE82EE-darken-2",
                category: { name: "Podcast", color: "#EE82EE" }
            },
            {
                title: "Talent Management 3.0",
                description: "Nouvelles approches pour attirer et retenir les talents.",
                date: "10 nov. 2024",
                image: art2Image,
                color: "teal-accent-4",
                category: { name: "Podcast", color: "#EE82EE" }
            }
        ]
    },
    {
        id: 4,
        name: "Portraits",
        items: [
            {
                title: "Portrait de Béatrice, responsable ressources humaines",
                description: "Le métier de Responsable RH est un métier à forte valeur ajoutée puisqu'il contribue au re...",
                date: "10/07/25",
                image: art3Image,
                color: "indigo-accent-3",
                category: { name: "Portraits", color: "#008000" }
            },
            {
                title: "Portrait : Marc Laurent, DRH Transformation",
                description: "Comment transformer une culture d'entreprise traditionnelle.",
                date: "23 nov. 2024",
                image: edit1Image,
                color: "orange-darken-2",
                category: { name: "Portraits", color: "#008000" }
            },
            {
                title: "Portrait : Lisa Wang, Coach Exécutive",
                description: "L'art d'accompagner les dirigeants vers l'excellence.",
                date: "21 nov. 2024",
                image: edit2Image,
                color: "#008000-accent-3",
                category: { name: "Portraits", color: "#008000" }
            },
            {
                title: "Portrait : Thomas Müller, Expert Diversité",
                description: "Construire des équipes inclusives et performantes.",
                date: "18 nov. 2024",
                image: edit3Image,
                color: "red-accent-3",
                category: { name: "Portraits", color: "#008000" }
            },
            {
                title: "Portrait : Anna Rodriguez, Consultante Bien-être",
                description: "Promouvoir la santé mentale en entreprise.",
                date: "15 nov. 2024",
                image: edit4Image,
                color: "cyan-accent-3",
                category: { name: "Portraits", color: "#008000" }
            }
        ]
    }
]);

// Variables pour le formulaire de contact
const contactName = ref('');
const contactEmail = ref('');
const contactSubject = ref('');
const contactMessage = ref('');
const isSubmittingcontact = ref(false);

// Règles de validation
const nameRule = (value: string) => {
  if (!value) return 'Le nom est requis';
  return true;
};

const messageRule = (value: string) => {
  if (!value) return 'Le message est requis';
  if (value.length < 10) return 'Le message doit comporter au moins 10 caractères';
  return true;
};

// Fonction pour gérer l'envoi du formulaire de contact
const handleContactForm = async () => {
  if (!contactName.value || !contactEmail.value || !contactMessage.value || 
      nameRule(contactName.value) !== true || 
      emailRule(contactEmail.value) !== true ||
      messageRule(contactMessage.value) !== true) {
    return;
  }

  isSubmittingcontact.value = true;

  try {
    // Simuler l'envoi (remplacez par votre logique d'API)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Afficher un message de succès (vous pouvez utiliser une notification)
    console.log('Formulaire envoyé:', {
      name: contactName.value,
      email: contactEmail.value,
      subject: contactSubject.value,
      message: contactMessage.value
    });
    
    alert('Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.');
    
    // Reset du formulaire
    contactName.value = '';
    contactEmail.value = '';
    contactSubject.value = '';
    contactMessage.value = '';
  } catch (error) {
    console.error('Erreur lors de l\'envoi du formulaire:', error);
    alert('Une erreur est survenue. Veuillez réessayer.');
  } finally {
    isSubmittingcontact.value = false;
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
    /* padding-left: 58px; */
}

.main-content {
   width: 562px;
}

.first-content {
    position: relative;
    /* top: 42px; */
}

.main-nav-bar {
    /*  height: 76px !important; */
    background-color: #F2F4F6 !important;
}

.article-card {
    transition: transform 0.3s ease;
}

.article-card:hover {
    transform: translateY(-5px);
}

.article-overlay {
    background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0) 100%);
    /*  opacity: 0.7; */
    transition: opacity 0.3s ease;
}

.article-card:hover .article-overlay {
    opacity: 1;
}

.text-supnav {
    font-size: 14px;
}

.nav-text {
    font-size: 14px;
    font-weight: 600;
}

.v-btn {
    text-transform: none;
    font-weight: 500;
}

.v-btn.rounded-pill {
    border-radius: 50px !important;
}

/* Styles pour le hero */

.bg-hero {
    background-image: url('@/assets/images/backgrounds/bg-hero.png');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 1% 75%;
    /* Position X Y combinées: 1% depuis la gauche, 75% depuis le haut */
    /*  height: 400px; */
    width: 100vw;
    position: relative;
    left: 50%;
    right: 50%;
    margin-left: -50vw;
    margin-right: -50vw;
}

.bg-ressource {
    background-image: url('@/assets/images/backgrounds/bg-ressource.png'), url('@/assets/images/backgrounds/bg-ressource.png');
    background-repeat: no-repeat, no-repeat;
    background-size: 66%, 66%;
    background-position: 101% -12%, 101% -2%;
    /* La première image à droite en haut, la seconde à gauche en bas */
    position: relative;
}

.tab {
    background-color: rgb(var(--v-theme-white)) !important;
    border-radius: 400px;
    padding: 4px;
    height: 48px;
    opacity: 1;
    /*  transform: rotate(0deg); */
}

.custom-fa-icon {
    font-size: 1.2rem;
}

.grouped-btns-capture {
    width: 220px !important;
    background-color: #F3F6F9;
    padding: 4px;
    border: 1px solid #F3F6F9;
    border-radius: 14px;
}

.text-h2-resource {
    font-size: 42px !important;
    line-height: 140% !important;
    font-weight: 600 !important;
    letter-spacing: -0.04em !important;
    width: 469px;
    height: 118px;
}

.text-overline {
    font-weight: 600 !important;
    text-transform: uppercase;
    font-size: 13 px;
    color: #002444CC !important;
}

.text-subtitle-1 {
    font-size: 1.1rem !important;
    line-height: 140%;
}

.text-h4-edit {
    font-size: 42px !important;
}

.text-h5-doc {
    font-size: 24px !important;
    font-weight: 600 !important;
}

/* Fix for main content with double app bar */
/* .v-main {
    padding-top: 164px !important;
} */

.border-b {
    border-bottom: 1px solid rgb(var(--v-theme-accent)) !important;
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

/* Card Hover Effect */
.v-card {
    transition: all 0.3s ease;
}

.v-card:hover:not(.v-card--flat) {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

/* Make images responsive */
.v-img {
    max-width: 100%;
}


@media (max-width: 600px) {
    .v-main {
        padding-top: 112px !important;
    }

    .text-h2 {
        font-size: 1.75rem !important;
    }

        .text-h4 {
        font-size: 1.5rem !important;
    }
}

/* Styles pour la section ressources et outils */
.resources-bg {
    background-color: #F3F6F9 !important;
    padding: 60px 0;
    position: relative;
    overflow: hidden;
    width: 100vw;
    left: 50%;
    right: 50%;
    margin-left: -50vw;
    margin-right: -50vw;
}

.resources-bg .v-container {
    width: 1440px;
}

section#ressources-outils {
    width: 100vw;
    position: relative;
    left: 50%;
    right: 50%;
    margin-left: -50vw;
    margin-right: -50vw;
}

.icon-circle img {
    width: 80px;
    height: 80px;
    transition: all 0.3s ease;
}

.resource-card {
    background-color: white;
    transition: all 0.3s ease;
    height: 400px;
    justify-content: center;
    display: flex;
    flex-direction: column;
    /* gap: 20px; */
    /* width: 394px; */
}

.resource-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

.tab-button {
    /*  transition: all 0.3s ease; */
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.5px;
    position: relative;
    height: 40px;
    overflow: hidden;
    border: 2px solid transparent;
}

.tab-arrow {
    transition: transform 0.3s ease;
    transform: rotate(180deg);
}

.active-arrow {
    transform: rotate(0deg);
}

.active-tab {
    background-color: rgb(var(--v-theme-primary)) !important;
    color: white !important;
    font-weight: 600;
    position: relative;
    border: 2px solid rgb(var(--v-theme-primary));
    transform: translateY(-2px);
}

.view-all-btn {
    font-weight: 600;
    letter-spacing: 0.3px;
    font-size: 14px;
}




/* Animation pour l'effet robinet ouvert */
@keyframes cardDropIn {
    0% {
        opacity: 0;
        transform: translateY(-60px) scale(0.8);
        filter: blur(4px);
    }

    50% {
    }

    50% {
        opacity: 0.7;
        transform: translateY(-10px) scale(0.95);
        filter: blur(1px);
    }

    100% {
        opacity: 1;
        transform: translateY(0) scale(1);
        filter: blur(0);
    }
}

.tab-content {
    position: relative;
    overflow: hidden;
}

.card-item {
    animation: cardDropIn 0.8s ease-out both;
    transform-origin: center top;
}

/* Animation supplémentaire pour les éléments à l'intérieur des cartes */
.card-item .resource-card {
    transition: all 0.3s ease;
    position: relative;
}

.card-item:hover .resource-card {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

/* Animation en cascade pour simuler l'effet robinet */
.card-item:nth-child(1) {
    animation-delay: 0.1s;
}

.card-item:nth-child(2) {
    animation-delay: 0.25s;
}

.card-item:nth-child(3) {
    animation-delay: 0.4s;
}

/* Sur mobile, animation plus rapide */
@media (max-width: 768px) {
    .card-item {
        animation-duration: 0.6s;
    }

    .card-item:nth-child(1) {
        animation-delay: 0.05s;
    }

    .card-item:nth-child(2) {
        animation-delay: 0.15s;
    }

    .card-item:nth-child(3) {
        animation-delay: 0.25s;
    }
}

/* Styles pour la section Les 10 dernières inspirations RH - Capture Design */
.inspiration-sidebar-capture {
    padding: 0px 24px;
    height: fit-content;
    /* position: sticky;  */
    /*   box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); */
}

.inspiration-title {
    font-size: 42px !important;
    font-weight: 600 !important;
    line-height: 1.2 !important;
    color: rgb(var(--v-theme-primary)) !important;
    margin-bottom: 16px !important;
}

.inspiration-description {
    font-size: 18px !important;
    line-height: 1.6 !important;
    font-weight: 500 !important;
    margin-bottom: 24px !important;
}

.rh-articles-btn {
    font-size: 16px !important;
    text-transform: none !important;
    height: 40px !important;
    /*  margin-bottom: 24px !important; */
    /*     transition: all 0.3s ease !important; */
}

.rh-articles-btn.active-nav {
    background-color: rgb(var(--v-theme-primary)) !important;
    color: white !important;
    font-weight: 600 !important;
    border-color: #bfdbfe !important;
}

.rh-articles-btn .mdi-chevron-right {
    transition: transform 0.3s ease;
    opacity: 0.6;
}

.rh-articles-btn.active-nav .mdi-chevron-right {
    transform: rotate(90deg);
    opacity: 1;
    color: white !important;
}

/* Styles des cartes inspirations */
.inspiration-card-capture {
    border-radius: 16px !important;
    overflow: hidden !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    cursor: pointer;
    position: relative;
    border: 1px solid rgba(0, 0, 0, 0.08);
}

.inspiration-card-capture:hover {
    transform: translateY(-8px) scale(1.02) !important;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
    border-color: rgba(0, 36, 68, 0.2);
}

.card-overlay-capture {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(to top,
            rgba(0, 0, 0, 0.85) 0%,
            rgba(0, 0, 0, 0.6) 50%,
            rgba(0, 0, 0, 0.3) 80%,
            rgba(0, 0, 0, 0) 100%);
    padding: 0;
    transition: all 0.3s ease;
}

.inspiration-card-capture:hover .card-overlay-capture {
    background: linear-gradient(to top,
            rgba(0, 0, 0, 0.9) 0%,
            rgba(0, 0, 0, 0.7) 50%,
            rgba(0, 0, 0, 0.4) 80%,
            rgba(0, 0, 0, 0.1) 100%);
}

.card-content-capture {
    position: relative;
    z-index: 2;
}

.category-chip {
    font-weight: 600 !important;
    font-size: 12px !important;
    text-transform: uppercase !important;
    letter-spacing: 0.5px !important;
    border-radius: 6px !important;
}

.card-title-capture {
    font-size: 20px !important;
    font-weight: 700 !important;
    line-height: 1.3 !important;
    margin-bottom: 8px !important;
}

.card-title-small-capture {
    font-size: 16px !important;
    font-weight: 600 !important;
    line-height: 1.3 !important;
    color: white !important;
    margin-bottom: 8px !important;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.card-description-capture {
    font-size: 16px !important;
    line-height: 1.5 !important;
    margin-bottom: 12px !important;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.card-date-capture {
    font-size: 12px !important;
    font-weight: 500 !important;
}

/* Animation pour les cartes inspiration */
@keyframes cardDropInCapture {
    0% {
        opacity: 0;
        transform: translateY(-40px) scale(0.9);
        filter: blur(8px);
    }

    50% {
        opacity: 0.7;
        transform: translateY(-20px) scale(0.95);
        filter: blur(4px);
    }

    100% {
        opacity: 1;
        transform: translateY(0) scale(1);
        filter: blur(0);
    }
}

.inspiration-card-item {
    animation: cardDropInCapture 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    opacity: 0;
}

/* Animation en cascade pour les cartes inspiration */
.inspiration-card-item:nth-child(1) {
    animation-delay: 0.1s;
}

.inspiration-card-item:nth-child(2) {
    animation-delay: 0.2s;
}

.inspiration-card-item:nth-child(3) {
    animation-delay: 0.3s;
}

.inspiration-card-item:nth-child(4) {
    animation-delay: 0.4s;
}

.inspiration-card-item:nth-child(5) {
    animation-delay: 0.5s;
}

/* Responsive pour la section inspirations */
@media (max-width: 1024px) {
    .inspiration-sidebar-capture {
        position: static;
        margin-bottom: 32px;
    }
}

@media (max-width: 768px) {
    .inspiration-title {
        font-size: 24px !important;
    }

    .inspiration-card-item {
        animation-duration: 0.6s;
    }

    .card-content-capture {
        padding: 16px;
    }

    .inspiration-card-item:nth-child(1) {
        animation-delay: 0.05s;
    }

    .inspiration-card-item:nth-child(2) {
        animation-delay: 0.1s;
    }

    .inspiration-card-item:nth-child(3) {
        animation-delay: 0.15s;
    }

    .inspiration-card-item:nth-child(4) {
        animation-delay: 0.2s;
    }

    .inspiration-card-item:nth-child(5) {
        animation-delay: 0.25s;
    }
}
</style>