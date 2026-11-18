/*
    Saltos a una parte de la página sin dejar el ancla en la URL (/#proyectos). Los enlaces
    conservan su href con el ancla, para que funcionen sin JavaScript; con él, se intercepta el clic.
*/

/**
 * Baja hasta un elemento de la página y le pasa el foco, sin tocar la URL. Si es una sección, el
 * foco va a su título. Suave o instantáneo lo decide el CSS (scroll-behavior en base.css), que ya
 * respeta el movimiento reducido.
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

    destino.scrollIntoView();
    foco.focus({ preventScroll: true });
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
