<template>
    <!-- Retícula de la página: 4 columnas en móvil, 6 en tablet y 12 en escritorio. -->
    <div
        class="grid grid-cols-4 gap-x-2 tablet:grid-cols-6 escritorio:grid-cols-12 escritorio:gap-x-3"
    >
        <slot />
    </div>
</template>
