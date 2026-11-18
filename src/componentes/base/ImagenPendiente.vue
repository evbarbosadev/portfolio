<script setup lang="ts">
/**
 * Hueco de una imagen que aún no existe (portada o foto). Superficie oscura de la marca, que
 * sigue el tema, y una etiqueta abajo a la izquierda; sin ningún otro adorno. Es HTML y no una
 * imagen: ocupa el marco que le toque (4:5, 16:9, 4:3...) y el texto nunca sale recortado.
 */
defineProps<{
    texto: string;
}>();
</script>

<template>
    <span class="relative block size-full bg-superficie-fuerte">
        <span
            class="absolute right-2 bottom-2 left-2 font-mono text-etiqueta text-gris-500 uppercase"
        >
            {{ texto }}
        </span>
    </span>
</template>
