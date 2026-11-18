import { traducir, type ClaveDeTexto } from "@/idiomas";
import { useIdioma } from "./useIdioma";

/**
 * Textos de la interfaz en el idioma de la página actual. Como el idioma sale de la ruta,
 * las plantillas se actualizan solas al cambiar de idioma.
 */
export function useTextos() {
    const { idioma } = useIdioma();

    /**
     * Devuelve el texto de una clave del diccionario, por ejemplo t("navegacion.inicio").
     */
    function t(clave: ClaveDeTexto): string {
        return traducir(idioma.value, clave);
    }

    return { t };
}
