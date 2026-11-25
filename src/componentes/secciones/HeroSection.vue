<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from "vue";
import BotonEnlace from "@/componentes/base/BotonEnlace.vue";
import ContenedorPagina from "@/componentes/base/ContenedorPagina.vue";
import { useIdioma } from "@/composables/useIdioma";
import { useTextos } from "@/composables/useTextos";
import { ANCLA_CONTACTO, ANCLA_PROYECTOS, CONSULTA_MOVIMIENTO_REDUCIDO } from "@/constantes";
import { sitio } from "@/contenido/sitio";

/*
    Un cursor de editor escribe el lema letra a letra; al acabar salen el nombre y los botones.
    Las letras ya vienen en el HTML: sin JavaScript o con movimiento reducido se ven tal cual, y
    con JavaScript el CSS las esconde desde el primer pintado (ver «HERO ESCRITO» en base.css).
*/

// Ritmo de la escritura, en milisegundos (decisión 57: el lema queda escrito en unos 1,6 s).
const ESPERA_INICIAL = 400; // solo el cursor, parpadeando
const PULSACION = 22; // media entre teclas
const VARIACION = 14; // irregularidad, para que parezca una persona
const ENTRE_PALABRAS = 14;
const PAUSA = 200; // entre los dos trozos del lema
const PARPADEO = 1100;
// Pasado este momento desde que se abre la página ya no se escribe: se enseña entero.
const LIMITE_PARA_ESCRIBIR = 3500;

type Fase = "esperando" | "escribiendo" | "hecho";

const { t } = useTextos();
const { idioma } = useIdioma();
const titular = useTemplateRef<HTMLElement>("titular");
const cursor = useTemplateRef<HTMLElement>("cursor");

const nombre = sitio.nombreEnLineas.join(" ");
const lema = computed(() => sitio.lema[idioma.value].join(" "));

const fase = ref<Fase>("esperando");
const letrasEscritas = ref(0);
const cursorApagado = ref(false);
const cursorOculto = ref(false);

let idDeFotograma = 0;
let temporizador: ReturnType<typeof setTimeout> | undefined;

/**
 * Parte el lema en palabras (que no se cortan al final de línea) y letras. Cada palabra guarda
 * el número de su primera letra y si va justo después de la pausa.
 */
const palabras = computed(() => {
    let inicio = 0;

    return sitio.lema[idioma.value].flatMap((trozo, numeroDeTrozo) =>
        trozo.split(" ").map((texto, posicion, textos) => {
            const palabra = {
                letras: [...texto],
                inicio,
                trasLaPausa: numeroDeTrozo > 0 && posicion === 0,
                // La última palabra de cada trozo no se queda sola en una línea.
                pegadaALaAnterior: posicion > 0 && posicion === textos.length - 1,
            };
            inicio += palabra.letras.length;
            return palabra;
        }),
    );
});

/**
 * Calcula en qué momento (desde que empieza) aparece cada letra.
 */
function calcularHorario(): number[] {
    const horario: number[] = [];
    let momento = ESPERA_INICIAL;

    palabras.value.forEach((palabra, numero) => {
        if (numero > 0) {
            momento += palabra.trasLaPausa ? PAUSA : ENTRE_PALABRAS;
        }

        for (let i = 0; i < palabra.letras.length; i++) {
            horario.push(momento);
            momento += PULSACION + (Math.random() - 0.5) * VARIACION;
        }
    });

    return horario;
}

/**
 * Lleva el cursor detrás de la última letra escrita. Al cambiar de línea salta sin deslizarse.
 */
function moverCursor() {
    const letras = titular.value?.querySelectorAll(".letra");
    const ultima = letras?.[letrasEscritas.value - 1];

    if (!titular.value || !cursor.value || !ultima) {
        return;
    }

    const caja = titular.value.getBoundingClientRect();
    const letra = ultima.getBoundingClientRect();
    const y = letra.top - caja.top;
    const cambiaDeLinea = Math.abs(Number(cursor.value.dataset.y ?? y) - y) > 2;

    cursor.value.style.transitionProperty = cambiaDeLinea ? "opacity" : "";
    cursor.value.style.translate = `${letra.right - caja.left}px ${y}px`;
    cursor.value.dataset.y = String(y);
}

/**
 * Escribe el lema. Va por tiempo transcurrido y no por temporizadores, para que una pestaña en
 * segundo plano (que frena los temporizadores) no la deje a medias: al volver, ya está escrito.
 */
