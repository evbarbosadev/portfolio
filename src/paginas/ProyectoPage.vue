<script setup lang="ts">
import { computed, defineAsyncComponent, type Component } from "vue";
import { useRoute } from "vue-router";
import IconoIzquierda from "~icons/solar/arrow-left-linear";
import IconoDerecha from "~icons/solar/arrow-right-linear";
import ContenedorPagina from "@/componentes/base/ContenedorPagina.vue";
import DatoDeFicha from "@/componentes/base/DatoDeFicha.vue";
import EnlaceOMarcador from "@/componentes/base/EnlaceOMarcador.vue";
import EnlaceTexto from "@/componentes/base/EnlaceTexto.vue";
import EtiquetaStack from "@/componentes/base/EtiquetaStack.vue";
import ImagenOptimizada from "@/componentes/base/ImagenOptimizada.vue";
import ImagenPendiente from "@/componentes/base/ImagenPendiente.vue";
import RejillaPagina from "@/componentes/base/RejillaPagina.vue";
import { useCabecera } from "@/composables/useCabecera";
import { useIdioma } from "@/composables/useIdioma";
import { useTextos } from "@/composables/useTextos";
import { ANCLA_PROYECTOS, IDIOMAS } from "@/constantes";
import { buscarProyecto, buscarTraduccion, getProyectos } from "@/contenido/consultas";
import { getRutaProyecto, getRutaSeccion } from "@/rutas";
import { CLAVE_DE_ESTADO } from "@/utilidades/estados";

const ruta = useRoute();
const { t } = useTextos();
const { idioma } = useIdioma();

// El cuerpo de cada caso de estudio va en su propio chunk y solo se descarga al abrir ese caso.
const cuerpos = import.meta.glob<Component>("../contenido/proyectos/*/*.md", { import: "default" });

// La guarda de la ruta ya ha comprobado que el proyecto existe antes de llegar aquí.
const proyecto = computed(() => buscarProyecto(idioma.value, String(ruta.params.slug)));

const CuerpoDelCaso = computed(() => {
    const cargarCuerpo = cuerpos[`../contenido/proyectos/${proyecto.value?.id}/${idioma.value}.md`];

    return cargarCuerpo ? defineAsyncComponent(cargarCuerpo) : undefined;
});

// Proyecto anterior y siguiente. La lista da la vuelta: del último se pasa al primero.
const vecinos = computed(() => {
    const lista = getProyectos(idioma.value);
    const posicion = lista.findIndex((otro) => otro.id === proyecto.value?.id);

    return {
        anterior: lista.at(posicion - 1),
        siguiente: lista.at((posicion + 1) % lista.length),
    };
});

useCabecera(() => {
    const actual = proyecto.value;

    // canonical y hreflang solo apuntan a los idiomas en los que este proyecto existe.
    const rutas = Object.fromEntries(
        IDIOMAS.map((otroIdioma) => actual && buscarTraduccion(actual, otroIdioma))
            .filter((traduccion) => traduccion !== undefined)
            .map((traduccion) => [traduccion.idioma, getRutaProyecto(traduccion)]),
    );

    return {
        titulo: actual?.titulo ?? "",
        descripcion: actual?.resumen ?? "",
        rutas,
        claveImagenOg: actual?.id ?? "inicio",
        tipo: "article",
    };
});
</script>

