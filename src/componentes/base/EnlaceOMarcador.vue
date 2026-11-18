<script setup lang="ts">
import { useTextos } from "@/composables/useTextos";
import { esMarcador } from "@/utilidades/marcadores";
import EnlaceTexto from "./EnlaceTexto.vue";

/**
 * Enlace externo que sale del contenido (repositorio, LinkedIn...). Mientras el dato sea un
 * marcador "[POR RELLENAR: ...]" se muestra como texto, para no enlazar a ningún sitio.
 */
defineProps<{
    href: string;
}>();

const { t } = useTextos();
</script>

<template>
    <span v-if="esMarcador(href)"><slot />: {{ href }}</span>
    <EnlaceTexto v-else :href="href" externo>
        <slot />
        <span class="sr-only">{{ t("comun.pestañaNueva") }}</span>
    </EnlaceTexto>
</template>
