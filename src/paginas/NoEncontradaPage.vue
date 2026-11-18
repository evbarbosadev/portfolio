<script setup lang="ts">
import BotonEnlace from "@/componentes/base/BotonEnlace.vue";
import ContenedorPagina from "@/componentes/base/ContenedorPagina.vue";
import { useCabecera } from "@/composables/useCabecera";
import { traducir } from "@/idiomas";
import { getRutaInicio } from "@/rutas";

/*
    La 404 es una sola página para los dos idiomas: Firebase sirve el mismo 404.html para cualquier
    dirección que no exista, así que no se puede saber en qué idioma venía el visitante.
*/

useCabecera(() => ({
    titulo: `${traducir("es", "seo.tituloNoEncontrada")} · ${traducir("en", "seo.tituloNoEncontrada")}`,
    descripcion: traducir("es", "noEncontrada.texto"),
    rutas: {},
    claveImagenOg: "inicio",
    hayQueIndexar: false,
}));
</script>

<template>
    <ContenedorPagina class="-mt-cabecera flex min-h-svh flex-col justify-center pt-cabecera pb-8">
        <p class="font-mono text-etiqueta text-texto-suave uppercase">404</p>
        <h1 class="mt-3 text-titular">{{ traducir("es", "noEncontrada.titulo") }}</h1>
        <p class="mt-3 max-w-lectura text-entradilla text-texto-suave">
            {{ traducir("es", "noEncontrada.texto") }}
        </p>
        <p class="mt-5">
            <BotonEnlace :href="getRutaInicio('es')">
                {{ traducir("es", "noEncontrada.volver") }}
            </BotonEnlace>
        </p>

        <div lang="en" class="mt-12">
            <p class="text-titulo-3">{{ traducir("en", "noEncontrada.titulo") }}</p>
            <p class="mt-1 max-w-lectura text-texto-suave">
                {{ traducir("en", "noEncontrada.texto") }}
            </p>
            <p class="mt-4">
                <BotonEnlace :href="getRutaInicio('en')" variante="secundario">
                    {{ traducir("en", "noEncontrada.volver") }}
                </BotonEnlace>
            </p>
        </div>
    </ContenedorPagina>
</template>
