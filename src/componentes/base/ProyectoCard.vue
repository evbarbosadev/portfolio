<script setup lang="ts">
import type { ProyectoCargado } from "virtual:contenido";
import { useTextos } from "@/composables/useTextos";
import { getRutaProyecto } from "@/rutas";
import ImagenOptimizada from "./ImagenOptimizada.vue";
import ImagenPendiente from "./ImagenPendiente.vue";
import PortadaCodigoDelLema from "./PortadaCodigoDelLema.vue";
import PortadaConversacionAndroid from "./PortadaConversacionAndroid.vue";
import PortadaConversacionNova from "./PortadaConversacionNova.vue";
import PortadaSimboloVorlys from "./PortadaSimboloVorlys.vue";

/**
 * Ficha de un proyecto: portada y, debajo, título y frase a la izquierda y «Rama · periodo» a la
 * derecha. Toda la ficha lleva al caso de estudio.
 */
defineProps<{
    proyecto: ProyectoCargado;
    /** Proporción de la portada: 16:9 para los principales y 4:3 para los secundarios. */
    proporcion: "aspect-video" | "aspect-4/3";
    /** Valor de sizes para la portada, según el hueco que ocupa la ficha en la página. */
    anchos: string;
}>();

const { t } = useTextos();
</script>

<template>
    <article class="group relative">
        <!-- Sin marco ni sombra: la portada va sobre la superficie oscura, o la leve si es clara. -->
        <div
            class="overflow-hidden rounded-grande"
            :class="[proporcion, proyecto.portadaClara ? 'bg-superficie' : 'bg-superficie-fuerte']"
            data-revelar="imagen"
        >
            <!-- La portada en HTML manda sobre la imagen; sin ninguna de las dos, el hueco. -->
            <PortadaCodigoDelLema v-if="proyecto.portadaEnVivo === 'codigo-del-lema'" />
            <PortadaConversacionNova
                v-else-if="proyecto.portadaEnVivo === 'conversacion-de-nova'"
            />
            <PortadaConversacionAndroid
                v-else-if="proyecto.portadaEnVivo === 'conversacion-de-android'"
            />
            <PortadaSimboloVorlys v-else-if="proyecto.portadaEnVivo === 'simbolo-de-vorlys'" />
            <ImagenOptimizada
                v-else-if="proyecto.portada"
                :imagen="proyecto.portada.imagen"
                :alt="proyecto.portada.alt"
                :anchos="anchos"
            />
            <ImagenPendiente
                v-else
                :texto="`${t('comun.portadaPendiente')} · ${proyecto.titulo}`"
            />
        </div>

        <div
            class="mt-2.5 grid gap-0.5 tablet:grid-cols-[minmax(0,1fr)_auto] tablet:items-baseline tablet:gap-3"
            data-revelar="texto"
        >
            <div>
                <h3 class="text-titulo-3 wrap-anywhere">
                    <!--
                        El ::after del enlace cubre la ficha entera, así toda ella es pulsable.
                        Al pulsar, la portada se marca para transformarse en la del caso de estudio.
                    -->
                    <RouterLink
                        :to="getRutaProyecto(proyecto)"
                        class="transition-colors duracion-breve ease-salida group-hover:text-texto-suave after:absolute after:inset-0"
                    >
                        {{ proyecto.titulo }}
                    </RouterLink>
                </h3>
                <p class="mt-0.5 max-w-lectura text-texto-suave">{{ proyecto.resumen }}</p>
            </div>
            <p class="font-mono text-etiqueta text-texto-suave uppercase">
                {{ proyecto.rama }} · {{ proyecto.periodo }}
            </p>
        </div>
    </article>
</template>
