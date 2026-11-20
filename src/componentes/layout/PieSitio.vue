<script setup lang="ts">
import SimboloVorlys from "@/componentes/base/SimboloVorlys.vue";
import { useTextos } from "@/composables/useTextos";
import { ANCLA_CONTENIDO } from "@/constantes";
import { sitio } from "@/contenido/sitio";
import { esClicEspecial, mostrarAncla } from "@/utilidades/anclas";

const { t } = useTextos();
const nombre = sitio.nombreEnLineas.join(" ");
const año = new Date().getFullYear();

/**
 * Sube al principio y pasa el foco al contenido, sin dejar el ancla en la URL.
 */
function volverArriba(evento: MouseEvent) {
    if (esClicEspecial(evento)) {
        return;
    }

    evento.preventDefault();
    mostrarAncla(ANCLA_CONTENIDO);
}
</script>

<template>
    <footer>
        <div
            class="mx-auto flex max-w-pagina flex-wrap items-center justify-between gap-x-4 gap-y-2 px-margen pt-4 pb-6 text-detalle text-texto-suave"
        >
            <p>© {{ año }} {{ nombre }}</p>
            <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
                <!-- Firma de la marca: solo el símbolo plano, sin texto al lado (regla ID-7 de la guía de Vørlys). -->
                <p class="flex items-center">
                    <SimboloVorlys class="size-2 text-texto" />
                    <span class="sr-only">{{ t("pie.firma") }}</span>
                </p>
                <a
                    :href="`#${ANCLA_CONTENIDO}`"
                    class="transition-colors duracion-breve ease-salida hover:text-texto"
                    @click="volverArriba"
                >
                    {{ t("pie.arriba") }}
                </a>
            </div>
        </div>
    </footer>
</template>
