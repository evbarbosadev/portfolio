import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import satori from "satori";
import { IDIOMAS } from "../src/constantes.ts";
import { sitio } from "../src/contenido/sitio.ts";
import { ALTO_OG, ANCHO_OG, CARPETA_OG, getRutaImagenOg } from "../src/utilidades/imagenesOg.ts";
import { leerContenido } from "./contenidoPlugin.ts";

/*
    Genera las imágenes Open Graph al final del build: una por página y por idioma. Se dibujan con
    satori (texto y cajas a SVG) y resvg (SVG a PNG), con las mismas fuentes y colores que la web.
    La de inicio lleva el nombre y el rol; la de cada proyecto, el título y una etiqueta en mono
    («SOFTWARE · 2026 · VINÍCIUS BARBOSA»). El resumen no va en la imagen: ya sale en og:description.

    satori no lee woff2, así que usa copias en woff: Vørlys Sans, convertida con fontTools desde
    src/recursos/fuentes/VorlysSans-Regular.woff2, y Geist Mono 400 (subconjunto latino), sacada tal cual
    de @fontsource/geist-mono 5.3.0, la misma versión que usa la web. Si una fuente cambia, hay que
    regenerar su copia y actualizar sus métricas aquí. La tarjeta no lleva logotipo: como en el
    pie de la web, Vørlys solo firma con el símbolo plano, abajo a la derecha y en gris.
*/

const ARCHIVO_FUENTE_TEXTO = "plugins/fuentes/VorlysSans-Regular.woff";
const ARCHIVO_FUENTE_MONO = "plugins/fuentes/GeistMono-Regular.woff";
const ARCHIVO_SIMBOLO = "src/recursos/vorlys-simbolo-plano-blanco.svg";
const ARCHIVO_TOKENS = "src/estilos/tokens.css";
const FUENTE_TEXTO = "Vørlys Sans";
const FUENTE_MONO = "Geist Mono";

// Margen de la tarjeta, el mismo en los cuatro lados. Abajo se mide hasta la línea base del texto.
const MARGEN = 72;
// Métricas verticales de cada fuente (tabla hhea, en em), para saber dónde cae la línea base.
const METRICAS = {
    [FUENTE_TEXTO]: { ascendente: 2000 / 2048, descendente: 528 / 2048 },
    [FUENTE_MONO]: { ascendente: 1005 / 1000, descendente: 295 / 1000 },
};

interface EstiloDeLinea {
    fontFamily: typeof FUENTE_TEXTO | typeof FUENTE_MONO;
    fontSize: number;
    lineHeight: number;
    letterSpacing?: string;
}

// La línea de debajo del título: el rol en la de inicio y la etiqueta en las de proyecto.
const ESTILO_ROL: EstiloDeLinea = { fontFamily: FUENTE_TEXTO, fontSize: 32, lineHeight: 1.3 };
const ESTILO_ETIQUETA: EstiloDeLinea = {
    fontFamily: FUENTE_MONO,
    fontSize: 24,
    lineHeight: 1.3,
    letterSpacing: "0.04em",
};
// Caja del trazo visible del símbolo: el viewBox del SVG deja 12 unidades de aire alrededor, y el
// palo, de 11 de grosor, sobresale del círculo por arriba y por abajo (de y = -5,5625 a 105,5625).
const CAJA_SIMBOLO = { x: 0, y: -5.5625, ancho: 100, alto: 111.125 };
const ALTO_SIMBOLO = 40;
const ANCHO_SIMBOLO = Math.round((ALTO_SIMBOLO * CAJA_SIMBOLO.ancho) / CAJA_SIMBOLO.alto);
const SEPARACION_SIMBOLO = 48;
// La tarjeta del proyecto Vørlys no firma: su título ya es el nombre de la marca, y la regla
// «una sola V» no deja juntar nombre y símbolo.
const ID_PROYECTO_DE_LA_MARCA = "vorlys";

