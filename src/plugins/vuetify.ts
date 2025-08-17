import { createVuetify } from 'vuetify';
import '@mdi/font/css/materialdesignicons.css';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { BLUE_THEME } from '@/theme/LightTheme';

const messages = {
    fr: {
        $vuetify: {
            save: 'Enregistrer',
            cancel: 'Annuler',
            confirm: 'Confirmer',
            loarding: 'Chargement'
        }
    },
    en: {
        $vuetify: {
            save: 'Save',
            cancel: 'Cancel',
            confirm: 'Confirm',
            loading: 'Loading'
        }
    }
};

export default createVuetify({
    components,
    directives,

    theme: {
        defaultTheme: 'BLUE_THEME',
        themes: {
            BLUE_THEME
        }
    },
    defaults: {
        VCard: {
            rounded: 'xl'
        },
        VTextField: {
            variant: 'outlined',
            density: 'comfortable'
            //color: 'primary'
        },
        VTextarea: {
            variant: 'outlined',
            density: 'comfortable',
            color: 'primary'
        },
        VSelect: {
            variant: 'outlined',
            density: 'comfortable',
            color: 'primary'
        }
    },
    locale: {
        locale: 'fr',
        messages
    }
});
