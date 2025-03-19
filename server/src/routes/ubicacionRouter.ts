import express from "express";
const ubicacionRouter = express.Router();
import UbicacionService from "../service/UbicacionService";

import db from "../db/db";

const ubicacionService = new UbicacionService(db);

//TODO: ver router.all para middlewares
ubicacionRouter.get("/barrios", async (req, res) => {
  try {
    const barrios = await ubicacionService.getBarrios();
    res.json(barrios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los barrios: " + error });
  }
});

export default ubicacionRouter;