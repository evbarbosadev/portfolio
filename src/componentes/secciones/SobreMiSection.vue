<script setup lang="ts">
import { computed } from "vue";
import SeccionPagina from "@/componentes/base/SeccionPagina.vue";
import { useIdioma } from "@/composables/useIdioma";
import { useTextos } from "@/composables/useTextos";
import { ANCLA_SOBRE_MI } from "@/constantes";
import { getExperiencias } from "@/contenido/consultas";
import { sitio } from "@/contenido/sitio";

const { t } = useTextos();
const { idioma } = useIdioma();

// «Ahora» es el primer puesto de la experiencia (el de orden más bajo) y «Antes», el segundo.
const trabajoActual = computed(() => getExperiencias(idioma.value)[0]);
const trabajoAnterior = computed(() => getExperiencias(idioma.value)[1]);

// La etiqueta en mono baja un poco para alinearse con la primera línea del valor.
const CLASES_ETIQUETA = "pt-px font-mono text-etiqueta/[1.6] text-texto-suave uppercase";
// En móvil cada pareja va seguida y se separa de la siguiente por espacio.
const CLASES_VALOR = "mb-1.5 tablet:mb-0";
</script>

<template>
    <SeccionPagina :ancla="ANCLA_SOBRE_MI" :titulo="t('sobreMi.titulo')">
        <div class="grid gap-4 tablet:grid-cols-2 tablet:gap-8">
            <!-- whitespace-pre-line respeta los saltos de línea del texto como párrafos. -->
            <p class="text-entradilla whitespace-pre-line" data-revelar="bloque">
                {{ sitio.sobreMi[idioma] }}
            </p>

            <!-- Ficha corta: nada de listas largas de tecnologías. -->
            <dl
                class="grid gap-x-3 gap-y-0.5 tablet:grid-cols-[8.75rem_minmax(0,1fr)] tablet:gap-y-2"
                data-revelar="bloque"
            >
                <template v-if="trabajoActual">
                    <dt :class="CLASES_ETIQUETA">{{ t("sobreMi.ahora") }}</dt>
                    <dd :class="CLASES_VALOR">
                        {{ trabajoActual.empresa }}
                        <span class="block text-detalle text-texto-suave">
                            {{ trabajoActual.puesto }} · {{ t("sobreMi.desde") }}
                            {{ trabajoActual.inicio }}
                        </span>
                    </dd>
                </template>
                <template v-if="trabajoAnterior">
                    <dt :class="CLASES_ETIQUETA">{{ t("sobreMi.antes") }}</dt>
                    <dd :class="CLASES_VALOR">
                        {{ trabajoAnterior.empresa }}
                        <span class="block text-detalle text-texto-suave">
                            {{ trabajoAnterior.puesto }} · {{ trabajoAnterior.inicio }}
                        </span>
                    </dd>
                </template>
                <dt :class="CLASES_ETIQUETA">{{ t("sobreMi.stack") }}</dt>
                <dd :class="CLASES_VALOR">
                    {{ sitio.stack[0] }}
                    <span class="block text-detalle text-texto-suave">{{ sitio.stack[1] }}</span>
                </dd>
                <dt :class="CLASES_ETIQUETA">{{ t("sobreMi.tambien") }}</dt>
                <dd :class="CLASES_VALOR">{{ sitio.tambien[idioma] }}</dd>
            </dl>
        </div>
    </SeccionPagina>
</template>
