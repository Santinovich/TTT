import { AppDataSource } from "../db/data-source";
import { Documento } from "../db/entity/Documento";
import { Socio } from "../db/entity/Socio";
import TTTError from "../utils/ttt-error";

export default class DocumentoService {
    constructor(
        private documentoRepository = AppDataSource.getRepository(Documento),
        private socioRepository = AppDataSource.getRepository(Socio)
    ) {}

    async getDocumentosBySocioId(idSocio: number) {
        return await this.documentoRepository.find({ where: { socio: { id: idSocio } } });
    }

    async getDocumentoById(idDocumento: number) {
        const documento = await this.documentoRepository.findOne({
            where: { id: idDocumento },
        });
        if (!documento) {
            throw new TTTError("Documento no encontrado");
        }
        return documento;
    }

    async createDocumento(idSocio: number, newDocumento: Partial<Documento>) {
        const socio = await this.socioRepository.findOne({
            where: { id: idSocio },
        });
        if (!socio) {
            throw new TTTError("Socio no encontrado");
        }
        const documento = this.documentoRepository.create(newDocumento);
        documento.socio = socio;
        return await this.documentoRepository.save(documento);
    }

    async deleteDocumento(idDocumento: number) {
        const documento = await this.getDocumentoById(idDocumento);
        if (!documento) {
            throw new TTTError("Documento no encontrado", 404);
        }
        return await this.documentoRepository.remove(documento);
    }
}
