<script setup lang="ts">
import ContenedorPagina from "@/componentes/base/ContenedorPagina.vue";
import EnlaceOMarcador from "@/componentes/base/EnlaceOMarcador.vue";
import EnlaceTexto from "@/componentes/base/EnlaceTexto.vue";
import { useIdioma } from "@/composables/useIdioma";
import { useTextos } from "@/composables/useTextos";
import { ANCLA_CONTACTO } from "@/constantes";
import { sitio } from "@/contenido/sitio";
import { esMarcador } from "@/utilidades/marcadores";

const { t } = useTextos();
const { idioma } = useIdioma();
</script>

<template>
    <section :id="ANCLA_CONTACTO" class="pt-seccion pb-hero" aria-labelledby="titulo-contacto">
        <ContenedorPagina>
            <!-- El título va como etiqueta: lo grande de la sección es el email. -->
            <h2
                id="titulo-contacto"
                class="font-mono text-etiqueta text-texto-suave uppercase"
                tabindex="-1"
                data-revelar="titulo"
            >
                {{ t("contacto.titulo") }}
            </h2>

            <p class="mt-2 mb-4 text-correo wrap-anywhere" data-revelar="texto">
                <span v-if="esMarcador(sitio.email)" class="text-texto-suave">{{
                    sitio.email
                }}</span>
                <a
                    v-else
                    :href="`mailto:${sitio.email}`"
                    class="transition-colors duracion-breve ease-salida hover:text-texto-suave"
                >
                    {{ sitio.email }}
                </a>
            </p>

            <ul class="flex flex-wrap gap-x-4 gap-y-2 text-texto-suave" data-revelar="texto">
                <li>
                    <EnlaceOMarcador :href="sitio.enlaces.linkedin">
                        {{ t("contacto.linkedin") }}
                    </EnlaceOMarcador>
                </li>
                <li>
                    <EnlaceOMarcador :href="sitio.enlaces.github">
                        {{ t("contacto.github") }}
                    </EnlaceOMarcador>
                </li>
                <li>
                    <!-- Cada idioma descarga su CV: /cv-es.pdf o /cv-en.pdf. -->
                    <EnlaceTexto :href="`/cv-${idioma}.pdf`" descarga>
                        {{ t("contacto.cv") }}
                    </EnlaceTexto>
                </li>
            </ul>
        </ContenedorPagina>
    </section>
</template>