/**
 * Distancia de la línea base al borde inferior de la caja de una línea de texto: la mitad del
 * interlineado sobrante más el descendente. Sirve para apoyar la línea base sobre el margen.
 */
function getDistanciaBaseAFondo(estilo: EstiloDeLinea): number {
    const { ascendente, descendente } = METRICAS[estilo.fontFamily];
    const tamaño = estilo.fontSize;

    return (
        (tamaño * estilo.lineHeight - (ascendente + descendente) * tamaño) / 2 +
        descendente * tamaño
    );
}

/**
 * Impide que satori corte una palabra por su guion («end-to-end»): al partirla así la medía mal y
 * dejaba un hueco de más tras ella. La unión de palabra (U+2060) no se ve ni ocupa espacio.
 */
function sinCortesEnGuiones(texto: string): string {
    return texto.replaceAll("-", "\u2060-\u2060");
}

/**
 * Prepara el símbolo plano como data URI: recortado a su trazo visible, para que el margen se
 * mida desde el dibujo y no desde el aire del viewBox, y en el color pedido. La máscara interior
 * conserva su blanco y su negro, que solo deciden qué se ve.
 */
function getSimbolo(raiz: string, color: string): string {
    const simbolo = readFileSync(join(raiz, ARCHIVO_SIMBOLO), "utf8")
        .replace(/<metadata>[\s\S]*?<\/metadata>/, "")
        .replace(
            /viewBox="[^"]*"/,
            `viewBox="${CAJA_SIMBOLO.x} ${CAJA_SIMBOLO.y} ${CAJA_SIMBOLO.ancho} ${CAJA_SIMBOLO.alto}"`,
        )
        .replaceAll('stroke="#FFFFFF"', `stroke="${color}"`);

    return `data:image/svg+xml;base64,${Buffer.from(simbolo).toString("base64")}`;
}

interface TarjetaOg {
    /** Ruta pública de la imagen, por ejemplo /og/inicio-es.png. */
    ruta: string;
    titulo: string;
    /** Línea de debajo del título: el rol o la etiqueta del proyecto, cada uno con su estilo. */
    subtitulo: string;
    estiloSubtitulo: EstiloDeLinea;
    llevaFirma: boolean;
}

/**
 * Lee un color de tokens.css para no tener una segunda copia de la paleta aquí.
 */
function leerColor(tokens: string, nombre: string): string {
    const coincidencia = tokens.match(new RegExp(`--color-${nombre}:\\s*(#[0-9a-f]{6})`, "i"));

    if (!coincidencia?.[1]) {
        throw new Error(`No se encuentra el color --color-${nombre} en ${ARCHIVO_TOKENS}.`);
    }

    return coincidencia[1];
}

/**
 * Reúne las tarjetas que hay que generar: la página principal y cada caso de estudio, por idioma.
 */
function getTarjetas(raiz: string): TarjetaOg[] {
    const nombre = sitio.nombreEnLineas.join(" ");
    const { proyectos } = leerContenido(raiz, false);

    const tarjetasDeInicio = IDIOMAS.map((idioma) => ({
        ruta: getRutaImagenOg("inicio", idioma),
        titulo: nombre,
        subtitulo: sitio.rol[idioma],
        estiloSubtitulo: ESTILO_ROL,
        llevaFirma: true,
    }));

    const tarjetasDeProyecto = proyectos.map(({ id, datos }) => ({
        ruta: getRutaImagenOg(id, datos.idioma),
        titulo: datos.titulo,
        subtitulo: [datos.rama, datos.periodo, nombre].join(" · ").toLocaleUpperCase(datos.idioma),
        estiloSubtitulo: ESTILO_ETIQUETA,
        llevaFirma: id !== ID_PROYECTO_DE_LA_MARCA,
    }));

    return [...tarjetasDeInicio, ...tarjetasDeProyecto];
}

