<script setup lang="ts">
/*
    Las luces del fondo (ver «LUZ DE FONDO» en base.css). Va una vez detrás de toda la página y
    otra dentro de la cabecera, que es opaca, recortada a su altura para que la luz no se corte.
*/
defineProps<{
    // Dentro de la cabecera: solo se ve la franja que ocupa ella.
    soloCabecera?: boolean;
}>();
</script>

<template>
    <div
        class="luz-de-fondo"
        :class="{ 'luz-de-fondo--cabecera': soloCabecera }"
        aria-hidden="true"
    >
        <span />
        <span />
        <span />
    </div>
</template>
