import js from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import tseslint from "typescript-eslint";

export default tseslint.config(
    {
        ignores: [
            "dist",
            "node_modules",
            "playwright-report",
            "test-results",
            ".lighthouseci",
            "vorlys-sans",
        ],
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    ...pluginVue.configs["flat/essential"],
    {
        // Los bloques <script lang="ts"> de los .vue se analizan con el parser de TypeScript.
        files: ["**/*.vue"],
        languageOptions: {
            parserOptions: {
                parser: tseslint.parser,
            },
        },
    },
    {
        rules: {
            // Llaves siempre, aunque el bloque tenga una sola sentencia.
            curly: ["error", "all"],
            "no-console": "error",
            // TypeScript ya comprueba los identificadores sin definir.
            "no-undef": "off",
        },
    },
);
