<script setup lang="ts">
import { useTema } from "@/composables/useTema";
import { useTextos } from "@/composables/useTextos";

const { t } = useTextos();
const { estaOscuro, alternarTema } = useTema();
</script>

<template>
    <!-- Sin JavaScript no puede funcionar, así que solo se muestra cuando lo hay (clase solo-js). -->
    <button
        type="button"
        class="solo-js -mx-1 px-1 py-1.5 transition-colors duracion-breve ease-salida hover:text-texto"
        :aria-pressed="estaOscuro"
        :aria-label="t('tema.cambiar')"
        @click="alternarTema"
    >
        {{ t("tema.etiqueta") }}
    </button>
</template>
