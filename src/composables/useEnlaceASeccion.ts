import { useRoute, useRouter } from "vue-router";
import { getRutaSeccion } from "@/rutas";
import { esClicEspecial, mostrarAncla } from "@/utilidades/anclas";
import { useIdioma } from "./useIdioma";

/**
 * Enlaces a las secciones de la página principal. El href lleva el ancla (/#proyectos), así
 * funcionan sin JavaScript. Con él, en la página principal se baja a la sección sin cambiar la
 * URL; desde otra página se navega con el ancla y App.vue la limpia al llegar.
 */
export function useEnlaceASeccion() {
    const ruta = useRoute();
    const router = useRouter();
    const { idioma, rutaInicio } = useIdioma();

    function getHrefDeSeccion(ancla: string): string {
        return getRutaSeccion(idioma.value, ancla);
    }

    /**
     * Resuelve el clic en un enlace a una sección.
     */
    function irASeccion(evento: MouseEvent, ancla: string) {
        if (esClicEspecial(evento)) {
            return;
        }

        evento.preventDefault();

        if (ruta.path === rutaInicio.value) {
            mostrarAncla(ancla);
        } else {
            router.push(getHrefDeSeccion(ancla));
        }
    }

    return { getHrefDeSeccion, irASeccion };
}
