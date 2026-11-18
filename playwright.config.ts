import { defineConfig, devices } from "@playwright/test";

const PUERTO = 4173;
const URL_BASE = `http://localhost:${PUERTO}`;

/*
    Los tests corren contra el sitio ya compilado (pnpm build), servido con "vite preview" con las
    mismas cabeceras que Firebase Hosting. Se usa el Chrome instalado en el sistema, así que no hay
    que descargar navegadores aparte.
*/
export default defineConfig({
    testDir: "tests",
    fullyParallel: true,
    forbidOnly: Boolean(process.env.CI),
    retries: process.env.CI ? 1 : 0,
    reporter: process.env.CI ? "github" : "list",
    use: {
        baseURL: URL_BASE,
        // Navegador en español: en otro idioma, / redirige a /en (ver public/tema.js).
        locale: "es-ES",
    },
    projects: [
        { name: "escritorio", use: { ...devices["Desktop Chrome"], channel: "chrome" } },
        { name: "movil", use: { ...devices["Pixel 7"], channel: "chrome" } },
    ],
    webServer: {
        command: `pnpm preview --port ${PUERTO} --strictPort`,
        url: URL_BASE,
        reuseExistingServer: !process.env.CI,
    },
});
