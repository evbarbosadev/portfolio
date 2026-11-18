import { onBeforeUnmount, onMounted, ref } from "vue";
import { CONSULTA_MOVIMIENTO_REDUCIDO } from "@/constantes";

/**
 * Dice si el usuario ha pedido movimiento reducido en su sistema, y se actualiza si lo cambia
 * con la página abierta. Hasta que el componente se monta en el navegador no se conoce.
 */
export function useMovimientoReducido() {
    const prefiereMovimientoReducido = ref<boolean>();
    let consulta: MediaQueryList | undefined;

    /**
     * Guarda la preferencia cada vez que cambia.
     */
    function actualizar(evento: MediaQueryListEvent) {
        prefiereMovimientoReducido.value = evento.matches;
    }

    onMounted(() => {
        consulta = matchMedia(CONSULTA_MOVIMIENTO_REDUCIDO);
        prefiereMovimientoReducido.value = consulta.matches;
        consulta.addEventListener("change", actualizar);
    });

    onBeforeUnmount(() => {
        consulta?.removeEventListener("change", actualizar);
    });

    return { prefiereMovimientoReducido };
}
