import express from "express";
const ubicacionRouter = express.Router();
import UbicacionService from "../service/UbicacionService";


const ubicacionService = new UbicacionService();

ubicacionRouter.get("/barrios", async (req, res) => {
    try {
        const barrios = await ubicacionService.getBarrios();
        res.json({ barrios });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener los barrios" });
    }
});

export default ubicacionRouter;