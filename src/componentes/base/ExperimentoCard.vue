<script setup lang="ts">
import type { ExperimentoCargado } from "virtual:contenido";
import { useTextos } from "@/composables/useTextos";
import { CLAVE_DE_ESTADO_DE_EXPERIMENTO } from "@/utilidades/estados";

/**
 * Fila de un experimento del laboratorio: estado, título y una frase. No lleva a ninguna página.
 */
defineProps<{
    experimento: ExperimentoCargado;
}>();

const { t } = useTextos();
</script>

<template>
    <article
        class="grid gap-0.5 py-2.5 tablet:grid-cols-[7.5rem_minmax(0,1fr)_minmax(0,1.4fr)] tablet:items-baseline tablet:gap-3"
        data-revelar="bloque"
    >
        <p class="font-mono text-etiqueta text-texto-suave uppercase">
            {{ t(CLAVE_DE_ESTADO_DE_EXPERIMENTO[experimento.estado]) }}
        </p>
        <h3 class="text-titulo-3 wrap-anywhere">{{ experimento.titulo }}</h3>
        <p class="text-texto-suave">{{ experimento.resumen }}</p>
    </article>
</template>
