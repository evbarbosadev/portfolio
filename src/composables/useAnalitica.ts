import { useHead } from "@unhead/vue";

/**
 * Punto de integración para analítica respetuosa, sin cookies (Plausible o Umami). Está apagado:
 * solo se activa si se define VITE_ANALITICA_SCRIPT en el entorno. Con la variable vacía, el build
 * elimina este código y no se carga nada.
 *
 * Al activarlo hay que añadir el dominio del script a script-src y connect-src en firebase.json.
 * Plausible lee data-domain; para Umami se cambia ese atributo por data-website-id.
 */
export function useAnalitica() {
    if (!import.meta.env.VITE_ANALITICA_SCRIPT) {
        return;
    }

    useHead({
        script: [
            {
                src: import.meta.env.VITE_ANALITICA_SCRIPT,
                defer: true,
                "data-domain": import.meta.env.VITE_ANALITICA_DOMINIO,
            },
        ],
    });
}
