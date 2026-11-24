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
            class="fixed inset-0 m-0 size-auto bg-fondo text-texto"
        >
            <!-- El menú cubre la pantalla entera, cabecera incluida, así que lleva su propia fila de controles en el mismo sitio. -->
            <div
                class="mx-auto flex h-cabecera max-w-pagina items-center justify-between gap-3 px-margen text-detalle text-texto-suave"
            >
                <button
                    type="button"
                    popovertarget="menu-movil"
                    popovertargetaction="hide"
                    class="-mx-1 px-1 py-1.5 text-texto"
                >
                    {{ t("navegacion.cerrarMenu") }}
                </button>

                <div class="flex items-center gap-4">
                    <IdiomaSelector />
                    <TemaToggle />
                </div>
            </div>

            <ul class="mx-auto grid max-w-pagina gap-2 px-margen pt-4 text-entradilla">
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
