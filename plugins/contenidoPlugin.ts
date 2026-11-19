import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import type { Plugin } from "vite";
import { z } from "zod";
import { IDIOMAS, type Idioma } from "../src/constantes.ts";
import {
    esquemaExperiencia,
    esquemaExperimento,
    esquemaProyecto,
    esquemaSitio,
    SECCIONES_DE_CASO,
    type Experiencia,
    type Experimento,
    type Proyecto,
} from "../src/contenido/esquemas.ts";
import { sitio } from "../src/contenido/sitio.ts";

/*
    Plugin de contenido. Lee las colecciones en Markdown (proyectos, laboratorio y experiencia), valida todo el
    contenido con zod y lo sirve como el módulo "virtual:contenido", con las imágenes ya enlazadas
    a vite-imagetools. Al validar aquí, en Node, los errores salen al compilar y zod no viaja al navegador.
*/

const ID_VIRTUAL = "virtual:contenido";
const ID_RESUELTO = `\0${ID_VIRTUAL}`;
const CARPETA_CONTENIDO = "src/contenido";
const COLECCION_PROYECTOS = "proyectos";
const COLECCION_LABORATORIO = "laboratorio";
const COLECCION_EXPERIENCIA = "experiencia";

// Anchos que se generan de cada portada: llegan a ocupar el ancho de la página.
const ANCHOS_DE_PORTADA = "480;960;1440;1920";
const FORMATOS_DE_IMAGEN = "avif;webp;jpg";

/** Una entrada de una colección: un fichero Markdown ya validado. */
interface Entrada<Datos> {
    /** Nombre de la carpeta. Es lo que une las versiones de una misma entrada en cada idioma. */
    id: string;
    /** Ruta de la carpeta desde la raíz del proyecto, con barras normales. */
    carpeta: string;
    datos: Datos;
}

export interface ContenidoLeido {
    proyectos: Entrada<Proyecto>[];
    experimentos: Entrada<Experimento>[];
    experiencias: Entrada<Experiencia>[];
}

/**
 * Lee y valida todo el contenido. Si algo está mal, lanza un único error con todos los fallos,
 * cada uno con su fichero, para poder corregirlos de una vez.
 */
export function leerContenido(raiz: string, hayQueIncluirBorradores: boolean): ContenidoLeido {
    const errores: string[] = [];

    // Datos que viven en ficheros TypeScript: el tipo ya los comprueba, zod añade formatos y longitudes.
    validarDatos(esquemaSitio, sitio, `${CARPETA_CONTENIDO}/sitio.ts`, errores);

    const proyectos = leerColeccion(
        raiz,
        COLECCION_PROYECTOS,
        esquemaProyecto,
        errores,
        comprobarProyecto,
    )
        .filter((proyecto) => hayQueIncluirBorradores || !proyecto.datos.borrador)
        .sort((a, b) => a.datos.orden - b.datos.orden);

    const experimentos = leerColeccion(raiz, COLECCION_LABORATORIO, esquemaExperimento, errores)
        .filter((experimento) => hayQueIncluirBorradores || !experimento.datos.borrador)
        .sort((a, b) => a.datos.orden - b.datos.orden);

    const experiencias = leerColeccion(
        raiz,
        COLECCION_EXPERIENCIA,
        esquemaExperiencia,
        errores,
    ).sort((a, b) => a.datos.orden - b.datos.orden);

    comprobarSlugsUnicos(proyectos, errores);
    comprobarSlugsUnicos(experimentos, errores);

    if (errores.length > 0) {
        throw new Error(`Contenido no válido:\n\n${errores.join("\n\n")}\n`);
    }

    return { proyectos, experimentos, experiencias };
}

/**
 * Valida unos datos contra su esquema y, si fallan, apunta el error con el fichero de donde vienen.
 */
function validarDatos(esquema: z.ZodType, datos: unknown, archivo: string, errores: string[]) {
    const resultado = esquema.safeParse(datos);

    if (!resultado.success) {
        errores.push(`${archivo}\n${z.prettifyError(resultado.error)}`);
    }
}

