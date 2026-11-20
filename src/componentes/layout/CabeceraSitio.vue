<script setup lang="ts">
import { computed, useTemplateRef } from "vue";
import { useEnlaceASeccion } from "@/composables/useEnlaceASeccion";
import { useSeccionActiva } from "@/composables/useSeccionActiva";
import { useTextos } from "@/composables/useTextos";
import { ANCLA_CONTACTO, ANCLA_PROYECTOS, ANCLA_SOBRE_MI } from "@/constantes";
import IdiomaSelector from "./IdiomaSelector.vue";
import LuzDeFondo from "./LuzDeFondo.vue";
import TemaToggle from "./TemaToggle.vue";

const { t } = useTextos();
const { getHrefDeSeccion, irASeccion } = useEnlaceASeccion();
const menuMovil = useTemplateRef<HTMLElement>("menuMovil");

const ANCLAS = [ANCLA_PROYECTOS, ANCLA_SOBRE_MI, ANCLA_CONTACTO];
const { seccionActiva } = useSeccionActiva(ANCLAS);

// Las secciones de la página principal, enlazables desde cualquier página. Sin nombre ni logo:
// el nombre está en el hero.
const enlaces = computed(() => [
    { ancla: ANCLA_PROYECTOS, texto: t("navegacion.proyectos") },
    { ancla: ANCLA_SOBRE_MI, texto: t("navegacion.sobreMi") },
    { ancla: ANCLA_CONTACTO, texto: t("navegacion.contacto") },
]);

/**
 * Lleva a la sección y cierra el menú del móvil, que el navegador no cerraría solo.
 */
function irDesdeMenu(evento: MouseEvent, ancla: string) {
    irASeccion(evento, ancla);
    menuMovil.value?.hidePopover();
}
</script>

<template>
    <!-- Sin fondo propio: la niebla es la copia de la luz que lleva dentro. -->
    <header class="sticky top-0 z-40">
        <LuzDeFondo solo-cabecera />
        <div
            class="mx-auto flex h-cabecera max-w-pagina items-center justify-between gap-3 px-margen text-detalle text-texto-suave"
        >
            <nav :aria-label="t('navegacion.etiqueta')" class="hidden tablet:block">
                <ul class="flex gap-4">
                    <li v-for="enlace in enlaces" :key="enlace.ancla">
                        <a
                            :href="getHrefDeSeccion(enlace.ancla)"
                            class="transition-colors duracion-breve ease-salida hover:text-texto"
                            :class="{ 'text-texto': seccionActiva === enlace.ancla }"
                            @click="irASeccion($event, enlace.ancla)"
                        >
                            {{ enlace.texto }}
                        </a>
                    </li>
                </ul>
            </nav>

            <!-- El menú del móvil usa la API popover del navegador: se abre y se cierra sin JavaScript. -->
            <button
                type="button"
                popovertarget="menu-movil"
                class="-mx-1 px-1 py-1.5 text-texto tablet:hidden"
            >
                {{ t("navegacion.menu") }}
            </button>

            <div class="flex items-center gap-4">
                <IdiomaSelector />
                <TemaToggle />
            </div>
        </div>

        <nav
            id="menu-movil"
            ref="menuMovil"
            popover
            :aria-label="t('navegacion.etiquetaMenu')"
            class="fixed inset-x-0 top-cabecera bottom-0 m-0 size-auto bg-fondo px-margen pt-4 text-texto"
        >
            <ul class="grid gap-2 text-entradilla">
                <li v-for="enlace in enlaces" :key="enlace.ancla">
                    <a
                        :href="getHrefDeSeccion(enlace.ancla)"
                        class="block py-0.5"
                        @click="irDesdeMenu($event, enlace.ancla)"
                    >
                        {{ enlace.texto }}
                    </a>
                </li>
            </ul>
        </nav>
    </header>
</template>
