<script setup lang="ts">
/**
 * Una fila de la ficha de un proyecto: etiqueta arriba y valor debajo, separada de las demás por espacio.
 * Va siempre dentro de un <dl>.
 */
defineProps<{
    etiqueta: string;
}>();
</script>

<template>
    <div class="py-2">
        <dt class="font-mono text-etiqueta text-texto-suave uppercase">{{ etiqueta }}</dt>
        <dd class="mt-1">
            <slot />
        </dd>
    </div>
</template>
