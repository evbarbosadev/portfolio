import { readFileSync } from "node:fs";
import type { Page } from "@playwright/test";

/**
 * Devuelve las rutas del sitio, leídas del sitemap que genera el build. Así los tests cubren
 * todas las páginas sin tener que mantener una lista a mano.
 */
export function getRutasDelSitio(): string[] {
    const sitemap = readFileSync("dist/sitemap.xml", "utf8");

    return [...sitemap.matchAll(/<loc>\s*(\S+)\s*<\/loc>/g)].map(
        (coincidencia) => new URL(coincidencia[1] as string).pathname,
    );
}

/**
 * Empieza a apuntar los errores de la página: excepciones de JavaScript y errores de consola,
 * que incluyen los bloqueos de la política de seguridad de contenido (CSP).
 */
const ORIGEN_ANALITICA = "https://cloud.umami.is";

export function vigilarErrores(page: Page): string[] {
    const errores: string[] = [];

    page.on("pageerror", (error) => errores.push(error.message));
    page.on("console", (mensaje) => {
        // La analítica es de un tercero: si su servidor no responde, no es un fallo de la web.
        if (mensaje.location().url.startsWith(ORIGEN_ANALITICA)) {
            return;
        }
        if (mensaje.type() === "error") {
            errores.push(mensaje.text());
        }
    });

    return errores;
}

/**
 * Espera a que Vue haya hidratado la página. Hasta entonces los botones existen pero no responden.
 */
export async function esperarHidratacion(page: Page) {
    await page.waitForFunction(() => "__vue_app__" in (document.querySelector("#app") ?? {}));
}

/**
 * Espera a que el chunk de movimiento (GSAP) haya cargado y arrancado.
 */
export async function esperarMovimiento(page: Page) {
    await page.waitForFunction(() => "movimiento" in document.documentElement.dataset);
}
