export const defaultEtiquetaColor = "#15367b";

export interface EtiquetaDto {
    id: number;
    nombre: string;
    descripcion?: string;
    color?: string;
}

export interface GetEtiquetaDto {
    etiqueta: EtiquetaDto;
}

export interface GetEtiquetasDto {
    etiquetas: EtiquetaDto[];
}

export interface CreateEtiquetaDto {
    nombre: string;
    descripcion?: string;
    color?: string;
}

export interface AssignEtiquetasDto {
    etiquetasIds: number[];
}

export interface DeleteEtiquetasDto extends AssignEtiquetasDto {}