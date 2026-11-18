/*
    Nombres de las imágenes Open Graph. Los comparten la cabecera de cada página (que enlaza la
    imagen) y el generador del build (plugins/imagenesOg.ts, que la crea), para que no se desajusten.
*/

export const CARPETA_OG = "og";
export const ANCHO_OG = 1200;
export const ALTO_OG = 630;

/**
 * Devuelve la ruta pública de la imagen OG de una página. La clave es "inicio" para la página
 * principal o el id del proyecto para un caso de estudio.
 */
export function getRutaImagenOg(clave: string, idioma: string): string {
    return `/${CARPETA_OG}/${clave}-${idioma}.png`;
}
