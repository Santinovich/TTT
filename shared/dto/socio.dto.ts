import { Genero } from "../enum/genero.enum";
import { DocumentoDto } from "./documento.dto";
import { EtiquetaDto } from "./etiqueta.dto";

export interface SocioDto {
    id: number;
    nombre: string;
    apellido?: string;
    fechaNacimiento?: string | Date;
    numeroDni?: number;
    genero: Genero;
    ubicacion?: {
        domicilio: string;
        barrioId?: number;
    };
    contacto?: {
        telefono?: string;
        correo?: string;
    };
    etiquetas?: EtiquetaDto[];
    documentos?: DocumentoDto[]
}

export interface GetSocioDto extends SocioDto {
    socio: SocioDto;
}

export interface GetSociosDto {
    socios: SocioDto[];
}

export interface CreateSocioDto {
    nombre: string;
    apellido?: string;
    fechaNacimiento?: string;
    numeroDni?: number;
    genero?: Genero;
    ubicacion?: {
        domicilio: string;
        barrioId?: number;
    };
    etiquetasIds?: number[];
    contacto?: {
        telefono?: string | null;
        correo?: string | null;
    };
}

export interface CreateSocioResponseDto {
    message: string;
    socio: SocioDto;
}

export type UpdateSocioDto = {
    [K in keyof CreateSocioDto]?: CreateSocioDto[K] | null;
};