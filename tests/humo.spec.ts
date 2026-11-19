import { expect, test } from "@playwright/test";
import {
    esperarHidratacion,
    esperarMovimiento,
    getRutasDelSitio,
    vigilarErrores,
} from "./utilidades";

/*
    Pruebas de humo: que cada ruta carga sin errores, que la estructura es la esperada y que el
    idioma, el tema, la navegación y los modos sin JavaScript y con movimiento reducido funcionan.
*/

const RUTAS = getRutasDelSitio();

const SECCIONES_DE_INICIO = ["proyectos", "laboratorio", "sobre-mi", "contacto"];
const SECCIONES_DE_LA_NAVEGACION = ["proyectos", "sobre-mi", "contacto"];

test.describe("rutas", () => {
    for (const ruta of RUTAS) {
        test(`${ruta} carga sin errores`, async ({ page }) => {
            const errores = vigilarErrores(page);
            const respuesta = await page.goto(ruta);

            expect(respuesta?.status()).toBe(200);
            await expect(page.locator("h1")).toBeVisible();
            await expect(page.locator("html")).toHaveAttribute(
                "lang",
                ruta.startsWith("/en") ? "en" : "es",
            );

            // Se recorre la página entera con el movimiento ya activo, para que salten todos los revelados.
            await esperarMovimiento(page);
            await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
            await page.waitForTimeout(500);

            expect(errores).toEqual([]);
        });
    }

    test("una dirección que no existe responde con la 404 bilingüe", async ({ page }) => {
        const respuesta = await page.goto("/no-existe");

        expect(respuesta?.status()).toBe(404);
        await expect(page.locator("h1")).toHaveText("Esta página no existe");
        await expect(page.getByText("This page does not exist")).toBeVisible();
        await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex");
    });

    test("no hay enlaces internos rotos", async ({ page, request }) => {
        const destinos = new Set<string>();

        for (const ruta of RUTAS) {
            await page.goto(ruta);

            const enlaces = await page
                .locator('a[href^="/"]')
                .evaluateAll((elementos) => elementos.map((a) => a.getAttribute("href") ?? ""));

            for (const enlace of enlaces) {
                destinos.add(enlace);
            }
        }

        for (const destino of destinos) {
            // Los CV no están en git: en la CI no existen, así que solo se comprueban en local, donde se despliega.
            if (process.env.CI && /^\/cv-\w+\.pdf$/.test(destino)) {
                continue;
            }

            const [ruta = "/", ancla] = destino.split("#");
            const respuesta = await request.get(ruta);

            expect(respuesta.status(), destino).toBe(200);

            // Si el enlace apunta a una sección, la sección tiene que existir en la página de destino.
            if (ancla) {
                await page.goto(ruta);
                await expect(page.locator(`[id="${ancla}"]`), destino).toHaveCount(1);
            }
        }
    });
});

