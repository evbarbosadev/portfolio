import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { Plugin } from "vite";

interface CabeceraDeFirebase {
    key: string;
    value: string;
}

/**
 * Hace que "vite preview" se comporte como Firebase Hosting, para que los tests y Lighthouse
 * midan lo mismo que verá un visitante: pone las cabeceras de seguridad de firebase.json (una
 * sola copia, la del hosting) y responde con 404.html y estado 404 a las direcciones que no existen.
 */
export function vistaPreviaPlugin(raiz: string, carpetaSalida: string): Plugin {
    return {
        name: "portfolio:vista-previa",

        config() {
            const firebase = JSON.parse(readFileSync(join(raiz, "firebase.json"), "utf8"));
            // La primera regla de firebase.json es la que se aplica a todas las respuestas.
            const cabeceras: CabeceraDeFirebase[] = firebase.hosting.headers[0].headers;

            return {
                preview: {
                    headers: Object.fromEntries(
                        cabeceras.map((cabecera) => [cabecera.key, cabecera.value]),
                    ),
                },
            };
        },

        configurePreviewServer(servidor) {
            // Al devolver una función, este paso se coloca después de servir los ficheros estáticos.
            return () => {
                servidor.middlewares.use((peticion, respuesta, siguiente) => {
                    const ruta = decodeURIComponent((peticion.url ?? "/").split("?")[0] ?? "/");

                    // Vite ya ha convertido /en en /en.html: si el fichero existe, lo sirve él.
                    if (existsSync(join(carpetaSalida, ruta))) {
                        siguiente();
                        return;
                    }

                    respuesta.statusCode = 404;
                    respuesta.setHeader("Content-Type", "text/html");
                    respuesta.end(readFileSync(join(carpetaSalida, "404.html")));
                });
            };
        },
    };
}
