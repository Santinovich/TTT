import { AppDataSource } from "../db/data-source";
import { Barrio } from "../db/entity/Barrio";
import { Ubicacion } from "../db/entity/Ubicacion";

export default class UbicacionService {
    constructor(
        private ubicacionRepository = AppDataSource.getRepository(Ubicacion),
        private barrioRepository = AppDataSource.getRepository(Barrio)
    ) {}

    getBarrio(id: number) {
        return this.barrioRepository.findOneBy({ id });
    }

    getBarrios() {
        return this.barrioRepository.find();
    }

    getUbicacion(idSocio: number) {
        return this.ubicacionRepository.findOne({
            where: { socio: { id: idSocio } },
        });
    }
}
