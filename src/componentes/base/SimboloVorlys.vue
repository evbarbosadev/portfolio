<template>
    <!--
        Símbolo plano de Vørlys, sacado del kit de marca (versión negra) sin metadatos
        y con currentColor. Solo se usa pequeño, como firma: nunca el símbolo grande en esta web.
    -->
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-12 -12 124 124" aria-hidden="true">
        <defs>
            <mask
                id="simbolo-vorlys"
                maskUnits="userSpaceOnUse"
                x="-20"
                y="-20"
                width="140"
                height="140"
            >
                <rect x="-20" y="-20" width="140" height="140" fill="#FFFFFF" />
                <line x1="34" y1="104" x2="66" y2="-4" stroke="#000000" stroke-width="21" />
            </mask>
        </defs>
        <circle
            cx="50"
            cy="50"
            r="44.5"
            fill="none"
            stroke="currentColor"
            stroke-width="11"
            mask="url(#simbolo-vorlys)"
        />
        <line x1="34" y1="104" x2="66" y2="-4" stroke="currentColor" stroke-width="11" />
    </svg>
</template>
