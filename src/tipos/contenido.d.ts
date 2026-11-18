/*
    Tipos del módulo virtual que genera plugins/contenidoPlugin.ts con el contenido ya validado.
*/
declare module "virtual:contenido" {
    import type { Idioma } from "@/constantes";
    import type { Experiencia, Experimento, Proyecto } from "@/contenido/esquemas";

    /** Imagen procesada por vite-imagetools: un srcset por formato y la imagen de respaldo con su tamaño. */
    export interface ImagenProcesada {
        sources: Record<string, string>;
        img: { src: string; w: number; h: number };
    }

    export interface ImagenConAlt {
        imagen: ImagenProcesada;
        alt: string;
    }

    /** Proyecto listo para pintar. El id es el nombre de su carpeta y une sus versiones en cada idioma. */
    export type ProyectoCargado = Omit<Proyecto, "portada" | "medios"> & {
        id: string;
        /** Sin portada todavía: se pinta su hueco. */
        portada?: ImagenConAlt;
        medios: ImagenConAlt[];
    };

    export type ExperimentoCargado = Experimento & { id: string };

    export type ExperienciaCargada = Experiencia & { id: string };

    export interface FotoCargada {
        /** Sin imagen todavía: se pinta su hueco. */
        imagen?: ImagenProcesada;
        alt: Record<Idioma, string>;
    }

    export const proyectos: ProyectoCargado[];
    export const experimentos: ExperimentoCargado[];
    export const experiencias: ExperienciaCargada[];
    export const fotos: FotoCargada[];
}
