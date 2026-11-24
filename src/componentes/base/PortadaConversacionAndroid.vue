<script setup lang="ts">
import { useTextos } from "@/composables/useTextos";

/**
 * Portada de la app de mensajería hecha en HTML: dos mensajes reales de la conversación, con el
 * verde azulado de la propia app, sobre la superficie leve del marco. Se ajusta sola al marco,
 * sea 4:3 en la tarjeta o 16:9 en el caso.
 */

const { t } = useTextos();
</script>

<template>
    <!-- Es una imagen para los lectores de pantalla: dice lo que pasa en la conversación. -->
    <span class="portada-de-android" role="img" :aria-label="t('portadaAndroid.alt')">
        <span class="portada-de-android__conversacion" aria-hidden="true">
            <span class="portada-de-android__mensaje">{{ t("portadaAndroid.saludo") }}</span>
            <span class="portada-de-android__hora">{{ t("portadaAndroid.horaSaludo") }}</span>
            <span class="portada-de-android__mensaje">{{ t("portadaAndroid.invitacion") }}</span>
            <span class="portada-de-android__hora">{{ t("portadaAndroid.horaInvitacion") }}</span>
        </span>
    </span>
</template>
