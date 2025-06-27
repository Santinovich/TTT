import express from "express";
import NotaService from "../service/NotaService";
import { CreateNotaDto, GetNotaDto, GetNotasDto } from "@shared/dto/nota.dto";
import { mapNotasToDtos, mapNotaToDto } from "../utils/dto-mappers";
import { TTTError } from "../utils/ttt-error";

const notasRouter = express.Router();
const notaService = new NotaService();

notasRouter.get("/", async (req, res) => {
    const idSocio = !isNaN(parseInt(req.query.idSocio as string))
        ? parseInt(req.query.idSocio as string)
        : null;
    if (!idSocio) {
        res.status(400).json({ error: "ID de socio inválido" });
        return;
    }
    try {
        const notas = await notaService.getNotasBySocioId(idSocio);
        const dto: GetNotasDto = {
            notas: mapNotasToDtos(notas),
        };
        res.json(dto);
    } catch (error) {
        console.error(error);
        if (error instanceof TTTError) {
            res.status(error.statusCode).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: "Error al obtener las notas" });
    }
});

notasRouter.post("/", async (req, res) => {
    const idSocio = !isNaN(parseInt(req.query.idSocio as string))
        ? parseInt(req.query.idSocio as string)
        : null;
    if (!idSocio) {
        res.status(400).json({ error: "ID de socio inválido" });
        return;
    }
    const body = req.body as CreateNotaDto;
    if (!body || !body.texto) {
        res.status(400).json({ error: "Faltan datos para crear la nota" });
        return;
    }
    try {
        const nota = await notaService.createNota(idSocio, {
            texto: body.texto,
            fechaCreacion: new Date(),
        });
        const dto = mapNotasToDtos([nota])[0];
        res.status(201).json(dto);
    } catch (error) {
        console.error(error);
        if (error instanceof TTTError) {
            res.status(error.statusCode).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: "Error al crear la nota" });
    }
});

notasRouter.patch("/:idNota", async (req, res) => {
    const idNota = !isNaN(parseInt(req.params.idNota)) ? parseInt(req.params.idNota) : null;
    if (!idNota) {
        res.status(400).json({ error: "ID de nota inválido" });
        return;
    }
    const body = req.body as CreateNotaDto;
    if (!body || !body.texto) {
        res.status(400).json({ error: "Faltan datos para actualizar la nota" });
        return;
    }
    try {
        const updatedNota = await notaService.updateNota(idNota, {
            texto: body.texto,
        });
        const dto: GetNotaDto = {
            nota: mapNotaToDto(updatedNota),
        }
        res.json(dto);
    } catch (error) {
        console.error(error);
        if (error instanceof TTTError) {
            res.status(error.statusCode).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: "Error al actualizar la nota" });
    }
});

notasRouter.delete("/:idNota", async (req, res) => {
    const idNota = !isNaN(parseInt(req.params.idNota)) ? parseInt(req.params.idNota) : null;
    if (!idNota) {
        res.status(400).json({ error: "ID de nota inválido" });
        return;
    }
    try {
        await notaService.deleteNota(idNota);
        res.status(200).send({
            message: "Nota eliminada correctamente",
        });
    } catch (error) {
        console.error(error);
        if (error instanceof TTTError) {
            res.status(error.statusCode).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: "Error al eliminar la nota" });
    }
});

export default notasRouter;
