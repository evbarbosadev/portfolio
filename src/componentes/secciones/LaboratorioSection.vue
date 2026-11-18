<script setup lang="ts">
import { computed } from "vue";
import ExperimentoCard from "@/componentes/base/ExperimentoCard.vue";
import SeccionPagina from "@/componentes/base/SeccionPagina.vue";
import { useIdioma } from "@/composables/useIdioma";
import { useTextos } from "@/composables/useTextos";
import { ANCLA_LABORATORIO } from "@/constantes";
import { getExperimentos } from "@/contenido/consultas";

const { t } = useTextos();
const { idioma } = useIdioma();

const experimentos = computed(() => getExperimentos(idioma.value));
</script>

<template>
    <SeccionPagina
        :ancla="ANCLA_LABORATORIO"
        :titulo="t('laboratorio.titulo')"
        :etiqueta="t('laboratorio.etiqueta')"
    >
        <!-- Compacto: una fila por experimento, que no llega a caso de estudio. -->
        <ul>
            <li v-for="experimento in experimentos" :key="experimento.id">
                <ExperimentoCard :experimento="experimento" />
            </li>
        </ul>
    </SeccionPagina>
</template>
