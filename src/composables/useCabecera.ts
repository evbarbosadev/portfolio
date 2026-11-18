import { useHead, useSeoMeta } from "@unhead/vue";
import { computed } from "vue";
import { IDIOMA_POR_DEFECTO, type Idioma } from "@/constantes";
import { sitio } from "@/contenido/sitio";
import { ALTO_OG, ANCHO_OG, getRutaImagenOg } from "@/utilidades/imagenesOg";
import { useIdioma } from "./useIdioma";

// URL pública del sitio, sin barra final. Viene de la variable VITE_URL_SITIO (ver .env).
const URL_SITIO = import.meta.env.VITE_URL_SITIO.replace(/\/$/, "");

const LOCALE_DE_OG: Record<Idioma, string> = {
    es: "es_ES",
    en: "en_US",
};

export interface OpcionesDeCabecera {
    /** Título de la página, sin el nombre del sitio. */
    titulo: string;
    descripcion: string;
    /** Ruta de esta página en cada idioma en el que existe. De aquí salen canonical y hreflang. */
    rutas: Partial<Record<Idioma, string>>;
    /** Clave de la imagen Open Graph: "inicio" o el id de un proyecto. */
    claveImagenOg: string;
    tipo?: "website" | "article";
    /** Bloques JSON-LD de la página. */
    datosEstructurados?: object[];
    /** Las páginas que no deben salir en buscadores (la 404) lo desactivan. */
    hayQueIndexar?: boolean;
}

/**
 * Convierte una ruta del sitio en una URL absoluta.
 */
export function getUrlAbsoluta(ruta: string): string {
    return `${URL_SITIO}${ruta}`;
}

/**
 * Etiquetas <head> de una página: título, descripción, canonical, hreflang, Open Graph,
 * Twitter Cards y datos estructurados. Recibe una función para que todo se recalcule al cambiar
 * de ruta sin desmontar la página (por ejemplo, de un proyecto a otro).
 */
export function useCabecera(getOpciones: () => OpcionesDeCabecera) {
    const { idioma } = useIdioma();
    const opciones = computed(getOpciones);
    const nombre = sitio.nombreEnLineas.join(" ");

    const titulo = computed(() => `${opciones.value.titulo} — ${nombre}`);
    const urlPagina = computed(() => getUrlAbsoluta(opciones.value.rutas[idioma.value] ?? "/"));
    const urlImagen = computed(() =>
        getUrlAbsoluta(getRutaImagenOg(opciones.value.claveImagenOg, idioma.value)),
    );

    useSeoMeta({
        title: titulo,
        description: () => opciones.value.descripcion,
        robots: () => (opciones.value.hayQueIndexar === false ? "noindex" : "index, follow"),
        ogTitle: titulo,
        ogDescription: () => opciones.value.descripcion,
        ogType: () => opciones.value.tipo ?? "website",
        ogUrl: urlPagina,
        ogSiteName: nombre,
        ogLocale: () => LOCALE_DE_OG[idioma.value],
        ogImage: urlImagen,
        ogImageWidth: ANCHO_OG,
        ogImageHeight: ALTO_OG,
        ogImageAlt: titulo,
        twitterCard: "summary_large_image",
        twitterTitle: titulo,
        twitterDescription: () => opciones.value.descripcion,
        twitterImage: urlImagen,
    });

    useHead({
        link: () => {
            const rutas = opciones.value.rutas;
            const idiomas = Object.keys(rutas) as Idioma[];

            // Sin ruta propia no hay canonical ni hreflang (es el caso de la 404).
            if (idiomas.length === 0) {
                return [];
            }

            return [
                { rel: "canonical", href: urlPagina.value },
                ...idiomas.map((otroIdioma) => ({
                    rel: "alternate",
                    hreflang: otroIdioma,
                    href: getUrlAbsoluta(rutas[otroIdioma] ?? "/"),
                })),
                // x-default: la versión que se ofrece a quien no habla ninguno de los idiomas.
                {
                    rel: "alternate",
                    hreflang: "x-default",
                    href: getUrlAbsoluta(
                        rutas[IDIOMA_POR_DEFECTO] ?? rutas[idiomas[0] as Idioma] ?? "/",
                    ),
                },
            ];
        },
        script: () =>
            (opciones.value.datosEstructurados ?? []).map((datos) => ({
                type: "application/ld+json",
                innerHTML: JSON.stringify(datos),
            })),
    });
}
