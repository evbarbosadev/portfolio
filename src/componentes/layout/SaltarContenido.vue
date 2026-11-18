<script setup lang="ts">
import { useTextos } from "@/composables/useTextos";
import { ANCLA_CONTENIDO } from "@/constantes";
import { esClicEspecial, mostrarAncla } from "@/utilidades/anclas";

const { t } = useTextos();

/**
 * Pasa el foco al contenido sin dejar el ancla en la URL. Sin JavaScript, el href hace lo mismo.
 */
function saltar(evento: MouseEvent) {
    if (esClicEspecial(evento)) {
        return;
    }

    evento.preventDefault();
    mostrarAncla(ANCLA_CONTENIDO);
}
</script>

<template>
    <!-- Primer elemento enfocable de la página: solo se ve al llegar a él con el teclado. -->
    <a
        :href="`#${ANCLA_CONTENIDO}`"
        class="sr-only rounded-medio bg-texto px-3 py-1 text-detalle text-fondo focus:not-sr-only focus:fixed focus:top-1 focus:left-1 focus:z-50"
        @click="saltar"
    >
        {{ t("navegacion.saltar") }}
    </a>
</template>