/**
 * Lee una colección: cada carpeta es una entrada y dentro hay un fichero por idioma (es.md, en.md).
 * La comprobación extra recibe el cuerpo del Markdown por si la colección exige algo de él.
 */
function leerColeccion<Datos extends { idioma: Idioma }>(
    raiz: string,
    coleccion: string,
    esquema: z.ZodType<Datos>,
    errores: string[],
    comprobarEntrada?: (entrada: Entrada<Datos>, cuerpo: string, raiz: string) => string[],
): Entrada<Datos>[] {
    const carpetaColeccion = `${CARPETA_CONTENIDO}/${coleccion}`;
    const entradas: Entrada<Datos>[] = [];

    const ids = readdirSync(join(raiz, carpetaColeccion), { withFileTypes: true })
        .filter((elemento) => elemento.isDirectory())
        .map((elemento) => elemento.name);

    for (const id of ids) {
        for (const idioma of IDIOMAS) {
            const carpeta = `${carpetaColeccion}/${id}`;
            const archivo = `${carpeta}/${idioma}.md`;

            // Si falta la traducción a un idioma, la entrada simplemente no sale en ese idioma.
            if (!existsSync(join(raiz, archivo))) {
                continue;
            }

            const { data, content } = matter(readFileSync(join(raiz, archivo), "utf8"));
            const resultado = esquema.safeParse(data);

            if (!resultado.success) {
                errores.push(`${archivo}\n${z.prettifyError(resultado.error)}`);
                continue;
            }

            const entrada: Entrada<Datos> = { id, carpeta, datos: resultado.data };
            const fallos = comprobarEntrada?.(entrada, content, raiz) ?? [];

            if (entrada.datos.idioma !== idioma) {
                fallos.push(
                    `El campo "idioma" (${entrada.datos.idioma}) no coincide con el fichero (${idioma}.md)`,
                );
            }

            if (fallos.length > 0) {
                errores.push(`${archivo}\n${fallos.map((fallo) => `✖ ${fallo}`).join("\n")}`);
                continue;
            }

            entradas.push(entrada);
        }
    }

    return entradas;
}

/**
 * Comprobaciones propias de un proyecto: que el cuerpo tenga las secciones del caso de estudio
 * y que existan las imágenes que cita.
 */
