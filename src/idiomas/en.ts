import type { DiccionarioParcial } from "./index";

/**
 * Textos de la interfaz en inglés. Si falta una clave, en desarrollo se ve "[FALTA en: clave]"
 * y en producción se usa el texto en español.
 */
const diccionario: DiccionarioParcial = {
    comun: {
        pestañaNueva: "(opens in a new tab)",
        portadaPendiente: "Cover pending",
        fotoPendiente: "Photo pending",
    },
    navegacion: {
        etiqueta: "Main navigation",
        etiquetaMenu: "Sections menu",
        saltar: "Skip to content",
        menu: "Menu",
        inicio: "Home",
        proyectos: "Projects",
        fotografia: "Photography",
        sobreMi: "About",
        contacto: "Contact",
    },
    idioma: {
        otroCodigo: "ES",
        otroEtiqueta: "Leer esta página en español",
    },
    tema: {
        etiqueta: "Theme",
        cambiar: "Dark theme",
    },
    hero: {
        verProyectos: "View projects",
        contacto: "Contact",
    },
    proyectos: {
        titulo: "Projects",
        cuantos: "projects",
    },
    laboratorio: {
        titulo: "Lab",
        etiqueta: "In progress",
    },
    estados: {
        activo: "Active",
        terminado: "Finished",
        enPausa: "On hold",
        enCurso: "In progress",
        pausado: "Paused",
        usoPropio: "Personal use",
        archivado: "Archived",
    },
    sobreMi: {
        titulo: "About me",
        ahora: "Now",
        antes: "Before",
        desde: "since",
        stack: "Stack",
        tambien: "Also",
    },
    fotografia: {
        titulo: "Photography",
        etiqueta: "Selection",
        instagram: "More on Instagram",
    },
    contacto: {
        titulo: "Contact",
        email: "Email",
        linkedin: "LinkedIn",
        github: "GitHub",
        instagram: "Instagram",
        cv: "Download CV (PDF)",
    },
    caso: {
        volver: "All projects",
        ficha: "Project details",
        rol: "Role",
        periodo: "Period",
        estado: "Status",
        stack: "Stack",
        enlaces: "Links",
        repo: "Repository",
        demo: "Demo",
        medios: "Screenshots",
        otros: "Other projects",
        anterior: "Previous",
        siguiente: "Next",
    },
    noEncontrada: {
        titulo: "This page does not exist",
        texto: "The link is broken or the page has moved.",
        volver: "Back to home",
    },
    pie: {
        arriba: "Back to top",
        firma: "Made with Vørlys",
    },
    seo: {
        tituloInicio: "Portfolio",
        tituloNoEncontrada: "Page not found",
    },
};

export default diccionario;
