import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prepararRevelados } from "./revelados";
import { leerTokensDeMovimiento } from "./tokens";

/*
    Coreografía: el movimiento que depende de JavaScript (GSAP). Este módulo y los que importa van
    en un chunk aparte que se descarga en reposo, después de pintar la página, y nunca si el
    usuario prefiere movimiento reducido. La web funciona entera sin él. El scroll es el nativo.
*/

gsap.registerPlugin(CustomEase, ScrollTrigger);

export interface Coreografia {
    /** Prepara las animaciones de la página que hay en pantalla. Se llama tras cada navegación. */
    prepararPagina(): void;
    /** Apaga todo y deja la página como si este código no se hubiera cargado. */
    destruir(): void;
}

/**
 * Devuelve el control de las animaciones de página, que se rehacen en cada navegación.
 */
export function crearCoreografia(): Coreografia {
    const tokens = leerTokensDeMovimiento();
    let contextoDePagina: gsap.Context | undefined;

    // Marca en el documento que el movimiento está activo (lo usan los tests).
    document.documentElement.dataset.movimiento = "";

    /**
     * Deshace las animaciones de la página anterior y crea las de la actual. El contexto de GSAP
     * recuerda todo lo creado dentro para poder revertirlo de una vez.
     */
    function prepararPagina() {
        contextoDePagina?.revert();
        contextoDePagina = gsap.context(() => prepararRevelados(tokens));
    }

    function destruir() {
        contextoDePagina?.revert();
        delete document.documentElement.dataset.movimiento;
    }

    // Cuando termina de cargar la fuente cambian las medidas del texto: se recalculan los disparadores.
    document.fonts.ready.then(() => ScrollTrigger.refresh());

    return { prepararPagina, destruir };
}
