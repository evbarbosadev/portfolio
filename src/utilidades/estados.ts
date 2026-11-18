import type { EstadoDeExperimento, EstadoDeProyecto } from "@/constantes";
import type { ClaveDeTexto } from "@/idiomas";

/**
 * El estado de un proyecto o de un experimento se guarda en el contenido con su valor en español.
 * Estas tablas dan la clave del diccionario con la que se muestra en el idioma de la página.
 */
export const CLAVE_DE_ESTADO: Record<EstadoDeProyecto, ClaveDeTexto> = {
    activo: "estados.activo",
    terminado: "estados.terminado",
    "en pausa": "estados.enPausa",
};

export const CLAVE_DE_ESTADO_DE_EXPERIMENTO: Record<EstadoDeExperimento, ClaveDeTexto> = {
    "en curso": "estados.enCurso",
    pausado: "estados.pausado",
    "uso propio": "estados.usoPropio",
    archivado: "estados.archivado",
};