/**
 * Genera todas las imágenes Open Graph dentro de la carpeta de salida del build.
 */
export async function generarImagenesOg(raiz: string, carpetaSalida: string) {
    const tokens = readFileSync(join(raiz, ARCHIVO_TOKENS), "utf8");
    const colorFondo = leerColor(tokens, "tinta");
    const colorTexto = leerColor(tokens, "papel");
    const colorSuave = leerColor(tokens, "gris-500");
    const fuentes = (
        [
            [FUENTE_TEXTO, ARCHIVO_FUENTE_TEXTO],
            [FUENTE_MONO, ARCHIVO_FUENTE_MONO],
        ] as const
    ).map(([nombre, archivo]) => ({
        name: nombre,
        data: readFileSync(join(raiz, archivo)),
        weight: 400 as const,
        style: "normal" as const,
    }));

    const urlSimbolo = getSimbolo(raiz, colorSuave);

    mkdirSync(join(carpetaSalida, CARPETA_OG), { recursive: true });

    for (const tarjeta of getTarjetas(raiz)) {
        const distanciaBaseAFondo = getDistanciaBaseAFondo(tarjeta.estiloSubtitulo);
        // satori recibe un árbol de elementos como el de React, pero escrito como objetos planos.
        const svg = await satori(
            {
                type: "div",
                props: {
                    style: {
                        // border-box: el relleno cuenta dentro de los 1200 × 630, no se suma a ellos.
                        boxSizing: "border-box",
                        width: ANCHO_OG,
                        height: ALTO_OG,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-end",
                        padding: MARGEN,
                        backgroundColor: colorFondo,
                        color: colorTexto,
                        fontFamily: FUENTE_TEXTO,
                    },
                    children: [
                        {
                            type: "div",
                            props: {
                                // La fila baja lo que hay de la línea base al fondo de la última
                                // línea: así la línea base, y no la caja, se apoya en el margen.
                                style: {
                                    display: "flex",
                                    alignItems: "flex-end",
                                    marginBottom: -distanciaBaseAFondo,
                                },
                                children: [
                                    {
                                        type: "div",
                                        props: {
                                            style: {
                                                display: "flex",
                                                flexDirection: "column",
                                                flexGrow: 1,
                                                flexShrink: 1,
                                                marginRight: SEPARACION_SIMBOLO,
                                            },
                                            children: [
                                                {
                                                    type: "div",
                                                    props: {
                                                        style: {
                                                            fontSize: 88,
                                                            fontWeight: 400,
                                                            lineHeight: 1.02,
                                                            letterSpacing: "-0.03em",
                                                        },
                                                        children: sinCortesEnGuiones(
                                                            tarjeta.titulo,
                                                        ),
                                                    },
                                                },
                                                {
                                                    type: "div",
                                                    props: {
                                                        style: {
                                                            ...tarjeta.estiloSubtitulo,
                                                            marginTop: 32,
                                                            fontWeight: 400,
                                                            color: colorSuave,
                                                        },
                                                        children: sinCortesEnGuiones(
                                                            tarjeta.subtitulo,
                                                        ),
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                    // La firma: el símbolo plano, con su base en la línea base.
                                    ...(tarjeta.llevaFirma
                                        ? [
                                              {
                                                  type: "img",
                                                  props: {
                                                      src: urlSimbolo,
                                                      width: ANCHO_SIMBOLO,
                                                      height: ALTO_SIMBOLO,
                                                      style: {
                                                          flexShrink: 0,
                                                          marginBottom: distanciaBaseAFondo,
                                                      },
                                                  },
                                              },
                                          ]
                                        : []),
                                ],
                            },
                        },
                    ],
                },
            },
            { width: ANCHO_OG, height: ALTO_OG, fonts: fuentes },
        );

        writeFileSync(join(carpetaSalida, tarjeta.ruta), new Resvg(svg).render().asPng());
    }
}
