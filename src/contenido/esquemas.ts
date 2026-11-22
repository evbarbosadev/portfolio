import { z } from "zod";
import {
    ESTADOS_DE_EXPERIMENTO,
    ESTADOS_DE_PROYECTO,
    IDIOMAS,
    LONGITUD_MAX_FICHA,
    LONGITUD_MAX_RESUMEN,
    PORTADAS_EN_VIVO,
    PREFIJO_MARCADOR,
    type Idioma,
} from "../constantes.ts";

/*
    Esquemas del contenido. Solo los usa el plugin de contenido (plugins/contenidoPlugin.ts),
    que valida todo al compilar: un fichero mal rellenado rompe el build con un error claro.
    El resto del código importa de aquí únicamente los tipos, así que zod no llega al navegador.
*/

// Los mensajes de error de validación salen en español.
z.config(z.locales.es());

const texto = z.string().trim().min(1);
const idioma = z.enum(IDIOMAS);
const slug = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Solo minúsculas, números y guiones");

// Mientras falte un dato real se admite un marcador "[POR RELLENAR: ...]" en su lugar.
const marcador = z.string().startsWith(PREFIJO_MARCADOR);
const urlOMarcador = z.union([z.url(), marcador]);
const emailOMarcador = z.union([z.email(), marcador]);

/**
 * Crea el esquema de un texto que existe en todos los idiomas, por ejemplo { es: "...", en: "..." }.
 */
function porIdioma() {
    return z.strictObject({ es: texto, en: texto });
}

/** Imagen del contenido: ruta relativa a la carpeta del fichero y texto alternativo obligatorio. */
const esquemaImagen = z.strictObject({
    src: texto,
    alt: texto,
});

export const esquemaProyecto = z.strictObject({
    titulo: texto,
    slug,
    idioma,
    resumen: texto.max(LONGITUD_MAX_RESUMEN),
    /** Área del proyecto (Software, Marca, Web...). Va en la etiqueta de la tarjeta, junto al periodo. */
    rama: texto,
    periodo: texto,
    estado: z.enum(ESTADOS_DE_PROYECTO),
    stack: z.array(texto).min(1),
    enlaces: z
        .strictObject({
            repo: urlOMarcador.optional(),
            demo: urlOMarcador.optional(),
        })
        .default({}),
    /** Sin portada, la web pinta un hueco con «Portada pendiente». */
    portada: esquemaImagen.optional(),
    /** Portada hecha en HTML en vez de imagen. Si la hay, manda sobre la portada en imagen. */
    portadaEnVivo: z.enum(PORTADAS_EN_VIVO).optional(),
    /** La portada es clara: va sobre la superficie leve en vez de la oscura. */
    portadaClara: z.boolean().default(false),
    medios: z.array(esquemaImagen).default([]),
    destacado: z.boolean().default(false),
    orden: z.number().int(),
    borrador: z.boolean().default(false),
});

/** Ficha corta del laboratorio. No tiene página de detalle: el slug sirve de ancla dentro de la sección. */
export const esquemaExperimento = z.strictObject({
    titulo: texto,
    slug,
    idioma,
    resumen: texto.max(LONGITUD_MAX_FICHA),
    estado: z.enum(ESTADOS_DE_EXPERIMENTO),
    enlace: urlOMarcador.optional(),
    orden: z.number().int(),
    borrador: z.boolean().default(false),
});

export const esquemaExperiencia = z.strictObject({
    empresa: texto,
    puesto: texto,
    inicio: texto,
    fin: texto.optional(),
    idioma,
    orden: z.number().int().default(0),
});

export const esquemaSitio = z.strictObject({
    nombreEnLineas: z.array(texto).min(1),
    rol: porIdioma(),
    puesto: porIdioma(),
    lema: z.strictObject({ es: z.tuple([texto, texto]), en: z.tuple([texto, texto]) }),
    sobreMi: porIdioma(),
    // Ficha de «Sobre mí»: el stack en dos líneas (la principal y la secundaria) y lo que hay además.
    stack: z.tuple([texto, texto]),
    tambien: porIdioma(),
    email: emailOMarcador,
    enlaces: z.strictObject({
        linkedin: urlOMarcador,
        github: urlOMarcador,
        instagram: urlOMarcador,
    }),
    // Nombre de la cuenta de Instagram tal como se escribe, para el texto del enlace.
    usuarioInstagram: texto,
});

/**
 * Secciones que tiene que tener el cuerpo de un caso de estudio, como títulos de segundo nivel
 * ("## Problema"), si se divide en secciones; un cuerpo sin ningún título es texto libre.
 * El stack, los enlaces y los medios salen del frontmatter.
 */
export const SECCIONES_DE_CASO: Record<Idioma, string[]> = {
    es: ["Problema", "Qué hice yo", "Decisiones técnicas", "Resultado"],
    en: ["Problem", "What I did", "Technical decisions", "Outcome"],
};

export type Proyecto = z.infer<typeof esquemaProyecto>;
export type Experimento = z.infer<typeof esquemaExperimento>;
export type Experiencia = z.infer<typeof esquemaExperiencia>;
export type DatosDelSitio = z.infer<typeof esquemaSitio>;