test.describe("estructura de la página principal", () => {
    test("tiene las secciones en orden, con los proyectos y el laboratorio", async ({ page }) => {
        await page.goto("/");

        const secciones = await page
            .locator("main section[id]")
            .evaluateAll((elementos) => elementos.map((seccion) => seccion.id));

        expect(secciones).toEqual(SECCIONES_DE_INICIO);
        await expect(page.locator("#proyectos article h3")).toHaveText([
            "Nova",
            "Vørlys",
            "Este portfolio",
            "Mensajería para Android",
        ]);
        await expect(page.locator("#proyectos h2 + p")).toHaveText("4 proyectos");
        await expect(page.locator("#laboratorio article h3")).toHaveText([
            "Sous",
            "agy-mcp",
            "Nydo",
            "Generador de lámparas",
            "Herramientas propias",
            "Generador de scripts para incidencias",
        ]);
        await expect(page.locator("#sobre-mi dt")).toHaveText([
            "Ahora",
            "Antes",
            "Stack",
            "También",
        ]);
    });

    test("la navegación enlaza a las secciones en los dos idiomas", async ({ page }) => {
        for (const inicio of ["/", "/en"]) {
            await page.goto(inicio);

            for (const ancla of SECCIONES_DE_LA_NAVEGACION) {
                await expect(
                    page.locator(`header nav a[href="${inicio}#${ancla}"]`).first(),
                ).toBeAttached();
            }
        }
    });

    test("el menú del móvil abre, lleva a la sección y se cierra", async ({ page, isMobile }) => {
        test.skip(!isMobile, "El menú desplegable solo existe en pantallas pequeñas");

        await page.goto("/");
        await esperarHidratacion(page);
        await page.getByRole("button", { name: "Menú" }).click();

        const menu = page.locator("#menu-movil");
        await expect(menu).toBeVisible();

        await menu.getByRole("link", { name: "Sobre mí" }).click();
        await expect(menu).toBeHidden();
        await expect(page.locator("#sobre-mi h2")).toBeFocused();
        await expect(page).toHaveURL(/\/$/);
    });

    test("un enlace a una sección baja a ella sin dejar el ancla en la URL", async ({
        page,
        isMobile,
    }) => {
        test.skip(isMobile, "En el móvil los enlaces van en el menú, probado aparte");

        await page.goto("/");
        await esperarHidratacion(page);
        await page.locator("header nav").getByRole("link", { name: "Contacto" }).click();

        await expect(page.locator("#contacto h2")).toBeFocused();
        await expect(page.locator("#contacto h2")).toBeInViewport();
        await expect(page).toHaveURL(/\/$/);
    });

    test("al entrar con un ancla se baja a la sección y se limpia la URL", async ({ page }) => {
        await page.goto("/#sobre-mi");
        await esperarHidratacion(page);

        await expect(page).toHaveURL(/\/$/);
        await expect(page.locator("#sobre-mi h2")).toBeInViewport();
    });

    test("desde un caso de estudio, la navegación lleva a la sección sin ancla", async ({
        page,
        isMobile,
    }) => {
        test.skip(isMobile, "En el móvil los enlaces van en el menú, probado aparte");

        await page.goto("/proyectos/vorlys");
        await esperarHidratacion(page);
        await page.locator("header nav").getByRole("link", { name: "Sobre mí" }).click();

        await expect(page).toHaveURL(/\/$/);
        await expect(page.locator("#sobre-mi h2")).toBeInViewport();
    });

    test("el primer elemento con foco es el enlace para saltar al contenido", async ({
        page,
        isMobile,
    }) => {
        test.skip(isMobile, "La navegación con tabulador se prueba en escritorio");

        await page.goto("/");
        await page.keyboard.press("Tab");

        await expect(page.locator(":focus")).toHaveText("Saltar al contenido");
    });
});

test.describe("pantallas estrechas", () => {
    test.use({ viewport: { width: 320, height: 640 } });

    for (const ruta of ["/", "/proyectos/nova", "/no-existe"]) {
        test(`${ruta} cabe en 320 px sin desbordarse`, async ({ page }) => {
            // Sin movimiento, para medir la maquetación y no una animación a medias.
            await page.emulateMedia({ reducedMotion: "reduce" });
            await page.goto(ruta);

            // Se buscan elementos visibles cuyo borde derecho se salga de la ventana.
            const desbordados = await page.evaluate(() => {
                const anchoDeVentana = document.documentElement.clientWidth;

                return [...document.querySelectorAll("header *, main *, footer *")]
                    .filter((elemento) => {
                        const caja = elemento.getBoundingClientRect();
                        const esDecorativo = elemento.closest('[aria-hidden="true"], .sr-only');

                        return caja.width > 0 && caja.right > anchoDeVentana + 1 && !esDecorativo;
                    })
                    .map(
                        (elemento) =>
                            `${elemento.tagName} ${elemento.textContent?.trim().slice(0, 30)}`,
                    );
            });

            expect(desbordados).toEqual([]);
        });
    }
});

test.describe("idioma", () => {
    test("el selector lleva a la página principal equivalente", async ({ page }) => {
        await page.goto("/");
        await page.locator('header a[hreflang="en"]').click();

        await expect(page).toHaveURL(/\/en$/);
        await expect(page.locator("html")).toHaveAttribute("lang", "en");
        await expect(page.locator("#proyectos h2")).toHaveText("Projects");

        await page.locator('header a[hreflang="es"]').click();
        await expect(page).toHaveURL(/\/$/);
        await expect(page.locator("html")).toHaveAttribute("lang", "es");
    });

    test("el selector mantiene el caso de estudio equivalente", async ({ page }) => {
        await page.goto("/proyectos/nova");
        await page.locator('header a[hreflang="en"]').click();

        await expect(page).toHaveURL(/\/en\/projects\/nova$/);
        await expect(page.locator("h1")).toHaveText("Nova");
    });

    test("cada página declara canonical y hreflang", async ({ page }) => {
        await page.goto("/en/projects/this-portfolio");

        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
            "href",
            /\/en\/projects\/this-portfolio$/,
        );
        await expect(page.locator('link[hreflang="es"]')).toHaveAttribute(
            "href",
            /\/proyectos\/este-portfolio$/,
        );
        await expect(page.locator('link[hreflang="x-default"]')).toHaveCount(1);
    });
});

