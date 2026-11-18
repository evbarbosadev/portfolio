<script setup lang="ts">
import { computed } from "vue";

/**
 * Enlace de texto. Hereda el color de su contexto y al pasar el ratón o recibir el foco pasa al
 * color del texto principal (solo color, nada crece). Las rutas internas navegan con el router;
 * el resto (webs, correo, descargas) son <a> normales.
 */
const props = defineProps<{
    href: string;
    /** Se abre en una pestaña nueva. */
    externo?: boolean;
    /** Descarga el archivo en vez de navegar a él. */
    descarga?: boolean;
}>();

const esRutaInterna = computed(
    () => !props.descarga && (props.href.startsWith("/") || props.href.startsWith("#")),
);

// Un enlace a una sección no es "la página actual": se evita que el router lo anuncie así.
const valorDeActual = computed(() => (props.href.includes("#") ? "false" : "page"));

const clases =
    "transition-colors duracion-breve ease-salida hover:text-texto focus-visible:text-texto";
</script>

<template>
    <RouterLink v-if="esRutaInterna" :to="href" :class="clases" :aria-current-value="valorDeActual">
        <slot />
    </RouterLink>
    <a
        v-else
        :href="href"
        :class="clases"
        :download="descarga ? '' : undefined"
        :target="externo ? '_blank' : undefined"
        :rel="externo ? 'noopener noreferrer' : undefined"
    >
        <slot />
    </a>
</template>
