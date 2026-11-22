<script setup lang="ts">
import { sitio } from "@/contenido/sitio";

/**
 * Portada del portfolio hecha en HTML: las líneas de sitio.ts donde vive el lema, en mono, con el
 * texto del lema en blanco y el resto en gris. Sale del lema de verdad, así que si cambia el lema
 * cambia la portada. Se ajusta sola al marco (4:3 en la tarjeta, 16:9 en el caso).
 */

// Sangría de la segunda frase: justo debajo de la primera, tras «    es: [».
const SANGRIA_DEL_SEGUNDO_TROZO = " ".repeat(9);

const lineasPorIdioma = Object.entries(sitio.lema);
</script>

<template>
    <!-- Decorativa: el título del proyecto ya dice qué es. -->
    <span class="portada-de-codigo" aria-hidden="true">
        <span class="portada-de-codigo__luz" />
        <!-- prettier-ignore -->
        <pre class="portada-de-codigo__codigo">// El lema es el titular del hero.
lema: {
<template v-for="[idioma, [primerTrozo, segundoTrozo]] in lineasPorIdioma" :key="idioma">    {{ idioma }}: [<b>"{{ primerTrozo }}"</b>,
{{ SANGRIA_DEL_SEGUNDO_TROZO }}<b>"{{ segundoTrozo }}"</b>],
</template>},</pre>
    </span>
</template>
