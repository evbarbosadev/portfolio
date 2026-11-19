import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { TokensDeMovimiento } from "./tokens";

/*
    Revelados al hacer scroll. Los elementos se marcan en las plantillas con data-revelar y aquí
    se les da su entrada, según las reglas de movimiento de la marca:
    - "bloque": todo lo que no es una imagen de proyecto (títulos, textos, fichas, fotos). Llega
      desde el fondo: aparece desenfocado y se enfoca en 480 ms, sin moverse de su sitio.
    - "imagen": imágenes de proyecto. Momento cinematográfico: el mismo gesto, más marcado y en
      1 s. El marco no cambia de tamaño ni de sitio.
    Es el mismo gesto con el que aparecen las letras del lema del hero (decisión 19).
*/

// El elemento empieza a revelarse cuando su borde superior cruza el 88 % de la altura de la ventana.
const INICIO_DE_REVELADO = "top 88%";
// Separación, en segundos, entre un elemento y el siguiente cuando entran en grupo.
const ESCALONADO = 0.06;
// Desenfoque del que parte cada tipo al aparecer: más en las imágenes, que son más grandes.
const DESENFOQUE_DE_BLOQUE = "blur(6px)";
const DESENFOQUE_DE_IMAGEN = "blur(16px)";

/**
 * Busca los elementos de un tipo que quedan por debajo de la ventana. Solo esos se ocultan para
 * revelarse después: lo que ya está a la vista no se toca, así nada parpadea cuando llega este código.
 */
function buscarPorRevelar(tipo: string): HTMLElement[] {
    return gsap.utils
        .toArray<HTMLElement>(`[data-revelar="${tipo}"]`)
        .filter((elemento) => elemento.getBoundingClientRect().top > window.innerHeight);
}

/**
 * Bloques: aparecen desenfocados y se enfocan. Los que entran a la vez lo hacen escalonados.
 */
function revelarBloques(tokens: TokensDeMovimiento) {
    const bloques = buscarPorRevelar("bloque");

    // En una página sin bloques por revelar no hay nada que preparar.
    if (bloques.length === 0) {
        return;
    }

    gsap.set(bloques, { opacity: 0, filter: DESENFOQUE_DE_BLOQUE });

    ScrollTrigger.batch(bloques, {
        start: INICIO_DE_REVELADO,
        once: true,
        onEnter: (lote) => {
            gsap.to(lote, {
                opacity: 1,
                filter: "blur(0px)",
                duration: tokens.media,
                ease: tokens.salida,
                stagger: ESCALONADO,
                clearProps: "opacity,filter",
            });
        },
    });
}

/**
 * Imágenes de proyecto: aparecen desenfocadas y se enfocan, con la curva cinematográfica.
 */
function revelarImagenes(tokens: TokensDeMovimiento) {
    for (const marco of buscarPorRevelar("imagen")) {
        gsap.fromTo(
            marco,
            { opacity: 0, filter: DESENFOQUE_DE_IMAGEN },
            {
                opacity: 1,
                filter: "blur(0px)",
                duration: tokens.larga,
                ease: tokens.cine,
                scrollTrigger: { trigger: marco, start: INICIO_DE_REVELADO, once: true },
                clearProps: "opacity,filter",
            },
        );
    }
}

/**
 * Prepara todos los revelados de la página actual. Las animaciones las deshace el contexto de
 * GSAP desde donde se llama.
 */
export function prepararRevelados(tokens: TokensDeMovimiento) {
    revelarBloques(tokens);
    revelarImagenes(tokens);
}
