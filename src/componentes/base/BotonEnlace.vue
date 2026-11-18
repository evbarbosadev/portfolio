<script setup lang="ts">
import { useEnlaceASeccion } from "@/composables/useEnlaceASeccion";

/**
 * Enlace con aspecto de botón, para las llamadas a la acción. La variante primaria va rellena
 * y la secundaria solo con borde. Lleva a otra página (href) o a una sección de la principal (ancla).
 */
const props = withDefaults(
    defineProps<{
        href?: string;
        ancla?: string;
        variante?: "primario" | "secundario";
    }>(),
    { href: undefined, ancla: undefined, variante: "primario" },
);

const { getHrefDeSeccion, irASeccion } = useEnlaceASeccion();

// Al pasar el ratón solo cambia la opacidad: nada crece ni se mueve.
const clases = [
    "inline-flex h-6 items-center gap-1 rounded-medio border px-2.5 text-detalle transition-opacity duracion-breve ease-salida hover:opacity-80",
    props.variante === "primario" ? "border-texto bg-texto text-fondo" : "border-linea text-texto",
];
</script>

<template>
    <a
        v-if="ancla"
        :href="getHrefDeSeccion(ancla)"
        :class="clases"
        @click="irASeccion($event, ancla)"
    >
        <slot />
    </a>
    <!-- Lleva a otra página, nunca a la actual: no debe anunciarse como tal. -->
    <RouterLink v-else-if="href" :to="href" aria-current-value="false" :class="clases">
        <slot />
    </RouterLink>
</template>
