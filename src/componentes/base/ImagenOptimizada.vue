<script setup lang="ts">
import type { ImagenProcesada } from "virtual:contenido";

/**
 * Imagen con sus variantes AVIF, WebP y JPG a varios anchos. Lleva width y height para reservar
 * su hueco antes de cargar (la página no salta) y se carga en diferido, salvo que sea la imagen
 * principal del primer pantallazo.
 */
withDefaults(
    defineProps<{
        imagen: ImagenProcesada;
        alt: string;
        /** Valor del atributo sizes: el ancho que ocupa la imagen según el ancho de la ventana. */
        anchos: string;
        esPrioritaria?: boolean;
    }>(),
    { esPrioritaria: false },
);
</script>

<template>
    <picture class="block size-full">
        <source
            v-for="(srcset, formato) in imagen.sources"
            :key="formato"
            :type="`image/${formato}`"
            :srcset="srcset"
            :sizes="anchos"
        />
        <img
            :src="imagen.img.src"
            :width="imagen.img.w"
            :height="imagen.img.h"
            :alt="alt"
            :loading="esPrioritaria ? 'eager' : 'lazy'"
            :fetchpriority="esPrioritaria ? 'high' : undefined"
            decoding="async"
            class="size-full object-cover"
        />
    </picture>
</template>
