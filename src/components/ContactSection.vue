<template>
  <section id="contact-section" class="mb-16 pt-8">
    <v-container class="nav-container">
      <v-row align="center" justify="center" class="contact-container">
        <!-- Colonne gauche : Texte + Illustration -->
        <v-col cols="12" md="5" lg="5" class="contact-intro md-10">
          <h2 class="contact-title text-primary mb-6">
            {{ title }}
            <span v-if="showDecorativeTitle">
              <span class="contact-title-underline">
                <span class="contact-title-text">{{ decorativeText }}</span>
                <img
                  :src="decorativeImage"
                  class="contact-accent"
                  alt=""
                  style="width:137px; height:18px; opacity:1; transform: rotate(0deg); display: block; margin: auto;"
                />
              </span>
            </span>
          </h2>
          <p class="contact-description mb-4">{{ introText }}</p>
          <p class="contact-subdescription mb-8">{{ descriptionText }}</p>
          <div class="contact-illustration">
            <img :src="mainIllustration" alt="Contact illustration" />
            <img :src="secondaryIllustration" alt="Secondary illustration" v-if="secondaryIllustration" />
          </div>
        </v-col>

        <!-- Colonne droite : Formulaire -->
        <v-col cols="12" md="7" lg="6" class="contact-form-container">
          <div class="contact-form-wrapper pa-8">
            <h3 class="contact-form-title text-primary mb-4">{{ formTitle }}</h3>
            <p class="contact-form-subtitle text-grey-darken-1 mb-8">{{ formSubtitle }}</p>
            
            <v-form @submit.prevent="handleSubmit" class="contact-form">
              <v-text-field
                v-model="name"
                :placeholder="namePlaceholder"
                variant="outlined"
                density="comfortable"
                hide-details
                class="contact-input mb-4"
                :rules="[nameRule]"
              />
              <v-text-field
                v-model="email"
                :placeholder="emailPlaceholder"
                variant="outlined"
                density="comfortable"
                hide-details
                class="contact-input mb-4"
                :rules="[emailRule]"
              />
              <v-text-field
                v-model="subject"
                :placeholder="subjectPlaceholder"
                variant="outlined"
                density="comfortable"
                hide-details
                class="contact-input mb-4"
              />
              <v-textarea
                v-model="message"
                :placeholder="messagePlaceholder"
                variant="outlined"
                density="comfortable"
                hide-details
                class="contact-input mb-6"
                :rules="[messageRule]"
                rows="10"
                style="min-height: 180px;"
              />
              <div class="outline-btn-wrapper">
                <v-btn
                  type="submit"
                  color="accent"
                  class="contact-submit-btn"
                  block
                  :loading="isSubmitting"
                  elevation="0"
                >
                  {{ submitButtonText }}
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
  // Textes de la partie gauche
  title: {
    type: String,
    default: 'Vous avez des'
  },
  showDecorativeTitle: {
    type: Boolean,
    default: true
  },
  decorativeText: {
    type: String,
    default: 'questions?'
  },
  decorativeImage: {
    type: String,
    required: true
  },
  introText: {
    type: String,
    default: 'Nous sommes là pour vous aider.'
  },
  descriptionText: {
    type: String,
    default: 'Que ce soit une demande d\'information, un besoin d\'assistance ou une collaboration à proposer, n\'hésitez pas à nous écrire.'
  },
  
  // Images
  mainIllustration: {
    type: String,
    required: true
  },
  secondaryIllustration: {
    type: String,
    default: ''
  },
  
  // Textes du formulaire
  formTitle: {
    type: String,
    default: 'Remplissez le formulaire ci-dessous'
  },
  formSubtitle: {
    type: String,
    default: 'Nous vous répondrons dans les plus brefs délais.'
  },
  namePlaceholder: {
    type: String,
    default: 'Nom complet'
  },
  emailPlaceholder: {
    type: String,
    default: 'Adresse Email'
  },
  subjectPlaceholder: {
    type: String,
    default: 'Sujet'
  },
  messagePlaceholder: {
    type: String,
    default: 'Message'
  },
  submitButtonText: {
    type: String,
    default: 'Envoyer'
  }
});

