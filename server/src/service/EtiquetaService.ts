import { DeepPartial, In } from "typeorm";
import { AppDataSource } from "../db/data-source";
import { Etiqueta } from "../db/entity/Etiqueta";
import { TTTError } from "../utils/ttt-error";
import { Socio } from "../db/entity/Socio";

export default class EtiquetaService {
    constructor(
        private etiquetaRepository = AppDataSource.getRepository(Etiqueta),
        private socioRepository = AppDataSource.getRepository(Socio)
    ) {}

    async getEtiquetas() {
        return await this.etiquetaRepository.find();
    }

    async getEtiquetaById(id: number) {
        return await this.etiquetaRepository.findOneBy({ id });
    }

    async createEtiqueta(newEtiqueta: DeepPartial<Etiqueta>) {
        const etiqueta = this.etiquetaRepository.create(newEtiqueta);
        return await this.etiquetaRepository.save(etiqueta);
    }

    async updateEtiqueta(id: number, newEtiquetaData: DeepPartial<Etiqueta>) {
        const etiqueta = await this.getEtiquetaById(id);
        if (!etiqueta) {
            throw new TTTError("Etiqueta no encontrada", 404);
        }
        Object.assign(etiqueta, newEtiquetaData);
        return await this.etiquetaRepository.save(etiqueta);
    }

    async deleteEtiqueta(id: number) {
        const etiqueta = await this.getEtiquetaById(id);
        if (!etiqueta) {
            throw new TTTError("Etiqueta no encontrada", 404);
        }
        return await this.etiquetaRepository.remove(etiqueta);
    }

    async addEtiquetasToSocio(socioId: number, etiquetaIds: number[]) {
        const etiquetas = await this.etiquetaRepository.findBy({ id: In(etiquetaIds) });
        if (etiquetas.length !== etiquetaIds.length) {
            throw new TTTError("Una o más etiquetas no existen", 404);
        }
        const socio = await this.socioRepository.findOne({
            where: { id: socioId },
        });
        if (!socio) {
            throw new TTTError("Socio no encontrado", 404);
        }
        socio.etiquetas.push(...etiquetas.filter(e => !socio.etiquetas.some(se => se.id === e.id)));
        return await this.socioRepository.save(socio);
    }

    async removeEtiquetasFromSocio(socioId: number, etiquetaIds: number[]) {
        const etiquetas = await this.etiquetaRepository.findBy({ id: In(etiquetaIds) });
        if (etiquetas.length !== etiquetaIds.length) {
            throw new TTTError("Una o más etiquetas no existen", 404);
        }
        const socio = await this.socioRepository.findOne({
            where: { id: socioId },
        });
        if (!socio) {
            throw new TTTError("Socio no encontrado", 404);
        }
        socio.etiquetas = socio.etiquetas.filter(e => !etiquetaIds.includes(e.id));
        return await this.socioRepository.save(socio);
    }
}
