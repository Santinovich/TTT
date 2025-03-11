const express = require("express");
const ubicacionRouter = express.Router();
const UbicacionService = require("../service/UbicacionService");

const db = require("../db");

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

module.exports = ubicacionRouter;
