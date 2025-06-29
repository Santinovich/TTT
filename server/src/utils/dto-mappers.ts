import { GetSocioDto, SocioDto } from "@shared/dto/socio.dto";
import { Socio } from "../db/entity/Socio";
import { Etiqueta } from "../db/entity/Etiqueta";
import { EtiquetaDto } from "@shared/dto/etiqueta.dto";
import { Nota } from "../db/entity/Nota";
import { NotaDto } from "@shared/dto/nota.dto";

export function mapSocioToDto(socio: Socio): SocioDto {
    return {
        id: socio.id,
        nombre: socio.nombre,
        apellido: socio.apellido || undefined,
        fechaNacimiento: socio.fechaNacimiento
            ? socio.fechaNacimiento.toISOString().split("T")[0]
            : undefined,
        numeroDni: socio.numeroDni || undefined,
        genero: socio.genero,
        ubicacion: socio.ubicacion
            ? {
                  domicilio: socio.ubicacion?.domicilio || "",
                  barrioId: socio.ubicacion?.barrio?.id || undefined,
              }
            : undefined,
        contacto: socio.contacto
            ? {
                  telefono: socio.contacto?.telefono || undefined,
                  correo: socio.contacto?.correo || undefined,
              }
            : undefined,
        etiquetas: socio.etiquetas
            ? socio.etiquetas.map((etiqueta) => ({
                  id: etiqueta.id,
                  nombre: etiqueta.nombre,
                  descripcion: etiqueta.descripcion || undefined,
                  color: etiqueta.color || undefined,
              }))
            : undefined,
        documentos: socio.documentos
            ? socio.documentos.map((doc) => ({
                  id: doc.id,
                  tipo: doc.tipo,
                  nombreArchivo: doc.nombreArchivo,
              }))
            : [],
    };
}

export function mapEtiquetaToDto(etiqueta: Etiqueta): EtiquetaDto {
    return {
        id: etiqueta.id,
        nombre: etiqueta.nombre,
        descripcion: etiqueta.descripcion || undefined,
        color: etiqueta.color || undefined,
    };
}

export function mapEtiquetasToDtos(etiquetas: Etiqueta[]): EtiquetaDto[] {
    return etiquetas.map((etiqueta) => mapEtiquetaToDto(etiqueta));
}

export function mapNotaToDto(nota: Nota): NotaDto {
    return {
        id: nota.id,
        texto: nota.texto,
        fechaCreacion: nota.fechaCreacion.toISOString(),
    };
}

export function mapNotasToDtos(notas: Nota[]): NotaDto[] {
    return notas.map((nota) => mapNotaToDto(nota));
}