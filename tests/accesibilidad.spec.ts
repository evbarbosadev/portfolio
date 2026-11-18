import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/*
    Comprobaciones de accesibilidad con axe en las páginas clave, en los dos temas. Se pide
    movimiento reducido para analizar el estado final de la página y no una animación a medias.
*/

const PAGINAS_CLAVE = ["/", "/en", "/proyectos/nova", "/no-existe"];
const NORMAS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

for (const tema of ["light", "dark"] as const) {
    test.describe(`accesibilidad con el tema del sistema en ${tema}`, () => {
        for (const ruta of PAGINAS_CLAVE) {
            test(`${ruta} cumple WCAG 2.2 AA según axe`, async ({ page }) => {
                await page.emulateMedia({ colorScheme: tema, reducedMotion: "reduce" });
                await page.goto(ruta);
                // Las entradas son fundidos breves: se espera a que terminen para medir el contraste final.
                await page.evaluate(() =>
                    Promise.all(document.getAnimations().map((animacion) => animacion.finished)),
                );

                const resultados = await new AxeBuilder({ page }).withTags(NORMAS).analyze();

                expect(resultados.violations).toEqual([]);
            });
        }
    });
}
