<script setup lang="ts">
import ContactoSection from "@/componentes/secciones/ContactoSection.vue";
import HeroSection from "@/componentes/secciones/HeroSection.vue";
import LaboratorioSection from "@/componentes/secciones/LaboratorioSection.vue";
import ProyectosSection from "@/componentes/secciones/ProyectosSection.vue";
import SobreMiSection from "@/componentes/secciones/SobreMiSection.vue";
import { getUrlAbsoluta, useCabecera } from "@/composables/useCabecera";
import { useIdioma } from "@/composables/useIdioma";
import { useTextos } from "@/composables/useTextos";
import { IDIOMAS } from "@/constantes";
import { sitio } from "@/contenido/sitio";
import { getRutaInicio } from "@/rutas";
import { esMarcador } from "@/utilidades/marcadores";

const { t } = useTextos();
const { idioma } = useIdioma();

const nombre = sitio.nombreEnLineas.join(" ");
const urlInicio = getUrlAbsoluta("/");

useCabecera(() => ({
    titulo: t("seo.tituloInicio"),
    descripcion: `${sitio.puesto[idioma.value]}. ${sitio.lema[idioma.value].join(" ")}`,
    rutas: { es: getRutaInicio("es"), en: getRutaInicio("en") },
    claveImagenOg: "inicio",
    // Datos estructurados: quién es la persona y cuál es el sitio, para buscadores.
    datosEstructurados: [
        {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "WebSite",
                    "@id": `${urlInicio}#sitio`,
                    url: urlInicio,
                    name: nombre,
                    inLanguage: IDIOMAS,
                },
                {
                    "@type": "Person",
                    "@id": `${urlInicio}#persona`,
                    url: urlInicio,
                    name: nombre,
                    jobTitle: sitio.rol[idioma.value],
                    // Solo se declaran los perfiles que ya tienen su URL real.
                    sameAs: Object.values(sitio.enlaces).filter((enlace) => !esMarcador(enlace)),
                },
            ],
        },
    ],
}));
</script>

<template>
    <!-- La página principal es una sola página que se recorre con scroll, sección a sección. -->
    <HeroSection />
    <ProyectosSection />
    <LaboratorioSection />
    <SobreMiSection />
    <ContactoSection />
</template>
