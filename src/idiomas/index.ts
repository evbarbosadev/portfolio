import { IDIOMA_POR_DEFECTO, type Idioma } from "@/constantes";
import en from "./en";
import es from "./es";

type Diccionario = typeof es;

/** Mismo árbol de claves que el español, pero con todas opcionales: una traducción que falta no rompe el build. */
export type DiccionarioParcial = {
    [Seccion in keyof Diccionario]?: Partial<Diccionario[Seccion]>;
};

/** Claves válidas, en la forma "seccion.clave". Un error al escribirlas lo detecta el typecheck. */
export type ClaveDeTexto = {
    [Seccion in keyof Diccionario]: `${Seccion}.${keyof Diccionario[Seccion] & string}`;
}[keyof Diccionario];

const diccionarios: Record<Idioma, Record<string, Record<string, string> | undefined>> = { es, en };

/**
 * Busca un texto de la interfaz por su clave en un idioma. Si falta la traducción, en desarrollo
 * devuelve un aviso que se ve en pantalla y en producción usa el texto en español.
 */
export function traducir(idioma: Idioma, clave: ClaveDeTexto): string {
    const [seccion = "", nombre = ""] = clave.split(".");
    const texto = diccionarios[idioma][seccion]?.[nombre];

    if (texto !== undefined) {
        return texto;
    }

    if (import.meta.env.DEV) {
        return `[FALTA ${idioma}: ${clave}]`;
    }

    return diccionarios[IDIOMA_POR_DEFECTO][seccion]?.[nombre] ?? clave;
}