test.describe("idioma automático", () => {
    test.use({ locale: "en-US" });

    test("con el navegador en inglés, / pasa a /en sin dejar / en el historial", async ({
        page,
    }) => {
        await page.goto("/?ref=prueba");

        await expect(page).toHaveURL(/\/en\?ref=prueba$/);
        await expect(page.locator("html")).toHaveAttribute("lang", "en");

        // Si / hubiera quedado en el historial, «atrás» volvería a él en vez de a la pestaña vacía.
        await page.goBack();
        expect(page.url()).toBe("about:blank");
    });

    test.describe("con un buscador", () => {
        test.use({
            userAgent:
                "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html) Chrome/120.0.0.0 Safari/537.36",
        });

        test("se queda en / aunque el navegador esté en inglés", async ({ page }) => {
            await page.goto("/");

            await expect(page).toHaveURL(/:\d+\/$/);
            await expect(page.locator("html")).toHaveAttribute("lang", "es");
        });
    });

    test("no redirige en /en, en los proyectos ni con un ancla", async ({ page }) => {
        for (const ruta of ["/en", "/proyectos/este-portfolio", "/#contacto"]) {
            await page.goto(ruta);
            await expect(page.locator("html")).toHaveAttribute(
                "lang",
                ruta === "/en" ? "en" : "es",
            );
        }
    });

    test("el idioma elegido con el botón se respeta en la siguiente visita", async ({ page }) => {
        await page.goto("/");
        await esperarHidratacion(page);
        await page.locator('header a[hreflang="es"]').click();
        await expect(page).toHaveURL(/:\d+\/$/);

        await page.goto("/");
        await expect(page).toHaveURL(/:\d+\/$/);
        await expect(page.locator("html")).toHaveAttribute("lang", "es");
    });

    test("la portada declara es, en y x-default hacia /", async ({ page }) => {
        await page.goto("/en");

        await expect(page.locator('link[hreflang="es"]')).toHaveAttribute("href", /[^/]\/$/);
        await expect(page.locator('link[hreflang="en"]')).toHaveAttribute("href", /\/en$/);
        await expect(page.locator('link[hreflang="x-default"]')).toHaveAttribute("href", /[^/]\/$/);
    });
});

test.describe("tema", () => {
    test.use({ colorScheme: "dark" });

    test("sigue al sistema, y el interruptor cambia el tema y se recuerda", async ({ page }) => {
        const html = page.locator("html");

        await page.goto("/");
        await expect(html).toHaveAttribute("data-tema", "oscuro");

        // El script del tema es bloqueante y va en <head>: fija el tema antes del primer pintado.
        const scriptDeTema = page.locator('head script[src="/tema.js"]');
        await expect(scriptDeTema).toHaveCount(1);
        await expect(scriptDeTema).not.toHaveAttribute("async");
        await expect(scriptDeTema).not.toHaveAttribute("defer");

        await esperarHidratacion(page);
        await page.getByRole("button", { name: "Tema oscuro" }).click();
        await expect(html).toHaveAttribute("data-tema", "claro");

        await page.reload();
        await expect(html).toHaveAttribute("data-tema", "claro");
    });
});

test.describe("movimiento reducido", () => {
    test("no carga las animaciones", async ({ page }) => {
        const peticiones: string[] = [];
        page.on("request", (peticion) => peticiones.push(peticion.url()));

        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.goto("/");
        await esperarHidratacion(page);
        // Margen de sobra para que, si fuera a cargarse, el chunk de movimiento ya se hubiera pedido.
        await page.waitForTimeout(3000);

        expect(peticiones.filter((url) => url.includes("coreografia"))).toEqual([]);
        await expect(page.locator("html")).not.toHaveAttribute("data-movimiento");
        await expect(page.locator("#contacto h2")).toBeVisible();
    });
});

test.describe("sin JavaScript", () => {
    test.use({ javaScriptEnabled: false });

    test("la web se lee y se navega entera", async ({ page }) => {
        await page.goto("/");

        await expect(page.locator("h1")).toBeVisible();
        await expect(page.locator("#contacto h2")).toBeVisible();
        // El interruptor de tema necesita JavaScript, así que no se muestra.
        await expect(page.getByRole("button", { name: "Tema oscuro" })).toBeHidden();

        await page.locator("#proyectos article a").first().click();
        await expect(page).toHaveURL(/\/proyectos\/nova$/);
        await expect(page.locator("h1")).toHaveText("Nova");
        await expect(page.locator(".prosa p").first()).toBeVisible();

        await page.locator('header a[hreflang="en"]').click();
        await expect(page).toHaveURL(/\/en\/projects\/nova$/);
    });
});
