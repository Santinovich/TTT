export interface NotaDto {
    id: number;
    texto: string;
    fechaCreacion: string;
}

export interface GetNotaDto {
    nota: NotaDto;
}

export interface GetNotasDto {
    notas: NotaDto[];
}

export interface CreateNotaDto {
    texto: string;
}