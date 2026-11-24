import { onBeforeUnmount, onMounted, ref } from "vue";
import {
    CLAVE_TEMA,
    CONSULTA_MOVIMIENTO_REDUCIDO,
    CONSULTA_TEMA_OSCURO,
    TEMA_CLARO,
    TEMA_OSCURO,
    type Tema,
} from "@/constantes";
import { marcarTransicion } from "@/movimiento/transicionesDePagina";

/**
 * Tema claro u oscuro. El tema inicial lo fija public/tema.js antes del primer pintado; aquí se
 * gestiona el interruptor manual y se sigue al sistema mientras no haya una elección guardada.
 */
export function useTema() {
    // Empieza en false en servidor y cliente para que la hidratación coincida; se corrige al montar.
    const estaOscuro = ref(false);
    let consultaDelSistema: MediaQueryList | undefined;

    onMounted(() => {
        estaOscuro.value = document.documentElement.dataset.tema === TEMA_OSCURO;

        consultaDelSistema = matchMedia(CONSULTA_TEMA_OSCURO);
        consultaDelSistema.addEventListener("change", seguirAlSistema);
    });

    onBeforeUnmount(() => {
        consultaDelSistema?.removeEventListener("change", seguirAlSistema);
    });

    /**
     * Aplica un tema escribiéndolo en <html>, que es de donde lo leen los estilos.
     */
    function aplicarTema(tema: Tema) {
        document.documentElement.dataset.tema = tema;
        estaOscuro.value = tema === TEMA_OSCURO;
    }

    /**
     * Aplica un tema fundiendo la pantalla entera del viejo al nuevo en una sola pasada (MOV-9),
     * sin desenfoque. Sin la View Transitions API, o con movimiento reducido, el cambio es directo.
     */
    function aplicarTemaConFundido(tema: Tema) {
        const puedeFundir =
            "startViewTransition" in document && !matchMedia(CONSULTA_MOVIMIENTO_REDUCIDO).matches;

        if (!puedeFundir) {
            aplicarTema(tema);

            return;
        }

        marcarTransicion("tema");
        const transicion = document.startViewTransition(() => aplicarTema(tema));
        transicion.finished.finally(() => marcarTransicion(undefined));
    }

    /**
     * Cambia al otro tema y recuerda la elección para las próximas visitas.
     */
    function alternarTema() {
        const temaNuevo: Tema = estaOscuro.value ? TEMA_CLARO : TEMA_OSCURO;
        aplicarTemaConFundido(temaNuevo);

        try {
            localStorage.setItem(CLAVE_TEMA, temaNuevo);
        } catch {
            // Con el almacenamiento bloqueado el cambio vale solo para esta visita.
        }
    }

    /**
     * Si el sistema cambia de tema y el usuario no ha elegido uno a mano, la web cambia con él.
     */
    function seguirAlSistema(evento: MediaQueryListEvent) {
        if (hayTemaGuardado()) {
            return;
        }

        aplicarTemaConFundido(evento.matches ? TEMA_OSCURO : TEMA_CLARO);
    }

    /**
     * Dice si el usuario ya eligió un tema con el interruptor.
     */
    function hayTemaGuardado(): boolean {
        try {
            return localStorage.getItem(CLAVE_TEMA) !== null;
        } catch {
            return false;
        }
    }

    return { estaOscuro, alternarTema };
}
