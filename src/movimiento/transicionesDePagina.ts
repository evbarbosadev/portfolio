import type { RouteLocationNormalized, Router } from "vue-router";
import { IDIOMA_POR_DEFECTO } from "@/constantes";

/*
    Transiciones entre páginas con la View Transitions API del navegador. No necesita librerías:
    el navegador captura la página vieja y la nueva y las funde; los estilos están en base.css.
    Donde la API no existe, la navegación es directa.
    Hay dos clases de cambio (MOV-9): ir a otra página entra desde el fondo, con desenfoque; cambiar
    de idioma deja la página en su sitio y solo funde el texto, sin desenfoque. <html> lleva
    data-transicion="idioma" mientras dura el segundo, y base.css elige la animación por él.
*/

/**
 * Marca en <html> qué clase de transición está en curso, o la quita.
 */
export function marcarTransicion(tipo: "idioma" | "tema" | undefined) {
    if (tipo) {
        document.documentElement.dataset.transicion = tipo;
    } else {
        delete document.documentElement.dataset.transicion;
    }
}

/**
 * Dice si una navegación solo cambia el idioma: la página es la misma, en el otro idioma.
 */
export function esCambioDeIdioma(
    destino: RouteLocationNormalized,
    origen: RouteLocationNormalized,
) {
    const idiomaDeOrigen = origen.meta.idioma ?? IDIOMA_POR_DEFECTO;
    const idiomaDeDestino = destino.meta.idioma ?? IDIOMA_POR_DEFECTO;

    return origen.matched.length > 0 && idiomaDeOrigen !== idiomaDeDestino;
}

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

            marcarTransicion(esCambioDeIdioma(destino, origen) ? "idioma" : undefined);

            const transicion = document.startViewTransition(() => {
                continuarNavegacion();

                return paginaNuevaLista;
            });

            transicion.finished.finally(() => marcarTransicion(undefined));
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
