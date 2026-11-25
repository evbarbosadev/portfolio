<script setup lang="ts">
import { useTextos } from "@/composables/useTextos";

/**
 * Portada de Vørlys hecha en HTML: el símbolo grande, con la sombra leve de la barra, y las
 * fuentes de la web debajo. Antes era un PNG claro; así sigue al tema como las demás portadas.
 * Se ajusta sola al marco, sea 4:3 en la tarjeta o 16:9 en el caso.
 */

const { t } = useTextos();
</script>

<template>
    <!-- Es una imagen para los lectores de pantalla: dice lo que se ve. -->
    <span class="portada-de-vorlys" role="img" :aria-label="t('portadaVorlys.alt')">
        <!-- El trazo es el de SimboloVorlys.vue, con otro id para la máscara. -->
        <svg
            class="portada-de-vorlys__simbolo"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="-12 -12 124 124"
            aria-hidden="true"
        >
            <defs>
                <mask
                    id="portada-de-vorlys-mascara"
                    maskUnits="userSpaceOnUse"
                    x="-20"
                    y="-20"
                    width="140"
                    height="140"
                >
                    <rect x="-20" y="-20" width="140" height="140" fill="#FFFFFF" />
                    <line x1="34" y1="104" x2="66" y2="-4" stroke="#000000" stroke-width="21" />
                </mask>
            </defs>
            <circle
                cx="50"
                cy="50"
                r="44.5"
                fill="none"
                stroke="currentColor"
                stroke-width="11"
                mask="url(#portada-de-vorlys-mascara)"
            />
            <line
                class="portada-de-vorlys__sombra"
                x1="27"
                y1="101"
                x2="59"
                y2="-7"
                stroke-width="12"
            />
            <line x1="34" y1="104" x2="66" y2="-4" stroke="currentColor" stroke-width="11" />
        </svg>
        <span class="portada-de-vorlys__fuentes" aria-hidden="true">
            Vørlys Sans · Geist Mono · 400
        </span>
    </span>
</template>
