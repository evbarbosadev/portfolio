<script setup lang="ts">
import { fotos } from "virtual:contenido";
import EnlaceOMarcador from "@/componentes/base/EnlaceOMarcador.vue";
import ImagenOptimizada from "@/componentes/base/ImagenOptimizada.vue";
import ImagenPendiente from "@/componentes/base/ImagenPendiente.vue";
import SeccionPagina from "@/componentes/base/SeccionPagina.vue";
import { useIdioma } from "@/composables/useIdioma";
import { useTextos } from "@/composables/useTextos";
import { ANCLA_FOTOGRAFIA } from "@/constantes";
import { sitio } from "@/contenido/sitio";

const { t } = useTextos();
const { idioma } = useIdioma();
</script>

<template>
    <SeccionPagina
        :ancla="ANCLA_FOTOGRAFIA"
        :titulo="t('fotografia.titulo')"
        :etiqueta="t('fotografia.etiqueta')"
    >
        <!-- Tira de cuatro fotos en 4:5; en móvil, dos por fila. -->
        <ul class="grid grid-cols-2 gap-1.5 tablet:grid-cols-4">
            <li
                v-for="(foto, posicion) in fotos"
                :key="posicion"
                class="aspect-4/5 overflow-hidden rounded-grande bg-superficie-fuerte"
                data-revelar="bloque"
            >
                <ImagenOptimizada
                    v-if="foto.imagen"
                    :imagen="foto.imagen"
                    :alt="foto.alt[idioma]"
                    anchos="(min-width: 80rem) 17rem, (min-width: 40rem) 22vw, 45vw"
                />
                <ImagenPendiente v-else :texto="`${t('comun.fotoPendiente')} · ${posicion + 1}`" />
            </li>
        </ul>
        <p class="mt-3 text-detalle text-texto-suave" data-revelar="bloque">
            <EnlaceOMarcador :href="sitio.enlaces.instagram">
                {{ t("fotografia.instagram") }} · {{ sitio.usuarioInstagram }}
            </EnlaceOMarcador>
        </p>
    </SeccionPagina>
</template>
