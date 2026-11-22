/*
    Constantes compartidas por toda la web. Este fichero no pasa por Prettier (ver .prettierignore)
    para poder mantener los "=" alineados en columna.
*/

// Idiomas
export const IDIOMAS            = ["es", "en"] as const;
export const IDIOMA_POR_DEFECTO = "es";
// Clave de localStorage del idioma elegido con el botón ES/EN; public/tema.js la lee para no redirigir.
export const CLAVE_IDIOMA       = "idioma";

// Temas. CLAVE_TEMA es la clave de localStorage; public/tema.js usa la misma antes del primer pintado.
export const TEMA_CLARO  = "claro";
export const TEMA_OSCURO = "oscuro";
export const CLAVE_TEMA  = "tema";

// Nombres de las rutas
export const RUTA_INICIO_ES     = "inicio-es";
export const RUTA_INICIO_EN     = "inicio-en";
export const RUTA_PROYECTO_ES   = "proyecto-es";
export const RUTA_PROYECTO_EN   = "proyecto-en";
export const RUTA_NO_ENCONTRADA = "no-encontrada";

// Anclas de las secciones de la página principal
export const ANCLA_PROYECTOS   = "proyectos";
export const ANCLA_LABORATORIO = "laboratorio";
export const ANCLA_SOBRE_MI    = "sobre-mi";
export const ANCLA_CONTACTO    = "contacto";
export const ANCLA_CONTENIDO   = "contenido";

// Contenido. La ficha del laboratorio y el resumen de un proyecto admiten una o dos frases.
export const ESTADOS_DE_PROYECTO    = ["activo", "terminado", "en pausa"] as const;
export const ESTADOS_DE_EXPERIMENTO = ["en curso", "pausado", "uso propio", "archivado"] as const;
export const PREFIJO_MARCADOR       = "[POR RELLENAR";
// Portadas que no son una imagen, sino un trozo de la web hecho en HTML para el marco.
export const PORTADAS_EN_VIVO       = ["codigo-del-lema"] as const;
export const LONGITUD_MAX_RESUMEN   = 260;
export const LONGITUD_MAX_FICHA     = 240;

// Media queries que consulta el JavaScript
export const CONSULTA_MOVIMIENTO_REDUCIDO = "(prefers-reduced-motion: reduce)";
export const CONSULTA_TEMA_OSCURO         = "(prefers-color-scheme: dark)";

export type Idioma = (typeof IDIOMAS)[number];
export type Tema = typeof TEMA_CLARO | typeof TEMA_OSCURO;
export type EstadoDeProyecto = (typeof ESTADOS_DE_PROYECTO)[number];
export type EstadoDeExperimento = (typeof ESTADOS_DE_EXPERIMENTO)[number];
export type PortadaEnVivo = (typeof PORTADAS_EN_VIVO)[number];
