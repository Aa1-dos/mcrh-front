<template>
  <section id="newsletter" class="mb-16 newsletter-bg">
    <v-container class="nav-container">
      <v-row align="center" justify="center">
        <!-- Contenu principal à gauche -->
        <v-col cols="12" md="7" lg="7">
          <div class="main-content">
            <div class="newsletter-icons mb-4">
              <img :src="newsIconImage" alt="Icône de la newsletter" loading="lazy" />
            </div>
            <h2 class="newsletter-title mb-4">
              {{ title }}
            </h2>
            <p v-for="(paragraph, index) in descriptions" :key="index" class="newsletter-description mb-4">
              {{ paragraph }}
            </p>
          </div>
        </v-col>
        <!-- Image à droite -->
        <v-col cols="12" md="5" lg="5" class="">
          <img :src="illustrationImage" alt="Illustration de la newsletter" class="newsletter-content-2" loading="lazy" />
        </v-col>
      </v-row>
      
      <!-- Formulaire d'inscription à la newsletter -->
      <v-row>
        <v-col cols="12" md="8" lg="8" class="">
          <div class="newsletter-form-wrapper d-inline-flex">
            <v-form @submit.prevent="handleSubmit" class="newsletter-form-centered">
              <div class="d-flex align-center newsletter-input-group">
                <v-text-field
                  v-model="email"
                  :placeholder="inputPlaceholder"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  class="newsletter-input"
                  :rules="[emailRule]"
                  type="email"
                />
                <v-btn
                  type="submit"
                  color="accent"
                  class="newsletter-submit-btn ml-3"
                  size="large"
                  :loading="isSubmitting"
                  append-icon="mdi-arrow-right"
                >
                  {{ buttonText }}
                </v-btn>
              </div>
            </v-form>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Props pour personnaliser le contenu et le comportement
const props = defineProps({
  title: {
    type: String,
    default: 'Ne ratez plus les breaking news RH !'
  },
  descriptions: {
    type: Array,
    default: () => [
      'Restez informé des dernières tendances et actualités en vous abonnant à notre newsletter.',
      'Recevez des conseils exclusifs, des articles inspirants et des mises à jour sur nos événements directement dans votre boîte mail.'
    ]
  },
  newsIconImage: {
    type: String,
    required: true
  },
  illustrationImage: {
    type: String,
    required: true
  },
  inputPlaceholder: {
    type: String,
    default: 'Adresse email'
  },
  buttonText: {
    type: String,
    default: 'Je m\'inscris'
  }
});

// Variables pour le formulaire
const email = ref('');
const isSubmitting = ref(false);

// Règle de validation pour l'email
const emailRule = (value: string) => {
  if (!value) return 'L\'email est requis';
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(value) || 'Veuillez entrer un email valide';
};

// Émissions pour communiquer avec le composant parent
const emit = defineEmits(['subscription']);

// Fonction pour gérer la soumission du formulaire
const handleSubmit = async () => {
  if (!email.value || emailRule(email.value) !== true) {
    return;
  }
  
  isSubmitting.value = true;
  
  try {
    // Émettre l'événement vers le parent avec l'email
    emit('subscription', email.value);
    
    // Reset du formulaire
    email.value = '';
  } catch (error) {
    console.error('Erreur lors de la soumission du formulaire:', error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
/* Styles pour la section Newsletter */
.newsletter-bg {
  position: relative;
  overflow: hidden;
  width: 100vw;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
}

.newsletter-bg .v-container {
  width: 1008px; /* Largeur pour la section newsletter */
  background-color: #471C18 !important;
  border: 1px;
  border-radius: 56px;
  padding: 56px;
  height: 427px;
}

.main-content {
  width: 562px;
}

.newsletter-icons {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  width: 223px;
  height: 40px;
}

.newsletter-title {
  font-size: 30px !important;
  font-weight: 600 !important;
  line-height: 1.4 !important;
  color: white !important;
}

.newsletter-description {
  font-size: 16px !important;
  line-height: 1.6 !important;
  color: rgba(255, 255, 255, 0.9) !important;
  margin-bottom: 16px !important;
}

.newsletter-content-2 {
  width: 334px;
  transform: rotate(-2deg);
  transition: transform 0.3s ease;
  position: relative;
  left: 73px;
}

.newsletter-content-2:hover {
  transform: rotate(3deg) scale(1.05);
}

/* section newsletter */
.newsletter-form-wrapper {
  background-color: rgb(var(--v-theme-white));
  border-radius: 18px;
  display: flex;
  align-items: center;
  width: 89%;
  height: 48px;
  padding: 8px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.newsletter-form-centered {
  width: 100%;
}

.newsletter-input-group {
  gap: 40px !important;
  align-items: center;
}

.newsletter-input {
  flex: 1;
  min-width: 280px;
}

.newsletter-input :deep(.v-field) {
  background-color: rgba(255, 255, 255, 0.95) !important;
  border-radius: 25px !important;
  border: none !important;
  height: 36px !important;
  align-items: center;
  display: flex;
}

.newsletter-input :deep(.v-field__input) {
  padding: 12px 24px !important;
  font-size: 16px !important;
}

.newsletter-input :deep(input::placeholder) {
  color: rgba(0, 0, 0, 0.6) !important;
}

.newsletter-submit-btn {
  border-radius: 12px !important;
  height: 36px !important;
  font-weight: 600 !important;
  font-size: 16px !important;
  text-transform: none !important;
  background-color: rgb(var(--v-theme-accent)) !important;
  color: white !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
  transition: all 0.3s ease !important;
  min-width: 140px;
}

.newsletter-submit-btn:hover {
  transform: translate(-2px) !important;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25) !important;
}

/* Responsive pour la newsletter */
@media (max-width: 1024px) {
  .newsletter-bg .v-container {
    width: 90%;
    height: auto;
  }
  
  .newsletter-bg .d-flex {
    flex-direction: column;
    gap: 40px !important;
    text-align: center;
  }
  
  .main-content {
    width: 100%;
  }
  
  .newsletter-content-2 {
    width: 280px;
    height: 280px;
    left: 0;
  }
}

@media (max-width: 768px) {
  .newsletter-title {
    font-size: 32px !important;
  }
  
  .newsletter-description {
    font-size: 16px !important;
  }
  
  .newsletter-input-group {
    flex-direction: column;
    gap: 16px;
    max-width: 100%;
  }
  
  .newsletter-input {
    min-width: 100%;
  }
  
  .newsletter-submit-btn {
    width: 100% !important;
    min-width: auto;
  }
  
  .newsletter-form-wrapper {
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
  }
}

@media (max-width: 480px) {
  .newsletter-title {
    font-size: 28px !important;
  }
  
  .newsletter-icons {
    justify-content: center;
    width: 100%;
  }
  
  .newsletter-content-2 {
    width: 240px;
    height: 240px;
  }
}
</style>