function comprobarProyecto(entrada: Entrada<Proyecto>, cuerpo: string, raiz: string): string[] {
    const fallos: string[] = [];
    const titulos = [...cuerpo.matchAll(/^##\s+(.+?)\s*$/gm)].map(
        (coincidencia) => coincidencia[1],
    );
    const seccionesQueFaltan = SECCIONES_DE_CASO[entrada.datos.idioma].filter(
        (seccion) => !titulos.includes(seccion),
    );

    // Sin ningún título el cuerpo es texto libre; con alguno, tienen que estar todas las secciones.
    if (titulos.length > 0 && seccionesQueFaltan.length > 0) {
        fallos.push(
            `Faltan secciones en el cuerpo: ${seccionesQueFaltan.map((s) => `"## ${s}"`).join(", ")}`,
        );
    }

    const { portada, medios } = entrada.datos;

    for (const imagen of portada ? [portada, ...medios] : medios) {
        if (!existsSync(join(raiz, entrada.carpeta, imagen.src))) {
            fallos.push(`No existe la imagen ${imagen.src}`);
        }
    }

    return fallos;
}

/**
 * Dos entradas de una colección no pueden compartir slug en el mismo idioma: acabarían en la
 * misma URL (proyectos) o en la misma ancla (laboratorio).
 */
function comprobarSlugsUnicos(
    entradas: Entrada<{ idioma: Idioma; slug: string }>[],
    errores: string[],
) {
    const slugsVistos = new Set<string>();

    for (const { datos, carpeta } of entradas) {
        const clave = `${datos.idioma}/${datos.slug}`;

        if (slugsVistos.has(clave)) {
            errores.push(
                `${carpeta}/${datos.idioma}.md\n✖ El slug "${datos.slug}" ya lo usa otra entrada`,
            );
        }

        slugsVistos.add(clave);
    }
}

/**
 * Genera el código del módulo virtual. Los datos van como JSON y cada imagen como una importación
 * de vite-imagetools, que devuelve sus variantes en AVIF, WebP y JPG a varios anchos.
 */
function generarModulo(contenido: ContenidoLeido): string {
    const importaciones = new Map<string, string>();

    /**
     * Registra la importación de una imagen (una sola vez por imagen) y devuelve su identificador.
     */
    function importarImagen(ruta: string, anchos: string): string {
        const origen = `/${ruta.replace("/./", "/")}?w=${anchos}&format=${FORMATOS_DE_IMAGEN}&as=picture`;

        if (!importaciones.has(origen)) {
            importaciones.set(origen, `imagen${importaciones.size}`);
        }

        return importaciones.get(origen) as string;
    }

    const proyectos = contenido.proyectos.map(({ id, carpeta, datos }) => {
        const { portada, medios, ...resto } = datos;
        const imagenConAlt = (imagen: Proyecto["medios"][number]) =>
            `{ imagen: ${importarImagen(`${carpeta}/${imagen.src}`, ANCHOS_DE_PORTADA)}, alt: ${JSON.stringify(imagen.alt)} }`;
        // Sin portada, el proyecto la tiene pendiente y la web pinta su hueco.
        const portadaCargada = portada ? imagenConAlt(portada) : "undefined";

        return `{ ...${JSON.stringify({ id, ...resto })}, portada: ${portadaCargada}, medios: [${medios.map(imagenConAlt).join(", ")}] }`;
    });

    const experimentos = contenido.experimentos.map(({ id, datos }) =>
        JSON.stringify({ id, ...datos }),
    );

    const experiencias = contenido.experiencias.map(({ id, datos }) =>
        JSON.stringify({ id, ...datos }),
    );

    return [
        ...[...importaciones].map(
            ([origen, nombre]) => `import ${nombre} from ${JSON.stringify(origen)};`,
        ),
        `export const proyectos = [${proyectos.join(", ")}];`,
        `export const experimentos = [${experimentos.join(", ")}];`,
        `export const experiencias = [${experiencias.join(", ")}];`,
    ].join("\n");
}

/**
 * Plugin de Vite que expone el contenido validado como "virtual:contenido".
 */
export function contenidoPlugin(): Plugin {
    let raiz = process.cwd();
    let hayQueIncluirBorradores = true;

    return {
        name: "portfolio:contenido",

        configResolved(configuracion) {
            raiz = configuracion.root;
            // Los borradores se ven en desarrollo y no salen en producción.
            hayQueIncluirBorradores = !configuracion.isProduction;

            const urlSitio = z.url().safeParse(configuracion.env.VITE_URL_SITIO);

            if (!urlSitio.success) {
                throw new Error(
                    "VITE_URL_SITIO tiene que ser la URL pública del sitio (ver .env).",
                );
            }
        },

        resolveId(id) {
            return id === ID_VIRTUAL ? ID_RESUELTO : undefined;
        },

        load(id) {
            return id === ID_RESUELTO
                ? generarModulo(leerContenido(raiz, hayQueIncluirBorradores))
                : undefined;
        },

        configureServer(servidor) {
            /**
             * En desarrollo, al tocar cualquier fichero de contenido se descarta el módulo virtual
             * y se recarga la página, para ver el cambio (o el error de validación) al momento.
             */
            function recargarContenido(archivo: string) {
                if (!archivo.replaceAll("\\", "/").includes(`/${CARPETA_CONTENIDO}/`)) {
                    return;
                }

                const modulo = servidor.moduleGraph.getModuleById(ID_RESUELTO);

                if (modulo) {
                    servidor.moduleGraph.invalidateModule(modulo);
                }

                servidor.ws.send({ type: "full-reload" });
            }

            servidor.watcher
                .on("add", recargarContenido)
                .on("change", recargarContenido)
                .on("unlink", recargarContenido);
        },
    };
}
