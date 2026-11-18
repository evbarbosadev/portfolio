import { ViteSSG } from "vite-ssg";
import App from "./App.vue";
import { activarTransicionesDePagina } from "./movimiento/transicionesDePagina";
import { comportamientoDeScroll, getRutasDePrerender, rutas } from "./rutas";
import "./estilos/principal.css";

/**
 * Punto de entrada. vite-ssg crea la app una vez por ruta al prerenderizar y una vez en el navegador,
 * donde hidrata el HTML ya generado en lugar de volver a pintarlo.
 */
export const createApp = ViteSSG(
    App,
    { routes: rutas, scrollBehavior: comportamientoDeScroll },
    ({ router }) => {
        // Las transiciones entre páginas solo existen en el navegador.
        if (!import.meta.env.SSR) {
            activarTransicionesDePagina(router);
        }
    },
    { hydration: true },
);

/**
 * vite-ssg pregunta aquí qué direcciones tiene que prerenderizar. Las rutas con parámetros
 * (los casos de estudio) no las puede deducir solo, así que se le da la lista completa.
 */
export function includedRoutes(): string[] {
    return getRutasDePrerender();
}
