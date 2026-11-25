import { useHead } from "@unhead/vue";

/**
 * Analítica con Umami Cloud: sin cookies y sin guardar la IP, así que no hace falta banner. Solo se
 * activa si están definidas VITE_ANALITICA_SCRIPT y VITE_ANALITICA_ID; si falta alguna, el build
 * elimina este código y no se carga nada.
 *
 * - data-domains: solo cuenta las visitas al dominio público, no las de localhost ni las del túnel.
 * - data-do-not-track: respeta la preferencia «no rastrear» del navegador.
 *
 * El dominio del script y el de envío están en script-src y connect-src de firebase.json.
 */
export function useAnalitica() {
    if (!import.meta.env.VITE_ANALITICA_SCRIPT || !import.meta.env.VITE_ANALITICA_ID) {
        return;
    }

    useHead({
        script: [
            {
                src: import.meta.env.VITE_ANALITICA_SCRIPT,
                defer: true,
                "data-website-id": import.meta.env.VITE_ANALITICA_ID,
                "data-domains": new URL(import.meta.env.VITE_URL_SITIO).hostname,
                "data-do-not-track": "true",
            },
        ],
    });
}
