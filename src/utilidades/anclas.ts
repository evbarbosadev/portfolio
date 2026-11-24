/*
    Saltos a una parte de la página sin dejar el ancla en la URL (/#proyectos). Los enlaces
    conservan su href con el ancla, para que funcionen sin JavaScript; con él, se intercepta el clic.
*/

import { CONSULTA_MOVIMIENTO_REDUCIDO } from "@/constantes";

// Duración del desplazamiento: crece con la raíz de la distancia, entre un mínimo y un tope.
const DURACION_MINIMA_MS = 350;
const DURACION_MAXIMA_MS = 900;
const MS_POR_RAIZ_DE_CIEN_PX = 90;

// Eventos con los que el usuario recupera el control del scroll a mitad de la animación.
const EVENTOS_DE_USUARIO = ["wheel", "touchstart", "keydown", "mousedown"] as const;

let cancelarDesplazamientoActual: (() => void) | undefined;

/**
 * Crea la función de una curva cubic-bezier (la --ease-cine de tokens.css): recibe el avance del
 * tiempo (0 a 1) y devuelve el avance del recorrido. Resuelve la x por bisección.
 */
function crearCurva(x1: number, y1: number, x2: number, y2: number) {
    const punto = (t: number, a: number, b: number) =>
        3 * (1 - t) ** 2 * t * a + 3 * (1 - t) * t ** 2 * b + t ** 3;

    return (x: number) => {
        let minimo = 0;
        let maximo = 1;

        for (let i = 0; i < 20; i++) {
            const medio = (minimo + maximo) / 2;

            if (punto(medio, x1, x2) < x) {
                minimo = medio;
            } else {
                maximo = medio;
            }
        }

        return punto((minimo + maximo) / 2, y1, y2);
    };
}

/**
 * Desplaza la página hasta una posición con la curva cinematográfica y una duración que depende de
 * la distancia. Cualquier gesto del usuario la corta; al terminar o cortarse, llama a alAcabar.
 */
function desplazarSuave(posicionFinal: number, alAcabar: () => void) {
    cancelarDesplazamientoActual?.();

    const posicionInicial = window.scrollY;
    const distancia = Math.abs(posicionFinal - posicionInicial);
    const duracion = Math.min(
        DURACION_MAXIMA_MS,
        DURACION_MINIMA_MS + MS_POR_RAIZ_DE_CIEN_PX * Math.sqrt(distancia / 100),
    );
    const [x1 = 0.7, y1 = 0, x2 = 0.2, y2 = 1] = (
        getComputedStyle(document.documentElement)
            .getPropertyValue("--ease-cine")
            .match(/-?[\d.]+/g) ?? []
    ).map(Number);
    const curva = crearCurva(x1, y1, x2, y2);
    const inicio = performance.now();
    let idFotograma = 0;

    /**
     * Para la animación y quita los listeners; es la salida común de terminar y de cortar.
     */
    function terminar() {
        cancelAnimationFrame(idFotograma);
        EVENTOS_DE_USUARIO.forEach((evento) => removeEventListener(evento, terminar));
        cancelarDesplazamientoActual = undefined;
        alAcabar();
    }

    /**
     * Coloca la página en el punto que toca del recorrido según el tiempo transcurrido.
     */
    function pintarFotograma(ahora: number) {
        const avance = Math.min(1, (ahora - inicio) / duracion);
        window.scrollTo(0, posicionInicial + (posicionFinal - posicionInicial) * curva(avance));

        if (avance < 1) {
            idFotograma = requestAnimationFrame(pintarFotograma);
        } else {
            terminar();
        }
    }

    EVENTOS_DE_USUARIO.forEach((evento) =>
        addEventListener(evento, terminar, { passive: true, once: true }),
    );
    cancelarDesplazamientoActual = terminar;
    idFotograma = requestAnimationFrame(pintarFotograma);
}

/**
 * Baja hasta un elemento de la página y le pasa el foco, sin tocar la URL. Si es una sección, el
 * foco va a su título y llega al terminar el desplazamiento. Con movimiento reducido el salto es
 * instantáneo.
 */
export function mostrarAncla(ancla: string) {
    const destino = document.getElementById(ancla);

    if (!destino) {
        return;
    }

    // main ya acepta el foco; en una sección se lo lleva su título.
    const foco = destino.hasAttribute("tabindex")
        ? destino
        : (destino.querySelector<HTMLElement>("h2[tabindex]") ?? destino);
    const darFoco = () => foco.focus({ preventScroll: true });

    if (matchMedia(CONSULTA_MOVIMIENTO_REDUCIDO).matches) {
        destino.scrollIntoView();
        darFoco();

        return;
    }

    // El hueco de la cabecera fija ya está en el scroll-padding-top del CSS.
    const hueco = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    const maximo = document.documentElement.scrollHeight - window.innerHeight;
    const posicionFinal = Math.min(
        maximo,
        Math.max(0, destino.getBoundingClientRect().top + window.scrollY - hueco),
    );

    desplazarSuave(posicionFinal, darFoco);
}

/**
 * Quita el ancla de la URL sin navegar. Se conserva history.state, donde el router guarda la
 * posición del scroll para el botón de volver.
 */
export function limpiarAncla() {
    history.replaceState(history.state, "", location.pathname + location.search);
}

/**
 * Dice si un clic lo tiene que resolver el navegador: con una tecla modificadora o con un botón
 * que no es el principal, el usuario quiere abrir el enlace aparte.
 */
export function esClicEspecial(evento: MouseEvent): boolean {
    return (
        evento.button !== 0 || evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey
    );
}
