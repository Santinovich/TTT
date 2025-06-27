import { EtiquetaDto } from "./etiqueta.dto";

export interface SocioDto {
    id: number;
    nombre: string;
    apellido?: string;
    fechaNacimiento?: string;
    numeroDni?: number;
    ubicacion?: {
        domicilio: string;
        barrioId?: number;
    };
    etiquetas?: EtiquetaDto[];
    contacto?: {
        telefono?: string;
        correo?: string;
    };
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
    ubicacion?: {
        domicilio: string;
        barrioId?: number;
    };
    etiquetasIds?: number[];
    contacto?: {
        telefono?: string;
        correo?: string;
    };
}

export interface UpdateSocioDto extends Partial<CreateSocioDto> {}