function escribir() {
    const horario = calcularHorario();
    const comienzo = performance.now();

    const avanzar = (ahora: number) => {
        const transcurrido = ahora - comienzo;
        const escritas = horario.filter((momento) => momento <= transcurrido).length;

        if (escritas > 0) {
            fase.value = "escribiendo";
        }

        if (escritas !== letrasEscritas.value) {
            letrasEscritas.value = escritas;
            nextTick(moverCursor);
        }

        // El nombre y los botones salen con la última letra, sin respiro.
        if (escritas === horario.length) {
            terminar();
            return;
        }

        idDeFotograma = requestAnimationFrame(avanzar);
    };

    idDeFotograma = requestAnimationFrame(avanzar);
}

/**
 * Deja el hero completo: el lema entero, el nombre y los botones. El cursor parpadea una vez y se
 * apaga con un último parpadeo, al mismo ritmo que los anteriores.
 */
function terminar() {
    if (fase.value === "hecho") {
        return;
    }

    cancelAnimationFrame(idDeFotograma);
    clearTimeout(temporizador);
    fase.value = "hecho";
    // Justo cuando acaba el primer parpadeo, para que el último empiece encendido como los demás.
    temporizador = setTimeout(() => (cursorApagado.value = true), PARPADEO);
}

onMounted(() => {
    // Sin animación si se pide movimiento reducido, si la página se abre en segundo plano o si el
    // JavaScript llega tan tarde que la red de seguridad del CSS (a los 5 s) ya lo habría enseñado.
    if (
        matchMedia(CONSULTA_MOVIMIENTO_REDUCIDO).matches ||
        document.hidden ||
        performance.now() > LIMITE_PARA_ESCRIBIR
    ) {
        terminar();
        cursorOculto.value = true;
        return;
    }

    escribir();
});

// Al cambiar de idioma no se vuelve a escribir: el lema nuevo sale entero.
watch(idioma, terminar);

onBeforeUnmount(() => {
    cancelAnimationFrame(idDeFotograma);
    clearTimeout(temporizador);
});
</script>

<template>
    <!--
        El lema abajo, a lo ancho; encima, el nombre con el puesto, y debajo los botones.
        Si alguien llega con el teclado a un botón antes de que acabe, se salta al final.
    -->
    <section
        aria-labelledby="titulo-hero"
        class="hero-escrito"
        :data-fase="fase"
        @focusin="terminar"
    >
        <ContenedorPagina
            class="flex min-h-[calc(100svh-var(--spacing-cabecera))] flex-col justify-end pt-hero pb-seccion"
        >
            <h1 id="titulo-hero">
                <span class="hero-tardio mb-3 block text-entradilla">
                    {{ nombre }}
                    <span class="text-texto-suave">· {{ sitio.puesto[idioma] }}</span>
                </span>

                <span ref="titular" class="relative block max-w-[14.5em] text-lema">
                    <span class="sr-only">{{ lema }}</span>
                    <span aria-hidden="true">
                        <template v-for="(palabra, numero) in palabras" :key="numero">
                            <!-- Tras la pausa, el segundo trozo empieza en su propia línea. -->
                            <br v-if="palabra.trasLaPausa" />{{
                                numero === 0 || palabra.trasLaPausa
                                    ? ""
                                    : palabra.pegadaALaAnterior
                                      ? "\u00a0"
                                      : " "
                            }}<span class="whitespace-nowrap"
                                ><span
                                    v-for="(letra, posicion) in palabra.letras"
                                    :key="posicion"
                                    class="letra"
                                    :class="{
                                        tecleada: palabra.inicio + posicion < letrasEscritas,
                                    }"
                                    >{{ letra }}</span
                                ></span
                            >
                        </template>
                    </span>
                    <span
                        ref="cursor"
                        class="hero-cursor"
                        :class="{
                            parpadea: fase !== 'escribiendo',
                            apagado: cursorApagado,
                            oculto: cursorOculto,
                        }"
                        aria-hidden="true"
                    />
                </span>
            </h1>

            <div class="hero-tardio mt-5 flex flex-wrap gap-1.5 delay-[250ms]">
                <BotonEnlace :ancla="ANCLA_PROYECTOS">{{ t("hero.verProyectos") }}</BotonEnlace>
                <BotonEnlace :ancla="ANCLA_CONTACTO" variante="secundario">
                    {{ t("hero.contacto") }}
                </BotonEnlace>
            </div>
        </ContenedorPagina>
    </section>
</template>
