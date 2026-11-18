import type { Foto } from "./esquemas";

/**
 * Fotos de la galería. Cada archivo vive en src/contenido/fotografia/ y lleva su texto alternativo
 * en los dos idiomas. Una foto sin archivo está pendiente: la web pinta su hueco con una etiqueta.
 */
export const fotos: Foto[] = [
    {
        alt: {
            es: "[POR RELLENAR: descripción de la foto 1]",
            en: "[POR RELLENAR: descripción de la foto 1, en inglés]",
        },
    },
    {
        alt: {
            es: "[POR RELLENAR: descripción de la foto 2]",
            en: "[POR RELLENAR: descripción de la foto 2, en inglés]",
        },
    },
    {
        alt: {
            es: "[POR RELLENAR: descripción de la foto 3]",
            en: "[POR RELLENAR: descripción de la foto 3, en inglés]",
        },
    },
    {
        alt: {
            es: "[POR RELLENAR: descripción de la foto 4]",
            en: "[POR RELLENAR: descripción de la foto 4, en inglés]",
        },
    },
];
