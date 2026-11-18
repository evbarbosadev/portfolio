<script setup lang="ts">
import { computed } from "vue";
import ProyectoCard from "@/componentes/base/ProyectoCard.vue";
import SeccionPagina from "@/componentes/base/SeccionPagina.vue";
import { useIdioma } from "@/composables/useIdioma";
import { useTextos } from "@/composables/useTextos";
import { ANCLA_PROYECTOS } from "@/constantes";
import { getProyectosDestacados } from "@/contenido/consultas";

const { t } = useTextos();
const { idioma } = useIdioma();

// Los dos primeros (por su campo "orden") son los principales y van a todo el ancho, uno por
// pantalla; el resto, a dos columnas.
const NUMERO_DE_PRINCIPALES = 2;
const ANCHOS_PRINCIPAL = "(min-width: 80rem) 72rem, 92vw";
const ANCHOS_SECUNDARIO = "(min-width: 80rem) 35rem, (min-width: 40rem) 45vw, 92vw";

const destacados = computed(() => getProyectosDestacados(idioma.value));
const principales = computed(() => destacados.value.slice(0, NUMERO_DE_PRINCIPALES));
const secundarios = computed(() => destacados.value.slice(NUMERO_DE_PRINCIPALES));
</script>

<template>
    <SeccionPagina
        :ancla="ANCLA_PROYECTOS"
        :titulo="t('proyectos.titulo')"
        :etiqueta="`${destacados.length} ${t('proyectos.cuantos')}`"
    >
        <ul class="grid gap-6 tablet:gap-12">
            <li v-for="proyecto in principales" :key="proyecto.id">
                <ProyectoCard
                    :proyecto="proyecto"
                    proporcion="aspect-video"
                    :anchos="ANCHOS_PRINCIPAL"
                />
            </li>
        </ul>

        <ul
            v-if="secundarios.length > 0"
            class="mt-6 grid gap-6 tablet:mt-12 tablet:grid-cols-2 tablet:gap-4"
        >
            <li v-for="proyecto in secundarios" :key="proyecto.id">
                <ProyectoCard
                    :proyecto="proyecto"
                    proporcion="aspect-4/3"
                    :anchos="ANCHOS_SECUNDARIO"
                />
            </li>
        </ul>
    </SeccionPagina>
</template>
