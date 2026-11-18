import { proyectos, type ProyectoCargado } from "virtual:contenido";
import type {
    NavigationGuard,
    RouteLocationNormalizedLoaded,
    RouteRecordRaw,
    RouterScrollBehavior,
} from "vue-router";
import {
    RUTA_INICIO_EN,
    RUTA_INICIO_ES,
    RUTA_NO_ENCONTRADA,
    RUTA_PROYECTO_EN,
    RUTA_PROYECTO_ES,
    CONSULTA_MOVIMIENTO_REDUCIDO,
    type Idioma,
} from "./constantes";
import { buscarProyecto, buscarTraduccion } from "./contenido/consultas";

const InicioPage = () => import("./paginas/InicioPage.vue");
const ProyectoPage = () => import("./paginas/ProyectoPage.vue");
const NoEncontradaPage = () => import("./paginas/NoEncontradaPage.vue");

/**
 * Antes de entrar a un caso de estudio comprueba que el proyecto existe. Si no, muestra la 404
 * sin cambiar la URL que ha escrito el visitante.
 */
const comprobarProyecto: NavigationGuard = (destino) => {
    const idioma = destino.meta.idioma;

    if (idioma && buscarProyecto(idioma, String(destino.params.slug))) {
        return true;
    }

    return {
        name: RUTA_NO_ENCONTRADA,
        params: { resto: destino.path.slice(1).split("/") },
        query: destino.query,
        hash: destino.hash,
    };
};

export const rutas: RouteRecordRaw[] = [
    { path: "/", name: RUTA_INICIO_ES, component: InicioPage, meta: { idioma: "es" } },
    { path: "/en", name: RUTA_INICIO_EN, component: InicioPage, meta: { idioma: "en" } },
    {
        path: "/proyectos/:slug",
        name: RUTA_PROYECTO_ES,
        component: ProyectoPage,
        meta: { idioma: "es" },
        beforeEnter: comprobarProyecto,
    },
    {
        path: "/en/projects/:slug",
        name: RUTA_PROYECTO_EN,
        component: ProyectoPage,
        meta: { idioma: "en" },
        beforeEnter: comprobarProyecto,
    },
    // Cualquier otra dirección cae aquí. La 404 es bilingüe, así que no lleva idioma.
    { path: "/:resto(.*)*", name: RUTA_NO_ENCONTRADA, component: NoEncontradaPage },
];

/**
 * Devuelve la ruta de la página principal en un idioma.
 */
export function getRutaInicio(idioma: Idioma): string {
    return idioma === "es" ? "/" : "/en";
}

/**
 * Devuelve la ruta de una sección de la página principal, para enlazarla desde cualquier página.
 */
export function getRutaSeccion(idioma: Idioma, ancla: string): string {
    return `${getRutaInicio(idioma)}#${ancla}`;
}

/**
 * Devuelve la ruta del caso de estudio de un proyecto, en el idioma del propio proyecto.
 */
export function getRutaProyecto(proyecto: Pick<ProyectoCargado, "idioma" | "slug">): string {
    return proyecto.idioma === "es"
        ? `/proyectos/${proyecto.slug}`
        : `/en/projects/${proyecto.slug}`;
}

/**
 * Busca la página equivalente a la actual en otro idioma. Si no la hay (por ejemplo, un proyecto
 * sin traducir), lleva al inicio de ese idioma.
 */
export function getRutaEquivalente(
    ruta: RouteLocationNormalizedLoaded,
    idiomaDestino: Idioma,
): string {
    const idiomaActual = ruta.meta.idioma;
    const esProyecto = ruta.name === RUTA_PROYECTO_ES || ruta.name === RUTA_PROYECTO_EN;

    if (esProyecto && idiomaActual) {
        const proyecto = buscarProyecto(idiomaActual, String(ruta.params.slug));
        const traduccion = proyecto && buscarTraduccion(proyecto, idiomaDestino);

        if (traduccion) {
            return getRutaProyecto(traduccion);
        }
    }

    return getRutaInicio(idiomaDestino);
}

/**
 * Lista de direcciones que se prerenderizan: las dos páginas principales, todos los casos de
 * estudio y la 404, que Firebase sirve desde 404.html.
 */
export function getRutasDePrerender(): string[] {
    return ["/", "/en", "/404", ...proyectos.map(getRutaProyecto)];
}

/**
 * Decide dónde queda el scroll al navegar: donde estaba al volver atrás, en el ancla si la hay
 * y arriba en una página nueva. Dentro de la misma página el salto al ancla es suave, salvo con
 * movimiento reducido.
 */
export const comportamientoDeScroll: RouterScrollBehavior = (destino, origen, posicionGuardada) => {
    if (posicionGuardada) {
        return posicionGuardada;
    }

    if (destino.hash) {
        const esMismaPagina = destino.path === origen.path;
        const prefiereMovimientoReducido = matchMedia(CONSULTA_MOVIMIENTO_REDUCIDO).matches;

        // El router no aplica el scroll-padding del CSS: se le pasa el hueco de la cabecera fija.
        const huecoDeCabecera = parseFloat(
            getComputedStyle(document.documentElement).scrollPaddingTop,
        );

        return {
            el: destino.hash,
            top: huecoDeCabecera || 0,
            behavior: esMismaPagina && !prefiereMovimientoReducido ? "smooth" : "auto",
        };
    }

    return { top: 0 };
};
