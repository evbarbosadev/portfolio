<script setup lang="ts">
// Se precargan las dos fuentes: las dos pintan la primera pantalla (el nombre y la etiqueta del rol).
import urlFuenteMono from "@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2?url";
import urlFuenteTexto from "@/recursos/fuentes/VorlysSans-Regular.woff2?url";
import { useHead } from "@unhead/vue";
import { nextTick } from "vue";
import { useRouter } from "vue-router";
import CabeceraSitio from "@/componentes/layout/CabeceraSitio.vue";
import LuzDeFondo from "@/componentes/layout/LuzDeFondo.vue";
import PieSitio from "@/componentes/layout/PieSitio.vue";
import SaltarContenido from "@/componentes/layout/SaltarContenido.vue";
import { useAnalitica } from "@/composables/useAnalitica";
import { useIdioma } from "@/composables/useIdioma";
import { useMovimiento } from "@/composables/useMovimiento";
import { ANCLA_CONTENIDO } from "@/constantes";
import { limpiarAncla } from "@/utilidades/anclas";

const router = useRouter();
const { idioma } = useIdioma();

init();
setListeners();
useAnalitica();
useMovimiento();

/**
 * Cabecera común a todas las páginas: el idioma del documento y la precarga de la fuente,
 * que es la que pinta el texto más grande del primer pantallazo.
 */
function init() {
    useHead({
        htmlAttrs: { lang: () => idioma.value },
        link: [urlFuenteTexto, urlFuenteMono].map((url) => ({
            rel: "preload",
            as: "font",
            type: "font/woff2",
            href: url,
            crossorigin: "anonymous",
        })),
    });
}

/**
 * Al cambiar de página el foco pasa al contenido nuevo, para quien navega con teclado o lector
 * de pantalla. No se hace en la primera carga ni al saltar a un ancla de la misma página.
 * Si se llega con un ancla (/#proyectos), el router baja a ella y después se quita de la URL.
 */
function setListeners() {
    if (import.meta.env.SSR) {
        return;
    }

    // La primera navegación termina antes de que este aviso exista, y el router deja la página
    // arriba. Si se abre con un ancla, se baja a ella sin animación y se quita de la URL.
    if (location.hash) {
        const ancla = decodeURIComponent(location.hash.slice(1));

        router.isReady().then(() =>
            setTimeout(() => {
                document.getElementById(ancla)?.scrollIntoView({ behavior: "instant" });
                limpiarAncla();
            }),
        );
    }

    router.afterEach((destino, origen) => {
        if (destino.hash) {
            // setTimeout: el router coloca el scroll justo después de este aviso.
            setTimeout(limpiarAncla);
        }

        const esPrimeraCarga = origen.matched.length === 0;

        if (esPrimeraCarga || destino.path === origen.path) {
            return;
        }

        nextTick(() => {
            document.getElementById(ANCLA_CONTENIDO)?.focus({ preventScroll: true });
        });
    });
}
</script>

<template>
    <LuzDeFondo />
    <SaltarContenido />
    <CabeceraSitio />
    <main :id="ANCLA_CONTENIDO" tabindex="-1">
        <!--
            La clave hace que cada dirección monte su página desde cero, aunque comparta componente
            con la anterior (/ y /en, o dos proyectos). GSAP reescribe el DOM de los títulos al
            animarlos, y sobre un DOM reutilizado Vue ya no podría actualizar esos textos.
        -->
        <RouterView v-slot="{ Component, route }">
            <component :is="Component" :key="route.path" />
        </RouterView>
    </main>
    <PieSitio />
    <div class="niebla-de-abajo" aria-hidden="true" />
</template>
