import type { ThemeTypes } from '@/types/themeTypes/ThemeType';

const BLUE_THEME: ThemeTypes = {
    name: 'BLUE_THEME', // Nom du thème 
    dark: false, // Elle permet de savoir si le thème est sombre ou clair
    variables: { 
        'border-color': '#e0e6eb',
        'border-opacity': 1
    },
    colors: {
        // Nouvelle palette de couleurs
        primary: '#002444',       // Bleu nuit
        secondary: '#549445',     // Vert olive doux
        accent: '#FF6D5F',        // Rouge corail
        white: '#FFFFFF',         // Blanc
        platinum: '#F4F4F5',      // Platinum
        
        // Couleurs d'état 
        info: '#002444',          // Bleu nuit pour les infos
        success: '#549445',       // Vert olive doux pour les succès
        warning: '#FF6D5F',       // Rouge corail pour les avertissements
        error: '#FF6D5F',         // Rouge corail pour les erreurs
        
        // Variations de luminosité
        lightprimary: '#335973',   // Version plus claire du Bleu nuit
        lightsecondary: '#7DAD71', // Version plus claire du Vert olive
        lightaccent: '#FFACA3',    // Version plus claire du Rouge corail
        
        // Couleurs de texte
        textPrimary: '#002444',    // Texte principal en Bleu nuit
        textSecondary: '#549445',  // Texte secondaire en Vert olive
        
        // Couleurs de fond et bordures
        borderColor: '#F4F4F5',    // Bordures en Platinum
        containerBg: '#FFFFFF',    // Fond de conteneur en Blanc
        background: '#FFFFFF',     // Fond général en Blanc
        hoverColor: '#F4F4F5',     // Couleur de survol en Platinum
        surface: '#FFFFFF',        // Surface en Blanc
        
        // Nuances de gris
        grey100: '#F4F4F5',        // Platinum comme gris clair
        grey200: '#002444',        // Bleu nuit comme gris foncé
        light: '#F4F4F5',          // Lumière en Platinum
        muted: '#7b8893',          // Gardé la même valeur pour le texte discret
    }
};



export { BLUE_THEME};
