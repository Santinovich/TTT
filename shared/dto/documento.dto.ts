import { DocumentoTipo } from "../enum/documento-tipo.enum";

export interface DocumentoDto {
    id: number;
    tipo: DocumentoTipo;
    nombreArchivo: string;
}

export interface CreateDocumentoDto {
    nombre: string;
    tipo: DocumentoTipo;
    documento: Express.Multer.File;
}

export interface GetDocumentoDto {
    documento: DocumentoDto;
}

export interface GetDocumentosDto {
    documentos: DocumentoDto[];
}
