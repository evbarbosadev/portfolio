import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { TokensDeMovimiento } from "./tokens";

/*
    Revelados al hacer scroll. Los elementos se marcan en las plantillas con data-revelar y aquí
    se les da su entrada, según las reglas de movimiento de la marca (MOV-2 y MOV-3, decisión 53).
    Todo llega desde el fondo: aparece desenfocado y se enfoca en su sitio, sin moverse ni crecer,
    con la curva de salida. Lo que cambia según el tipo es de cuánto desenfoque parte y cuánto tarda:
    - "titulo": títulos de sección. 700 ms desde 6 px.
    - "texto": párrafos, pies de ficha, listas de enlaces y botones fuera del hero. 700 ms desde 4 px.
    - "fila": filas de un listado (el laboratorio). 700 ms desde 4 px.
    - "imagen": portadas e imágenes de proyecto. 1 s desde 12 px. El marco no cambia de tamaño
      ni de sitio. La curva de cine queda para abrir un proyecto.
    Es el mismo gesto con el que aparecen las letras del lema del hero (decisión 19).
*/

type TipoDeRevelado = "titulo" | "texto" | "fila" | "imagen";

// El elemento empieza a revelarse cuando su borde superior cruza el 88 % de la altura de la ventana.
const INICIO_DE_REVELADO = "top 88%";

// Desenfoque del que parte cada tipo al aparecer: más en las imágenes, que son más grandes.
const DESENFOQUE: Record<TipoDeRevelado, string> = {
    titulo: "blur(6px)",
    texto: "blur(4px)",
    fila: "blur(4px)",
    imagen: "blur(12px)",
};

/*
    Escalonado, en segundos, cuando entran varios elementos a la vez. Va según el peso de lo que
    entra: 60 ms entre filas seguidas, 120 ms entre fichas de proyecto (de portada a portada) y
    80 ms en lo demás (el contenido tras su título, párrafos seguidos, el pie tras su portada).
*/
const ESCALONADO_ENTRE_FILAS = 0.06;
const ESCALONADO_ENTRE_BLOQUES = 0.08;
const ESCALONADO_ENTRE_FICHAS = 0.12;

const SELECTOR_DE_REVELADOS = "[data-revelar]";

function leerTipo(elemento: Element): TipoDeRevelado {
    return (elemento as HTMLElement).dataset.revelar as TipoDeRevelado;
}

/**
 * Busca los elementos que quedan por debajo de la ventana. Solo esos se ocultan para revelarse
 * después: lo que ya está a la vista no se toca, así nada parpadea cuando llega este código.
 */
function buscarPorRevelar(): HTMLElement[] {
    return gsap.utils
        .toArray<HTMLElement>(SELECTOR_DE_REVELADOS)
        .filter((elemento) => elemento.getBoundingClientRect().top > window.innerHeight);
}

/**
 * Calcula el retraso de cada elemento de un lote que entra a la vez, en el orden del documento.
 * Cada portada cuenta desde la portada anterior del lote, para que las fichas vayan a 120 ms entre
 * sí aunque entre ellas haya un pie; lo demás cuenta desde el elemento justo anterior.
 */
function calcularRetrasos(lote: Element[]): number[] {
    const retrasos: number[] = [];
    let retrasoDeLaUltimaPortada: number | undefined;

    lote.forEach((elemento, indice) => {
        const tipo = leerTipo(elemento);
        const anterior = indice > 0 ? lote[indice - 1] : undefined;
        let retraso = 0;

        if (anterior) {
            const retrasoAnterior = retrasos[indice - 1] ?? 0;

            if (tipo === "imagen" && retrasoDeLaUltimaPortada !== undefined) {
                retraso = retrasoDeLaUltimaPortada + ESCALONADO_ENTRE_FICHAS;
            } else if (tipo === "fila" && leerTipo(anterior) === "fila") {
                retraso = retrasoAnterior + ESCALONADO_ENTRE_FILAS;
            } else {
                retraso = retrasoAnterior + ESCALONADO_ENTRE_BLOQUES;
            }
        }

        if (tipo === "imagen") {
            retrasoDeLaUltimaPortada = retraso;
        }

        retrasos.push(retraso);
    });

    return retrasos;
}

/**
 * Prepara todos los revelados de la página actual. Las animaciones las deshace el contexto de
 * GSAP desde donde se llama.
 */
export function prepararRevelados(tokens: TokensDeMovimiento) {
    const elementos = buscarPorRevelar();

    // En una página sin nada por revelar no hay nada que preparar.
    if (elementos.length === 0) {
        return;
    }

    for (const elemento of elementos) {
        gsap.set(elemento, { opacity: 0, filter: DESENFOQUE[leerTipo(elemento)] });
    }

    ScrollTrigger.batch(elementos, {
        start: INICIO_DE_REVELADO,
        once: true,
        onEnter: (lote) => {
            const retrasos = calcularRetrasos(lote);

            lote.forEach((elemento, indice) => {
                const esImagen = leerTipo(elemento) === "imagen";

                gsap.to(elemento, {
                    opacity: 1,
                    filter: "blur(0px)",
                    duration: esImagen ? tokens.larga : tokens.scroll,
                    ease: tokens.salida,
                    delay: retrasos[indice],
                    clearProps: "opacity,filter",
                });
            });
        },
    });
}
