import type { DatosDelSitio } from "./esquemas";

/**
 * Datos del sitio. Único fichero con el nombre, el rol, el lema y los enlaces de contacto.
 * La URL pública no va aquí: se lee de la variable VITE_URL_SITIO (ver .env).
 */
export const sitio: DatosDelSitio = {
    // Nombre y apellido; juntos forman el nombre completo.
    nombreEnLineas: ["Vinícius", "Barbosa"],
    // El rol va en los datos estructurados y en la imagen OG; en la web lo dice el puesto del hero.
    rol: {
        es: "Desarrollador full stack",
        en: "Full-stack developer",
    },
    // El puesto va pequeño junto al nombre, encima del lema.
    puesto: {
        es: "Desarrollador full stack en Ayesa Digital",
        en: "Full-stack developer at Ayesa Digital",
    },
    // El lema es el titular del hero. Se escribe en dos golpes, con una pausa entre ellos.
    lema: {
        es: ["Software que funciona bien.", "Y se ve bien."],
        en: ["Software that works well.", "And looks good."],
    },
    // Bloque de texto corto de la sección «Sobre mí». Un salto de línea separa párrafos.
    sobreMi: {
        es: "En Ayesa Digital hago sobre todo backend con Java y bastante gestión de incidencias, así que estoy acostumbrado a no parar hasta dar con la causa de un fallo. Fuera del trabajo me hago mis propias herramientas: un agente de IA sin frameworks, mi marca y una versión propia de la tipografía de esta web. Lo que no sé, lo aprendo. Y sí, soy de los que revisan dos veces un margen de 2 píxeles.",
        en: "At Ayesa Digital I mostly work on the backend with Java, plus a fair amount of incident management, so I'm used to digging until I find the root cause of a bug. Outside work I build my own tools: an AI agent with no frameworks, my own brand and a custom version of the typeface on this site. If I don't know something, I learn it. And yes, I'm the kind of person who checks a 2-pixel margin twice.",
    },
    stack: ["Java 21 · SQL · Open Liberty · Docker", "Vue · Vite · Tailwind · Android"],
    tambien: {
        es: "Impresión 3D y fotografía",
        en: "3D printing and photography",
    },
    email: "evbarbosadev@gmail.com",
    enlaces: {
        linkedin: "https://www.linkedin.com/in/evbarbosadev/",
        github: "https://github.com/evbarbosadev",
        instagram: "https://www.instagram.com/viny.vision/",
    },
    usuarioInstagram: "viny.visiøn",
};
