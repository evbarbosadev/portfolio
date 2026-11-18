import { PREFIJO_MARCADOR } from "@/constantes";

/**
 * Dice si un valor del contenido sigue siendo un marcador "[POR RELLENAR: ...]" y no un dato real.
 */
export function esMarcador(valor: string): boolean {
    return valor.startsWith(PREFIJO_MARCADOR);
}
