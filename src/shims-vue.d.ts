// Permettre à TypeScript de reconnaître les fichiers .vue comme des modules. Grâce à ce fichier, vous pouvez écrire par exemple `import MyComponent from './MyComponent.vue'` sans erreur de type dans un projet TypeScript.
declare module '*.vue' {
    import { DefineComponent } from 'vue';
    const component: DefineComponent<{}, {}, any>;
    export default component;
}
