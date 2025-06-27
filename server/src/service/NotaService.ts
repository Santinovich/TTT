import { AppDataSource } from "../db/data-source";
import { Nota } from "../db/entity/Nota";
import { Socio } from "../db/entity/Socio";
import { TTTError } from "../utils/ttt-error";
import { DeepPartial } from "typeorm";

export default class NotaService {
    constructor(
        private notaRepository = AppDataSource.getRepository(Nota),
        private socioRepository = AppDataSource.getRepository(Socio)
    ) {}

    async getNotasBySocioId(idSocio: number) {
        return this.notaRepository.find({
            where: { socio: { id: idSocio } },
        });
    }

    async getNota(idNota: number) {
        return this.notaRepository.findOne({
            where: { id: idNota },
        });
    }

    async createNota(idSocio: number, newNota: DeepPartial<Nota>) {
        const socio = await this.socioRepository.findOne({
            where: { id: idSocio },
        });
        if (!socio) {
            throw new TTTError("Socio no encontrado");
        }
        newNota.socio = socio;
        const nota = this.notaRepository.create(newNota);
        return this.notaRepository.save(nota);
    }

    async updateNota(idNota: number, notaData: Pick<Nota, "texto">) {
        const nota = await this.getNota(idNota);
        if (!nota) {
            throw new TTTError("Nota no encontrada", 404);
        }
        if (notaData.texto) {
            nota.texto = notaData.texto;
        }
        return this.notaRepository.save(nota);
    }

    async deleteNota(idNota: number) {
        await this.notaRepository.delete(idNota);
    }
}
