import type { Router } from "vue-router";

/*
    Transiciones entre páginas con la View Transitions API del navegador. No necesita librerías:
    el navegador captura la página vieja y la nueva y las funde; los estilos están en base.css.
    Donde la API no existe, la navegación es directa.
*/

/**
 * Envuelve cada cambio de página en una transición de vista.
 */
export function activarTransicionesDePagina(router: Router) {
    if (!("startViewTransition" in document)) {
        return;
    }

    let terminarTransicion: (() => void) | undefined;

    router.beforeResolve((destino, origen) => {
        const esPrimeraCarga = origen.matched.length === 0;

        // Saltar a un ancla de la misma página no es un cambio de página.
        if (esPrimeraCarga || destino.path === origen.path) {
            return undefined;
        }

        /*
            El navegador captura la página vieja, llama a la función y espera a su promesa para
            capturar la nueva. La navegación continúa dentro de esa función, y la promesa se
            resuelve cuando el router ya ha pintado la página nueva y ha colocado el scroll.
        */
        return new Promise<void>((continuarNavegacion) => {
            const paginaNuevaLista = new Promise<void>((resolver) => {
                terminarTransicion = resolver;
            });

            document.startViewTransition(() => {
                continuarNavegacion();

                return paginaNuevaLista;
            });
        });
    });

    router.afterEach(() => {
        // setTimeout y no nextTick: el router coloca el scroll un instante después de este aviso.
        setTimeout(() => {
            terminarTransicion?.();
            terminarTransicion = undefined;
        });
    });
}
