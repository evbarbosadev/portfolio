import { experiencias, experimentos, proyectos, type ProyectoCargado } from "virtual:contenido";
import type { Idioma } from "@/constantes";

/*
    Consultas sobre el contenido ya validado. El plugin entrega las colecciones ordenadas y sin
    borradores en producción; aquí solo se filtra por idioma.
*/

/**
 * Devuelve los proyectos de un idioma, en el orden que marca su campo "orden".
 */
export function getProyectos(idioma: Idioma): ProyectoCargado[] {
    return proyectos.filter((proyecto) => proyecto.idioma === idioma);
}

/**
 * Devuelve los proyectos que salen en la página principal.
 */
export function getProyectosDestacados(idioma: Idioma): ProyectoCargado[] {
    return getProyectos(idioma).filter((proyecto) => proyecto.destacado);
}

/**
 * Busca un proyecto por su slug dentro de un idioma.
 */
export function buscarProyecto(idioma: Idioma, slug: string): ProyectoCargado | undefined {
    return proyectos.find((proyecto) => proyecto.idioma === idioma && proyecto.slug === slug);
}

/**
 * Busca la versión de un proyecto en otro idioma. Las dos versiones comparten id (su carpeta).
 */
export function buscarTraduccion(
    proyecto: ProyectoCargado,
    idioma: Idioma,
): ProyectoCargado | undefined {
    return proyectos.find((otro) => otro.id === proyecto.id && otro.idioma === idioma);
}

/**
 * Devuelve las fichas del laboratorio en un idioma.
 */
export function getExperimentos(idioma: Idioma) {
    return experimentos.filter((experimento) => experimento.idioma === idioma);
}

/**
 * Devuelve la experiencia laboral en un idioma.
 */
export function getExperiencias(idioma: Idioma) {
    return experiencias.filter((experiencia) => experiencia.idioma === idioma);
}