<template>
    <article v-if="proyecto" class="pb-seccion">
        <ContenedorPagina>
            <p class="pt-6 text-detalle text-texto-suave escritorio:pt-10">
                <EnlaceTexto :href="getRutaSeccion(idioma, ANCLA_PROYECTOS)">
                    <span class="inline-flex items-center gap-1">
                        <IconoIzquierda class="size-2" aria-hidden="true" />
                        {{ t("caso.volver") }}
                    </span>
                </EnlaceTexto>
            </p>

            <header class="mt-6">
                <h1 class="text-titular wrap-anywhere">{{ proyecto.titulo }}</h1>
                <p class="mt-3 max-w-lectura text-entradilla text-texto-suave">
                    {{ proyecto.resumen }}
                </p>
            </header>

            <!-- Es la imagen principal del primer pantallazo: se carga con prioridad, no en diferido. -->
            <div
                class="portada-de-caso mt-8 aspect-16/10 overflow-hidden rounded-grande"
                :class="proyecto.portadaClara ? 'bg-superficie' : 'bg-superficie-fuerte'"
            >
                <ImagenOptimizada
                    v-if="proyecto.portada"
                    :imagen="proyecto.portada.imagen"
                    :alt="proyecto.portada.alt"
                    anchos="(min-width: 80rem) 72rem, 92vw"
                    es-prioritaria
                />
                <ImagenPendiente
                    v-else
                    :texto="`${t('comun.portadaPendiente')} · ${proyecto.titulo}`"
                />
            </div>

            <RejillaPagina class="mt-10 gap-y-8">
                <aside class="col-span-full escritorio:col-span-4" :aria-label="t('caso.ficha')">
                    <dl>
                        <DatoDeFicha :etiqueta="t('caso.rol')">{{ proyecto.rol }}</DatoDeFicha>
                        <DatoDeFicha :etiqueta="t('caso.periodo')">{{
                            proyecto.periodo
                        }}</DatoDeFicha>
                        <DatoDeFicha :etiqueta="t('caso.estado')">
                            {{ t(CLAVE_DE_ESTADO[proyecto.estado]) }}
                        </DatoDeFicha>
                        <DatoDeFicha :etiqueta="t('caso.stack')">
                            <ul class="flex flex-wrap gap-x-2 gap-y-1">
                                <li v-for="tecnologia in proyecto.stack" :key="tecnologia">
                                    <EtiquetaStack>{{ tecnologia }}</EtiquetaStack>
                                </li>
                            </ul>
                        </DatoDeFicha>
                        <DatoDeFicha
                            v-if="proyecto.enlaces.repo || proyecto.enlaces.demo"
                            :etiqueta="t('caso.enlaces')"
                        >
                            <ul class="grid gap-1">
                                <li v-if="proyecto.enlaces.repo">
                                    <EnlaceOMarcador :href="proyecto.enlaces.repo">
                                        {{ t("caso.repo") }}
                                    </EnlaceOMarcador>
                                </li>
                                <li v-if="proyecto.enlaces.demo">
                                    <EnlaceOMarcador :href="proyecto.enlaces.demo">
                                        {{ t("caso.demo") }}
                                    </EnlaceOMarcador>
                                </li>
                            </ul>
                        </DatoDeFicha>
                    </dl>
                </aside>

                <!-- Problema, qué hice, decisiones técnicas y resultado: el cuerpo en Markdown. -->
                <div class="col-span-full escritorio:col-span-8">
                    <component :is="CuerpoDelCaso" />
                </div>
            </RejillaPagina>

            <section
                v-if="proyecto.medios.length > 0"
                class="mt-12"
                aria-labelledby="titulo-medios"
            >
                <h2 id="titulo-medios" class="text-titulo-3">{{ t("caso.medios") }}</h2>
                <ul class="mt-4 grid gap-3 tablet:grid-cols-2">
                    <li
                        v-for="medio in proyecto.medios"
                        :key="medio.imagen.img.src"
                        class="overflow-hidden rounded-grande bg-superficie"
                    >
                        <ImagenOptimizada
                            :imagen="medio.imagen"
                            :alt="medio.alt"
                            anchos="(min-width: 40rem) 46vw, 94vw"
                        />
                    </li>
                </ul>
            </section>

            <nav
                v-if="vecinos.anterior && vecinos.siguiente"
                class="mt-seccion grid grid-cols-2 gap-3"
                :aria-label="t('caso.otros')"
            >
                <RouterLink :to="getRutaProyecto(vecinos.anterior)" class="group grid gap-1">
                    <span
                        class="inline-flex items-center gap-1 font-mono text-etiqueta text-texto-suave uppercase"
                    >
                        <IconoIzquierda class="size-2" aria-hidden="true" />
                        {{ t("caso.anterior") }}
                    </span>
                    <span
                        class="text-titulo-3 wrap-anywhere transition-colors duracion-breve ease-salida group-hover:text-texto-suave"
                    >
                        {{ vecinos.anterior.titulo }}
                    </span>
                </RouterLink>
                <RouterLink
                    :to="getRutaProyecto(vecinos.siguiente)"
                    class="group grid justify-items-end gap-1 text-right"
                >
                    <span
                        class="inline-flex items-center gap-1 font-mono text-etiqueta text-texto-suave uppercase"
                    >
                        {{ t("caso.siguiente") }}
                        <IconoDerecha class="size-2" aria-hidden="true" />
                    </span>
                    <span
                        class="text-titulo-3 wrap-anywhere transition-colors duracion-breve ease-salida group-hover:text-texto-suave"
                    >
                        {{ vecinos.siguiente.titulo }}
                    </span>
                </RouterLink>
            </nav>
        </ContenedorPagina>
    </article>
</template>
