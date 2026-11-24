import { CustomEase } from "gsap/CustomEase";

/** Duraciones (en segundos) y nombres de las curvas, tal y como las entiende GSAP. */
export interface TokensDeMovimiento {
    breve: number;
    media: number;
    scroll: number;
    larga: number;
    salida: string;
    cine: string;
}

/**
 * Lee las duraciones y las curvas de los tokens CSS (tokens.css) y registra las curvas en GSAP.
 * Así el movimiento hecho con JavaScript usa exactamente los mismos valores que el hecho con CSS.
 */
export function leerTokensDeMovimiento(): TokensDeMovimiento {
    const estilos = getComputedStyle(document.documentElement);

    /**
     * Convierte una duración CSS a segundos. El CSS compilado puede traerla como "600ms" o como ".6s".
     */
    function leerDuracion(nombre: string): number {
        const valor = estilos.getPropertyValue(`--duracion-${nombre}`).trim();

        return valor.endsWith("ms") ? parseFloat(valor) / 1000 : parseFloat(valor);
    }

    /**
     * Registra en GSAP una curva cubic-bezier del CSS y devuelve el nombre con el que usarla.
     */
    function crearCurva(nombre: string): string {
        const puntos = estilos.getPropertyValue(`--ease-${nombre}`).match(/-?[\d.]+/g) ?? [];
        CustomEase.create(nombre, puntos.join(","));

        return nombre;
    }

    return {
        breve: leerDuracion("breve"),
        media: leerDuracion("media"),
        scroll: leerDuracion("scroll"),
        larga: leerDuracion("larga"),
        salida: crearCurva("salida"),
        cine: crearCurva("cine"),
    };
}
