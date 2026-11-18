import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { TokensDeMovimiento } from "./tokens";

/*
    Revelados al hacer scroll. Los elementos se marcan en las plantillas con data-revelar y aquí
    se les da su entrada, según las reglas de movimiento de la marca:
    - "bloque": todo lo que no es una imagen de proyecto (títulos, textos, fichas, fotos). Fundido
      con 8 px de desplazamiento en 480 ms.
    - "imagen": imágenes de proyecto. Momento cinematográfico: se descubren con un recorte de
      abajo arriba en 1 s. El marco no cambia de tamaño.
*/

// El elemento empieza a revelarse cuando su borde superior cruza el 88 % de la altura de la ventana.
const INICIO_DE_REVELADO = "top 88%";
// Separación, en segundos, entre un elemento y el siguiente cuando entran en grupo.
const ESCALONADO = 0.06;
// Distancia en píxeles que sube un bloque al aparecer.
const DESPLAZAMIENTO_DE_BLOQUE = 8;

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
 * Bloques: aparecen subiendo 8 px. Los que entran a la vez lo hacen escalonados.
 */
function revelarBloques(tokens: TokensDeMovimiento) {
    const bloques = buscarPorRevelar("bloque");

    // En una página sin bloques por revelar no hay nada que preparar.
    if (bloques.length === 0) {
        return;
    }

    gsap.set(bloques, { opacity: 0, y: DESPLAZAMIENTO_DE_BLOQUE });

    ScrollTrigger.batch(bloques, {
        start: INICIO_DE_REVELADO,
        once: true,
        onEnter: (lote) => {
            gsap.to(lote, {
                opacity: 1,
                y: 0,
                duration: tokens.media,
                ease: tokens.salida,
                stagger: ESCALONADO,
                clearProps: "opacity,transform",
            });
        },
    });
}

/**
 * Imágenes de proyecto: el marco recorta la imagen y la va descubriendo de abajo arriba.
 */
function revelarImagenes(tokens: TokensDeMovimiento) {
    for (const marco of buscarPorRevelar("imagen")) {
        gsap.fromTo(
            marco,
            { clipPath: "inset(100% 0% 0% 0%)" },
            {
                clipPath: "inset(0% 0% 0% 0%)",
                duration: tokens.larga,
                ease: tokens.cine,
                scrollTrigger: { trigger: marco, start: INICIO_DE_REVELADO, once: true },
                clearProps: "clipPath",
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
