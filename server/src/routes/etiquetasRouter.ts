import express from "express";
import { AssignEtiquetasDto, CreateEtiquetaDto, DeleteEtiquetasDto, GetEtiquetaDto, GetEtiquetasDto } from "@shared/dto/etiqueta.dto";
import EtiquetaService from "../service/EtiquetaService";
import { mapEtiquetasToDtos, mapEtiquetaToDto } from "../utils/dto-mappers";
import { TTTError } from "../utils/ttt-error";

const etiquetasRouter = express.Router();
const etiquetaService = new EtiquetaService();

etiquetasRouter.get("/:id?", async (req, res) => {
    const { id } = req.params;
    try {
        if (id) {
            const etiqueta = await etiquetaService.getEtiquetaById(parseInt(id));
            if (!etiqueta) {
                res.status(404).json({ error: "Etiqueta no encontrada" });
                return;
            }
            const dto: GetEtiquetaDto = {
                etiqueta: mapEtiquetaToDto(etiqueta),
            };
            res.json(dto);
            return;
        } else {
            const etiquetas = await etiquetaService.getEtiquetas();
            const dto: GetEtiquetasDto = {
                etiquetas: mapEtiquetasToDtos(etiquetas),
            };
            res.json(dto);
        }
    } catch (error) {
        console.error(error);
        if (error instanceof TTTError) {
            res.status(error.statusCode).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: "Error al obtener las etiquetas" });
    }
});

etiquetasRouter.post("/", async (req, res) => {
    const body = req.body as CreateEtiquetaDto;
    if (!body || !body.nombre) {
        res.status(400).json({ error: "Faltan datos para crear la etiqueta" });
        return;
    }
    try {
        const etiqueta = await etiquetaService.createEtiqueta({
            nombre: body.nombre,
            descripcion: body.descripcion,
            color: body.color,
        });
        const dto: GetEtiquetaDto = {
            etiqueta: mapEtiquetaToDto(etiqueta),
        };
        res.status(201).json(dto);
    } catch (error) {
        console.error(error);
        if (error instanceof TTTError) {
            res.status(error.statusCode).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: "Error al crear la etiqueta" });
    }
});

etiquetasRouter.patch("/:id", async (req, res) => {
    const { id } = req.params;
    const body = req.body as CreateEtiquetaDto;
    if (!id || !body || (!body.nombre && !body.descripcion && !body.color)) {
        res.status(400).json({ error: "Faltan datos para actualizar la etiqueta" });
        return;
    }
    try {
        const etiqueta = await etiquetaService.updateEtiqueta(parseInt(id), {
            nombre: body.nombre,
            descripcion: body.descripcion,
            color: body.color,
        });
        const dto: GetEtiquetaDto = {
            etiqueta: mapEtiquetaToDto(etiqueta),
        };
        res.json(dto);
    } catch (error) {
        console.error(error);
        if (error instanceof TTTError) {
            res.status(error.statusCode).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: "Error al actualizar la etiqueta" });
    }
});

etiquetasRouter.delete("/:id", async (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ error: "Falta el ID de la etiqueta a eliminar" });
        return;
    }
    try {
        await etiquetaService.deleteEtiqueta(parseInt(id));
        res.status(200).send({ message: "Etiqueta eliminada correctamente" });
    } catch (error) {
        console.error(error);
        if (error instanceof TTTError) {
            res.status(error.statusCode).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: "Error al eliminar la etiqueta" });
    }
});

etiquetasRouter.post("/socio/:id", async (req, res) => {
    const { id } = req.params;
    const { etiquetasIds } = req.body as AssignEtiquetasDto;
    if (!id || !etiquetasIds || !Array.isArray(etiquetasIds)) {
        res.status(400).json({ error: "Faltan datos para asignar etiquetas al socio" });
        return;
    }
    try {
        const socio = await etiquetaService.addEtiquetasToSocio(parseInt(id), etiquetasIds);
        res.status(200).json({
            message: "Etiquetas asignadas correctamente",
            socio: {
                id: socio.id,
                nombre: socio.nombre,
                etiquetas: mapEtiquetasToDtos(socio.etiquetas || []),
            },
        });
    } catch (error) {
        console.error(error);
        if (error instanceof TTTError) {
            res.status(error.statusCode).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: "Error al asignar etiquetas al socio" });
    }
});

etiquetasRouter.delete("/socio/:id", async (req, res) => {
    const { id } = req.params;
    const { etiquetasIds } = req.body as DeleteEtiquetasDto;
    if (!id || !etiquetasIds || !Array.isArray(etiquetasIds)) {
        res.status(400).json({ error: "Faltan datos para eliminar etiquetas del socio" });
        return;
    }
    try {
        const socio = await etiquetaService.removeEtiquetasFromSocio(parseInt(id), etiquetasIds);
        res.status(200).json({
            message: "Etiquetas eliminadas correctamente del socio",
            socio: {
                id: socio.id,
                nombre: socio.nombre,
                etiquetas: mapEtiquetasToDtos(socio.etiquetas || []),
            },
        });
    } catch (error) {
        console.error(error);
        if (error instanceof TTTError) {
            res.status(error.statusCode).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: "Error al eliminar etiquetas del socio" });
    }
})

export default etiquetasRouter;
