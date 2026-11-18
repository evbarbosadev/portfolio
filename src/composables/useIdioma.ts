import { computed } from "vue";
import { useRoute } from "vue-router";
import { IDIOMA_POR_DEFECTO, type Idioma } from "@/constantes";
import { getRutaEquivalente, getRutaInicio } from "@/rutas";

/**
 * Idioma de la página actual (lo marca la ruta) y enlaces que dependen de él.
 */
export function useIdioma() {
    const ruta = useRoute();

    const idioma = computed<Idioma>(() => ruta.meta.idioma ?? IDIOMA_POR_DEFECTO);
    const otroIdioma = computed<Idioma>(() => (idioma.value === "es" ? "en" : "es"));
    const rutaInicio = computed(() => getRutaInicio(idioma.value));
    const rutaEnOtroIdioma = computed(() => getRutaEquivalente(ruta, otroIdioma.value));

    return { idioma, otroIdioma, rutaInicio, rutaEnOtroIdioma };
}
