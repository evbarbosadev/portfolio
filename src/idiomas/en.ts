import type { DiccionarioParcial } from "./index";

/**
 * Textos de la interfaz en inglés. Si falta una clave, en desarrollo se ve "[FALTA en: clave]"
 * y en producción se usa el texto en español.
 */
const diccionario: DiccionarioParcial = {
    comun: {
        pestañaNueva: "(opens in a new tab)",
        portadaPendiente: "Cover pending",
    },
    portadaAndroid: {
        alt: "Conversation in the messaging app: “Hi!” and “Do you fancy coming over for lunch next week?”.",
        saludo: "Hi!",
        horaSaludo: "3:04 AM",
        invitacion: "Do you fancy coming over for lunch next week?",
        horaInvitacion: "3:05 AM",
    },
    portadaVorlys: {
        alt: "The Vørlys symbol, with “Vørlys Sans · Geist Mono · 400” below.",
    },
    portadaNova: {
        alt: "Conversation in Nova: I ask it to remind me around 11 that I have to pick up the car from the garage, and it replies that it will remind me at 11:00.",
        tu: "You",
        pregunta: "Hey! remind me around 11, I have to go pick up the car from the garage",
        pensado: "How Nova thought it through",
        respuesta: "Done. I will remind you at 11:00 so you can pick up the car from the garage.",
    },
    navegacion: {
        etiqueta: "Main navigation",
        etiquetaMenu: "Sections menu",
        saltar: "Skip to content",
        menu: "Menu",
        cerrarMenu: "Close",
        inicio: "Home",
        proyectos: "Projects",
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
        firma: "Vørlys",
    },
    seo: {
        tituloInicio: "Portfolio",
        tituloNoEncontrada: "Page not found",
    },
};

export default diccionario;
