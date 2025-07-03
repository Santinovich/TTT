import express from "express";
import SociosService from "../service/SocioService";
import { CreateSocioDto, CreateSocioResponseDto } from "@shared/dto/socio.dto";
import { mapSocioToDto } from "../utils/dto-mappers";
import TTTError from "../utils/ttt-error";
import { Genero } from "ttt-shared/enum/genero.enum";

const sociosRouter = express.Router();

const sociosService = new SociosService();

sociosRouter.get("/:id?", async (req, res) => {
    const { id } = req.params;
    try {
        if (!id) {
            const socios = await sociosService.getSocios();
            const dtos = socios.map((socio) => mapSocioToDto(socio));
            res.json({ socios: dtos });
        } else {
            const socio = await sociosService.getSocioById(parseInt(id));
            if (!socio) {
                res.status(404).json({ error: "Socio no encontrado" });
                return;
            }
            res.json(mapSocioToDto(socio));
        }
    } catch (error) {
        console.error(error);
        if (error instanceof TTTError) {
            res.status(error.statusCode).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: "Error al obtener los socios" });
    }
});

sociosRouter.post("/", async (req, res) => {
    const socioData = req.body as CreateSocioDto;
    if (!socioData.nombre) {
        res.status(400).json({ error: "El nombre es obligatorio" });
        return;
    }
    if (socioData.contacto && !socioData.contacto.telefono && !socioData.contacto.correo) {
        res.status(400).json({ error: "El contacto debe tener teléfono o un correo" });
        return;
    }
    if (socioData.ubicacion && !socioData.ubicacion.domicilio) {
        res.status(400).json({ error: "El domicilio es obligatorio en la ubicación" });
        return;
    }
    if (socioData.genero && !Object.values(Genero).includes(socioData.genero)) {
        res.status(400).json({ error: "Género inválido" });
        return;
    }

    try {
        const newSocio = await sociosService.createSocio(socioData);
        const response: CreateSocioResponseDto = {
            message: "Socio creado correctamente",
            socio: mapSocioToDto(newSocio),
        }
        res.status(201).json(response);
    } catch (error) {
        console.error(error);
        if (error instanceof TTTError) {
        res.status(error.statusCode).json({ error: error.message });
        return;
        }
        res.status(500).json({ error: "Error desconocido al crear el socio" });
    }
});

sociosRouter.patch("/:id", async (req, res) => {
    const { id } = req.params;
    const newSocioData = req.body as CreateSocioDto;

    if (!id) {
        res.status(400).json({ error: "ID del socio es obligatorio" });
        return;
    }

    try {
        const updatedSocio = await sociosService.updateSocio(parseInt(id), newSocioData);
        res.status(200).json(mapSocioToDto(updatedSocio));
    } catch (error) {
        console.error(error);
        if (error instanceof TTTError) {
            res.status(error.statusCode).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: "Error al actualizar el socio" });
    }
});

sociosRouter.delete("/:id", async (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ error: "ID del socio es obligatorio" });
        return;
    }
    try {
        const socio = await sociosService.getSocioById(parseInt(id));
        if (!socio) {
            res.status(404).json({ error: "Socio no encontrado" });
            return;
        }
        await sociosService.deleteSocio(socio.id);
        res.status(200).send({
            message: "Socio eliminado correctamente",
        });
    } catch (error) {
        console.error(error);
        if (error instanceof TTTError) {
            res.status(error.statusCode).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: "Error al eliminar el socio" });
    }
});

export default sociosRouter;
