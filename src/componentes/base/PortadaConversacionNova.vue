<script setup lang="ts">
import { useTextos } from "@/composables/useTextos";

/**
 * Portada de Nova hecha en HTML: una conversación de ejemplo con los colores de la propia app
 * (obsidiana cálida). El texto va en Vørlys Sans, la de la web, para no cargar más fuentes. Se
 * ajusta sola al marco, sea 4:3 en la tarjeta o 16:9 en el caso.
 */

const { t } = useTextos();
</script>

<template>
    <!-- Es una imagen para los lectores de pantalla: dice lo que pasa en la conversación. -->
    <span class="portada-de-nova" role="img" :aria-label="t('portadaNova.alt')">
        <span class="portada-de-nova__conversacion" aria-hidden="true">
            <span class="portada-de-nova__meta">{{ t("portadaNova.tu") }} 09:10 ✓</span>
            <span class="portada-de-nova__usuario">{{ t("portadaNova.pregunta") }}</span>
            <span class="portada-de-nova__pensado"> <b>›</b>{{ t("portadaNova.pensado") }} </span>
            <span class="portada-de-nova__nombre">
                <svg viewBox="0 0 100 100" fill="none" stroke-linecap="round">
                    <path
                        d="M18,70 C27,70 24,31 37,30 C48,29 49,68 59,66 C70,64 67,30 82,29"
                        stroke="currentColor"
                        stroke-width="9"
                    />
                </svg>
                Nova<span>09:11</span>
            </span>
            <span class="portada-de-nova__respuesta">{{ t("portadaNova.respuesta") }}</span>
        </span>
    </span>
</template>
