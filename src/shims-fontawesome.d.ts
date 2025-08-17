declare module '@fortawesome/vue-fontawesome' {
  import { DefineComponent } from 'vue';
  export const FontAwesomeIcon: DefineComponent<any, any, any>;
}

declare module '@fortawesome/fontawesome-svg-core' {
  export const library: {
    add(...icons: any[]): void;
  };
}

declare module '@fortawesome/free-brands-svg-icons' {
  export const faFacebookF: any;
  export const faXTwitter: any;
  export const faLinkedinIn: any;
  export const faInstagram: any;
  export const faYoutube: any;
  export const faGoogle: any;
  export const faPinterest: any;
  export const faWhatsapp: any;
  export const faTiktok: any;
}

declare module '@fortawesome/free-solid-svg-icons' {
  export const faEnvelope: any;
  export const faShareNodes: any;
}
