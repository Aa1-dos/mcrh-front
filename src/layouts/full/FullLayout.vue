<template>
    <v-locale-provider> <!-- :locale="locale" -->
        <v-container fluid class="page-wrapper bg-background"><!--  pt-md-8 -->
            <div class="app-container">
                <Suspense>
                    <template #default>
                        <RouterView v-slot="{ Component }">
                           <!--  <div v-if="!Component">Aucun composant trouvé pour cette route !</div> -->
                            <transition name="fade" mode="out-in">
                                <component :is="Component" />
                            </transition>
                        </RouterView>
                    </template>
                    <template #fallback>
                        <LoadingComponent />
                    </template>
                </Suspense>
            </div>
        </v-container>
    </v-locale-provider>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RouterView } from 'vue-router';
import LoadingComponent from '@/components/LoadingComponent.vue';

/* const locale = ref('fr'); // Langue par défaut

function switchLocale() {
    locale.value = locale.value === 'fr' ? 'en' : 'fr';
} */
</script>


<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* .maxWidth {
    max-width: 1440px;
    margin: 0 auto;
} */

.hr-layout {
    min-height: calc(100vh - 70px);
}
</style>
