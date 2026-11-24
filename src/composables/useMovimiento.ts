import { nextTick, onBeforeUnmount, watch } from "vue";
import { useRouter } from "vue-router";
import type { Coreografia } from "@/movimiento/coreografia";
import { useMovimientoReducido } from "./useMovimientoReducido";

// Margen máximo para esperar a que el navegador esté en reposo antes de cargar el movimiento.
const ESPERA_MAXIMA_EN_REPOSO = 2000;

/**
 * Carga y controla el movimiento que depende de JavaScript (los revelados al hacer scroll). Solo
 * en el navegador, en reposo tras el primer pintado y nunca con movimiento reducido: en ese caso
 * GSAP ni siquiera se descarga.
 */
export function useMovimiento() {
    const router = useRouter();
    const { prefiereMovimientoReducido } = useMovimientoReducido();
    let coreografia: Coreografia | undefined;
    let hayQueApagar = false;

    /**
     * Descarga el chunk de movimiento y lo arranca sobre la página actual.
     */
    async function encender() {
        hayQueApagar = false;
        const { crearCoreografia } = await import("@/movimiento/coreografia");

        // Si mientras se descargaba el usuario activó el movimiento reducido, ya no se arranca.
        if (hayQueApagar || coreografia) {
            return;
        }

        coreografia = crearCoreografia();
        coreografia.prepararPagina();
    }

    function apagar() {
        hayQueApagar = true;
        coreografia?.destruir();
        coreografia = undefined;
    }

    // La preferencia se conoce al montar y puede cambiar con la página abierta.
    watch(prefiereMovimientoReducido, (prefiereReducido) => {
        if (prefiereReducido === undefined) {
            return;
        }

        if (prefiereReducido) {
            apagar();
        } else if ("requestIdleCallback" in window) {
            requestIdleCallback(encender, { timeout: ESPERA_MAXIMA_EN_REPOSO });
        } else {
            // Safari no tiene requestIdleCallback: se espera a que termine la tarea actual.
            setTimeout(encender);
        }
    });

    /*
        Tras cada cambio de página, con el DOM nuevo ya pintado, se preparan sus animaciones. Se espera
        a que el router coloque el scroll (al volver lo restaura): si no, lo que queda a la vista tras
        restaurarlo se tomaría por "fuera de la ventana" y se revelaría con su animación.
    */
    router.afterEach((destino, origen) => {
        if (destino.path !== origen.path) {
            nextTick(() => setTimeout(() => coreografia?.prepararPagina()));
        }
    });

    onBeforeUnmount(apagar);
}
