<script setup lang="ts">
import { useIdioma } from "@/composables/useIdioma";
import { useTextos } from "@/composables/useTextos";
import { CLAVE_IDIOMA } from "@/constantes";

const { t } = useTextos();
const { otroIdioma, rutaEnOtroIdioma } = useIdioma();

/**
 * Recuerda el idioma elegido: a partir de ahora / ya no redirige según el navegador.
 */
function recordarIdioma() {
    try {
        localStorage.setItem(CLAVE_IDIOMA, otroIdioma.value);
    } catch {
        // Con el almacenamiento bloqueado la elección vale solo para esta visita.
    }
}
</script>

<template>
    <!-- Es un enlace normal a la página equivalente: funciona también sin JavaScript. -->
    <RouterLink
        :to="rutaEnOtroIdioma"
        :hreflang="otroIdioma"
        :lang="otroIdioma"
        class="-mx-1 px-1 py-1.5 transition-colors duracion-breve ease-salida hover:text-texto"
        @click="recordarIdioma"
    >
        {{ t("idioma.otroCodigo") }}
        <span class="sr-only">: {{ t("idioma.otroEtiqueta") }}</span>
    </RouterLink>
</template>
