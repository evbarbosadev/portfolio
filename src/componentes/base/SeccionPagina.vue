<script setup lang="ts">
import ContenedorPagina from "./ContenedorPagina.vue";

/**
 * Sección de la página principal: título a la izquierda, una etiqueta opcional a la derecha y el
 * contenido debajo. El título acepta el foco (tabindex -1) para recibirlo al saltar a la sección.
 */
defineProps<{
    ancla: string;
    titulo: string;
    etiqueta?: string;
}>();
</script>

<template>
    <section :id="ancla" class="pt-seccion" :aria-labelledby="`titulo-${ancla}`">
        <ContenedorPagina>
            <div class="mb-4 flex items-baseline justify-between gap-2" data-revelar="titulo">
                <h2 :id="`titulo-${ancla}`" class="text-titulo-2" tabindex="-1">{{ titulo }}</h2>
                <p v-if="etiqueta" class="font-mono text-etiqueta text-texto-suave uppercase">
                    {{ etiqueta }}
                </p>
            </div>
            <slot />
        </ContenedorPagina>
    </section>
</template>
