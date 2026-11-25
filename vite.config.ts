import { join } from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import Icons from "unplugin-icons/vite";
import Markdown from "unplugin-vue-markdown/vite";
import { defineConfig, loadEnv } from "vite";
import { imagetools } from "vite-imagetools";
import generateSitemap from "vite-ssg-sitemap";
import { contenidoPlugin } from "./plugins/contenidoPlugin.ts";
import { generarImagenesOg } from "./plugins/imagenesOg.ts";
import { vistaPreviaPlugin } from "./plugins/vistaPreviaPlugin.ts";

const RAIZ = fileURLToPath(new URL(".", import.meta.url));
const CARPETA_SALIDA = join(RAIZ, "dist");

export default defineConfig(({ mode, isPreview }) => {
    // Sin prefijo, para leer también HOSTS_PERMITIDOS, que no debe acabar en el bundle.
    const entorno = loadEnv(mode, RAIZ, "");
    // URL pública del sitio, sin barra final. Se lee del entorno (.env).
    const urlSitio = (entorno.VITE_URL_SITIO ?? "").replace(/\/$/, "");
    // Hosts extra para el servidor de desarrollo, separados por comas (por ejemplo, un túnel para
    // probar en el móvil). Van en .env.local, que no se sube al repo.
    const hostsPermitidos = (entorno.HOSTS_PERMITIDOS ?? "")
        .split(",")
        .map((host) => host.trim())
        .filter(Boolean);

    return {
        // En la vista previa no hay SPA de respaldo: cada dirección tiene su HTML, como en el hosting.
        appType: isPreview ? "mpa" : "spa",
        server: { allowedHosts: hostsPermitidos },
        plugins: [
            // Los .md de los casos de estudio se compilan como componentes de Vue.
            vue({ include: [/\.vue$/, /\.md$/] }),
            Markdown({
                // El frontmatter lo lee y lo valida contenidoPlugin; aquí solo interesa el cuerpo.
                headEnabled: false,
                exposeFrontmatter: false,
                exportFrontmatter: false,
                wrapperClasses: "prosa",
                markdownOptions: { html: false, linkify: true, typographer: true },
            }),
            contenidoPlugin(),
            vistaPreviaPlugin(RAIZ, CARPETA_SALIDA),
            // Variantes AVIF, WebP y JPG a varios anchos de cada imagen del contenido.
            imagetools(),
            tailwindcss(),
            // Los iconos (Solar, vía Iconify) se compilan a SVG en línea: sin peticiones ni JS en runtime.
            Icons({ compiler: "vue3", scale: 1 }),
        ],
        resolve: {
            alias: {
                "@": join(RAIZ, "src"),
            },
        },
        ssgOptions: {
            // Ficheros planos (en.html, proyectos/x.html): Firebase los sirve sin extensión con cleanUrls.
            dirStyle: "flat",
            script: "async",
            // Sin CSS crítico en línea: la CSP no permite estilos incrustados.
            beastiesOptions: false,

            /**
             * Con todas las páginas ya generadas se crean las imágenes Open Graph, el sitemap y robots.txt.
             */
            async onFinished() {
                await generarImagenesOg(RAIZ, CARPETA_SALIDA);

                generateSitemap({
                    hostname: urlSitio,
                    outDir: CARPETA_SALIDA,
                    exclude: ["/404"],
                    changefreq: "monthly",
                    readable: true,
                    robots: [{ userAgent: "*", allow: "/" }],
                });
            },
        },
    };
});
