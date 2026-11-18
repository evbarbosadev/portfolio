import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

/**
 * Sigue qué sección de la página principal está en pantalla, para marcar su enlace en la
 * cabecera. Cuenta como activa la que cruza la línea a media altura de la ventana. En otras
 * páginas, o entre dos secciones sin enlace, no hay ninguna.
 */
export function useSeccionActiva(anclas: readonly string[]) {
    const ruta = useRoute();
    const seccionActiva = ref<string>();
    let observador: IntersectionObserver | undefined;

    /**
     * Empieza a observar las secciones de la página que hay ahora en pantalla.
     */
    function observarSecciones() {
        observador?.disconnect();
        seccionActiva.value = undefined;

        observador = new IntersectionObserver(
            (entradas) => {
                // Primero las que salen, para que una que sale no borre a la que entra a la vez.
                const ordenadas = [...entradas].sort(
                    (a, b) => Number(a.isIntersecting) - Number(b.isIntersecting),
                );

                for (const entrada of ordenadas) {
                    if (entrada.isIntersecting) {
                        seccionActiva.value = entrada.target.id;
                    } else if (seccionActiva.value === entrada.target.id) {
                        seccionActiva.value = undefined;
                    }
                }
            },
            { rootMargin: "-50% 0px -50% 0px" },
        );

        for (const ancla of anclas) {
            const seccion = document.getElementById(ancla);

            if (seccion) {
                observador.observe(seccion);
            }
        }
    }

    onMounted(observarSecciones);
    // Cada página monta sus secciones de nuevo: se vuelven a buscar cuando ya están pintadas.
    watch(
        () => ruta.path,
        () => nextTick(observarSecciones),
    );
    onBeforeUnmount(() => observador?.disconnect());

    return { seccionActiva };
}
