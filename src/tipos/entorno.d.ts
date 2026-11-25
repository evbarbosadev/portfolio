import "vue-router";
import type { Idioma } from "@/constantes";

declare global {
    interface ImportMetaEnv {
        /** URL pública del sitio, sin barra final. */
        readonly VITE_URL_SITIO: string;
        /** URL del script de analítica. Vacío = desactivada. */
        readonly VITE_ANALITICA_SCRIPT: string;
        /** ID del sitio en Umami (data-website-id). Vacío = desactivada. */
        readonly VITE_ANALITICA_ID: string;
    }
}

declare module "vue-router" {
    interface RouteMeta {
        /** Idioma de la página. Las rutas sin idioma (la 404) usan el idioma por defecto. */
        idioma?: Idioma;
    }
}
