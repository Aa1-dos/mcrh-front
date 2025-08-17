<template>
    <v-form @submit.prevent="handleLogin">
        <v-row class="d-flex mb-3">
            <v-col cols="12">
                <v-text-field v-model="form.email" label="Email" :rules="[v => !!v || 'Email requis']"
                    variant="outlined" density="compact" type="email" hide-details color="primary" autocomplete="email"
                    required></v-text-field>
            </v-col>
            <v-col cols="12">
                <v-text-field v-model="form.password" label="Mot de passe" :rules="[v => !!v || 'Mot de passe requis']"
                    :type="show ? 'text' : 'password'" :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append-inner="show = !show" variant="outlined" density="compact" hide-details color="primary"
                    autocomplete="current-password" required></v-text-field>
            </v-col>
            <v-col cols="12" class="pt-0">
                <div class="d-flex flex-wrap align-center">
                    <v-checkbox v-model="form.remember" label="Se souvenir de moi" color="primary" hide-details>
                        <template v-slot:label class="text-body-1">Se souvenir de moi</template>
                    </v-checkbox>
                    <div class="ml-sm-auto">
                        <RouterLink to="/"
                            class="text-primary text-decoration-none text-body-1 opacity-1 font-weight-medium">Mot de
                            passe
                            oublié ?</RouterLink>
                    </div>
                </div>
            </v-col>
            <v-col cols="12" class="pt-0">
                <v-btn type="submit" block :loading="loading" rounded="md" color="primary" size="large" flat>Se
                    connecter</v-btn>
            </v-col>
        </v-row>
    </v-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/AuthStore';
import { useRouter } from 'vue-router';
import { useNotification } from '@/composables/useNotification';

const authStore = useAuthStore();
const router = useRouter();
const { showSuccess, showError } = useNotification();

const loading = ref(false);
const show = ref(false); // Controls password visibility
const form = ref({
    email: '',
    password: '',
    remember: false //
});

const validateForm = () => {
    // Validation logic
    if (!form.value.email || !form.value.password) {
        showError('Veuillez remplir tous les champs');
        return false;
    }
    return true;
};

const handleLogin = async () => {
    if (!validateForm()) return;

    loading.value = true;
    try {
        const result = await authStore.login({
            email: form.value.email,
            password: form.value.password
        });

        console.log('Login response:', result);

        if (result.success) {
            showSuccess('Connexion réussie');
            // Rediriger vers la page d'accueil une fois que le store a été mis à jour
            router.replace('/');
        } else {
            showError(result.error || 'Erreur de connexion');
        }
    } catch (error) {
        console.error('Erreur login:', error);
        showError('Une erreur est survenue');
    } finally {
        loading.value = false;
    }
};
</script>
