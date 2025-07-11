import { DeepPartial, In } from "typeorm";
import { AppDataSource } from "../db/data-source";
import { Socio } from "../db/entity/Socio";
import { Ubicacion } from "../db/entity/Ubicacion";
import { Barrio } from "../db/entity/Barrio";
import { Contacto } from "../db/entity/Contacto";
import { CreateSocioDto } from "@shared/dto/socio.dto";
import TTTError from "../utils/ttt-error";

export default class SociosService {
    constructor(
        private sociosRepository = AppDataSource.getRepository(Socio),
        private ubicacionRepository = AppDataSource.getRepository(Ubicacion),
        private barrioRepository = AppDataSource.getRepository(Barrio),
        private contactoRepository = AppDataSource.getRepository(Contacto),
    ) {}

    async getSocioById(id: number) {
        return await this.sociosRepository.findOne({
            where: { id },
        });
    }

    async getSocios() {
        return await this.sociosRepository.find();
    }

    async createSocio(socioDto: CreateSocioDto) {
        const newSocio = this.sociosRepository.create({
            nombre: socioDto.nombre,
            apellido: socioDto.apellido,
            numeroDni: socioDto.numeroDni,
            genero: socioDto.genero,
        });
        if (socioDto.fechaNacimiento) {
            const [year, month, day] = socioDto.fechaNacimiento.split("T")[0]?.split("-").map(Number) || [];
            const dateUTC = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
            newSocio.fechaNacimiento = dateUTC;
        }
        if (socioDto.ubicacion) {
          const barrio = await this.barrioRepository.findOne({
                where: { id: socioDto.ubicacion.barrioId }
            });
            const newUbicacion = this.ubicacionRepository.create({
                domicilio: socioDto.ubicacion.domicilio,
                barrio: barrio || undefined,
            });
            newSocio.ubicacion = newUbicacion;
        }
        if (socioDto.contacto) {
            const newContacto = this.contactoRepository.create({
                telefono: socioDto.contacto.telefono || undefined,
                correo: socioDto.contacto.correo || undefined,
            });
            newSocio.contacto = newContacto;
        }
        return await this.sociosRepository.save(newSocio);
    }

    async updateSocio(
        idSocio: number,
        newSocioData: DeepPartial<CreateSocioDto> = {},
    ) {
        const socio = await this.getSocioById(idSocio);
        if (!socio) {
            throw new TTTError("Socio no encontrado");
        }
        if (newSocioData.nombre !== undefined) {
            socio.nombre = newSocioData.nombre;
        }
        if (newSocioData.apellido !== undefined) {
            socio.apellido = newSocioData.apellido;
        }
        if (newSocioData.fechaNacimiento !== undefined) {
            const [year, month, day] = newSocioData.fechaNacimiento.split("T")[0]?.split("-").map(Number) || [];
            const dateUTC = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
            socio.fechaNacimiento = dateUTC;
        }
        if (newSocioData.numeroDni !== undefined) {
            socio.numeroDni = newSocioData.numeroDni;
        }
        if (newSocioData.genero !== undefined) {
            socio.genero = newSocioData.genero;
        }

        if (newSocioData.ubicacion) {
            const barrio = await this.barrioRepository.findOne({
                where: { id: newSocioData.ubicacion.barrioId },
            });
            if (!socio.ubicacion) {
                socio.ubicacion = this.ubicacionRepository.create();
            }
            if (newSocioData.ubicacion.domicilio !== undefined) {
                socio.ubicacion.domicilio = newSocioData.ubicacion.domicilio;
            }
            if (barrio) {
                socio.ubicacion.barrio = barrio;
            }
        } else if (newSocioData.ubicacion === null && socio.ubicacion) {
            this.ubicacionRepository.remove(socio.ubicacion);
            socio.ubicacion = null;
        }
        
        if (newSocioData.contacto) {
            if (!socio.contacto) {
                socio.contacto = new Contacto();
            }
            if (newSocioData.contacto.telefono !== undefined) {
                socio.contacto.telefono = newSocioData.contacto.telefono;
            }
            if (newSocioData.contacto.correo !== undefined) {
                socio.contacto.correo = newSocioData.contacto.correo;
            }
        } else if (newSocioData.contacto === null && socio.contacto) {
            this.contactoRepository.remove(socio.contacto);
            socio.contacto = null;
        }
        
        const updatedSocio = await this.sociosRepository.save(socio);
        if (!updatedSocio) {
            throw new TTTError("Socio no encontrado después de la actualización");
        }
        return updatedSocio;
    }

    async deleteSocio(id: number) {
        const socio = await this.getSocioById(id);
        if (!socio) {
            throw new TTTError("Socio no encontrado");
        }
        await this.sociosRepository.remove(socio);
    }
}
