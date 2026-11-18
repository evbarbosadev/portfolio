<script setup lang="ts">
import { computed, useTemplateRef } from "vue";
import BotonEnlace from "@/componentes/base/BotonEnlace.vue";
import ContenedorPagina from "@/componentes/base/ContenedorPagina.vue";
import ImagenOptimizada from "@/componentes/base/ImagenOptimizada.vue";
import ImagenPendiente from "@/componentes/base/ImagenPendiente.vue";
import { useIdioma } from "@/composables/useIdioma";
import { useTextos } from "@/composables/useTextos";
import { ANCLA_CONTACTO, ANCLA_PROYECTOS } from "@/constantes";
import { getProyectosDestacados } from "@/contenido/consultas";
import { sitio } from "@/contenido/sitio";
import { marcarPortadaParaTransicion } from "@/movimiento/transicionesDePagina";
import { getRutaProyecto } from "@/rutas";

const { t } = useTextos();
const { idioma } = useIdioma();
const portada = useTemplateRef<HTMLElement>("portada");

const nombre = sitio.nombreEnLineas.join(" ");
// La imagen del hero es la portada del primer proyecto destacado.
const proyectoDestacado = computed(() => getProyectosDestacados(idioma.value)[0]);

// Cada línea del nombre entra un poco después de la anterior.
const RETRASOS = ["", "retraso-breve", "retraso-media"];
</script>

<template>
    <!--
        Texto a la izquierda (7 columnas), alineado abajo con la portada de la derecha (5).
        En móvil va todo seguido: titular, frase, botones e imagen. La entrada es CSS puro
        (ranura, aparecer y recorte): arranca con el primer pintado, sin esperar al JavaScript.
    -->
    <section aria-labelledby="titulo-hero">
        <ContenedorPagina
            class="grid gap-5 pt-hero pb-seccion tablet:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] tablet:items-end tablet:gap-8"
        >
            <div>
                <!-- El nombre va partido en líneas con máscara; aria-label da el nombre completo de una vez. -->
                <h1 id="titulo-hero" class="text-titular wrap-anywhere" :aria-label="nombre">
                    <span
                        v-for="(linea, numero) in sitio.nombreEnLineas"
                        :key="linea"
                        class="linea-mascara"
                        aria-hidden="true"
                    >
                        <span class="block animate-ranura" :class="RETRASOS[numero]">{{
                            linea
                        }}</span>
                    </span>
                </h1>

                <p
                    class="mt-3 mb-5 max-w-lectura animate-aparecer text-entradilla text-texto-suave retraso-larga"
                >
                    {{ sitio.frase[idioma] }}
                </p>

                <div class="flex animate-aparecer flex-wrap gap-1.5 retraso-larga">
                    <BotonEnlace :ancla="ANCLA_PROYECTOS">{{ t("hero.verProyectos") }}</BotonEnlace>
                    <BotonEnlace :ancla="ANCLA_CONTACTO" variante="secundario">
                        {{ t("hero.contacto") }}
                    </BotonEnlace>
                </div>
            </div>

            <!-- Es la imagen más grande del primer pantallazo: se carga con prioridad. -->
            <RouterLink
                v-if="proyectoDestacado"
                :to="getRutaProyecto(proyectoDestacado)"
                class="block"
                @click="marcarPortadaParaTransicion(portada)"
            >
                <span
                    ref="portada"
                    class="block aspect-4/5 animate-recorte overflow-hidden rounded-grande"
                    :class="
                        proyectoDestacado.portadaClara ? 'bg-superficie' : 'bg-superficie-fuerte'
                    "
                >
                    <ImagenOptimizada
                        v-if="proyectoDestacado.portada"
                        :imagen="proyectoDestacado.portada.imagen"
                        :alt="`${proyectoDestacado.titulo}. ${proyectoDestacado.portada.alt}`"
                        anchos="(min-width: 80rem) 30rem, (min-width: 40rem) 40vw, 92vw"
                        es-prioritaria
                    />
                    <ImagenPendiente
                        v-else
                        :texto="`${t('comun.portadaPendiente')} · ${proyectoDestacado.titulo}`"
                    />
                </span>
            </RouterLink>
        </ContenedorPagina>
    </section>
</template>
