<script setup lang="ts">
/*
    Las luces del fondo (ver «LUZ DE FONDO» en base.css). Va una vez detrás de toda la página y
    otra dentro de la cabecera, enmascarada, que hace de niebla.
*/
defineProps<{
    // Dentro de la cabecera: solo se ve la franja de la niebla.
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