// Variables pour le formulaire
const name = ref('');
const email = ref('');
const subject = ref('');
const message = ref('');
const isSubmitting = ref(false);

// Règles de validation
const nameRule = (value: string) => {
  if (!value) return 'Le nom est requis';
  return true;
};

const emailRule = (value: string) => {
  if (!value) return 'L\'email est requis';
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(value) || 'Veuillez entrer un email valide';
};

const messageRule = (value: string) => {
  if (!value) return 'Le message est requis';
  if (value.length < 10) return 'Le message doit comporter au moins 10 caractères';
  return true;
};

// Émissions pour communiquer avec le composant parent
const emit = defineEmits(['submit']);

// Fonction pour gérer la soumission du formulaire
const handleSubmit = async () => {
  if (!name.value || !email.value || !message.value || 
      nameRule(name.value) !== true || 
      emailRule(email.value) !== true ||
      messageRule(message.value) !== true) {
    return;
  }
  
  isSubmitting.value = true;
  
  try {
    // Émettre l'événement vers le parent avec les données du formulaire
    emit('submit', {
      name: name.value,
      email: email.value,
      subject: subject.value,
      message: message.value
    });
    
    // Reset du formulaire
    name.value = '';
    email.value = '';
    subject.value = '';
    message.value = '';
  } catch (error) {
    console.error('Erreur lors de la soumission du formulaire:', error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
/* Styles pour la section contact */
.contact-container {
    margin: 0 auto;
    gap: 24px;
}

.contact-title {
  font-size: 42px !important;
  font-weight: 600 !important;
  line-height: 1.2 !important;
  color: rgb(var(--v-theme-primary)) !important;
}

.contact-accent.img::after {
  content: "";
  position: absolute;
  bottom: 3px;
  left: 0;
  width: 100%;
  height: 12px;
  background-color: rgba(var(--v-theme-accent), 0.3);
  z-index: -1;
  border-radius: 10px;
}

.contact-description {
  font-size: 16px !important;
  font-weight: 500 !important;
  margin-bottom: 16px !important;
}

.contact-subdescription {
  font-size: 16px !important;
  line-height: 1.6 !important;
  color: rgba(0, 0, 0, 0.7) !important;
}

.contact-illustration img:first-child {
    width: 340px;
    height: 397px;
    opacity: 1;
    margin-top: 40px;
}

.contact-illustration img:last-child {
    height: 40px;
    opacity: 1;
    position: relative;
    bottom: 326px;
}

.contact-form-container {
  position: relative;
}

.contact-form-wrapper {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  height: 701px;
}

.contact-form-title {
  font-size: 28px !important;
  font-weight: 600 !important;
}

.contact-form-subtitle {
  font-size: 15px !important;
}

.contact-input {
  margin-bottom: 24px !important;
}

.contact-input :deep(.v-field) {
  border-radius: 8px !important;
  background-color: #F8F9FA !important;
}

.outline-btn-wrapper {
    border: 1px solid rgb(var(--v-theme-accent)) !important;
    border-radius: 24px !important;
    box-sizing: border-box;
    padding: 6px !important;
}

.contact-submit-btn {
  color: white !important;
  font-weight: 600 !important;
  /* border-radius: 18px !important; */
  height: 36px !important;
  font-size: 14px !important;
  text-transform: none !important;
  transition: all 0.3s ease !important;
}

.contact-submit-btn:hover {
    transform: translate(-2px) !important;
    
}

@media (max-width: 960px) {
  .contact-illustration {
    max-width: 260px;
    margin: 20px auto;
  }
  
  .contact-intro {
    text-align: center;
    margin-bottom: 40px;
  }
  
  .contact-subdescription {
    max-width: 100%;
  }
}
</style>