const express = require("express");
const sociosRouter = express.Router();

const db = require("../db");
const SociosService = require("../service/SociosService");

const sociosService = new SociosService(db);

//TODO: ver router.all para middlewares
sociosRouter.get("/:id?", async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      if (req.query.jubilado === "true") {
        res.json(await sociosService.getJubilados());
      } else {
        res.json(await sociosService.getSocios());
      }
    } else {
      res.json(await sociosService.getSocioById(id));
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los socios: " + error });
  }
});

sociosRouter.post("/", async (req, res) => {
  const nombre = req.body?.nombre;
  const apellido = req.body?.apellido || null;
  const fechaNacimiento = req.body?.fechaNacimiento;
  const numeroDni = req.body?.numeroDni || null;
  const domicilio = req.body?.domicilio || null;
  const idBarrio = req.body?.idBarrio || null;

  try {
    if (nombre) {
      await sociosService.createSocio({ nombre, apellido, fechaNacimiento, numeroDni });
      if (domicilio && idBarrio) {
        
      }
      res.json({ message: "Socio creado exitosamente" });
    } else {
      res.status(400).json({ error: "El nombre es obligatorio" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el socio: " + error });
  }
});

sociosRouter.put("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (!id) return res.status(400).json({ error: "El id es obligatorio" });

  const updateProperties = {};
  req.body?.nombre ? (updateProperties.nombre = req.body.nombre) : null;
  req.body?.apellido ? (updateProperties.apellido = req.body.apellido) : null;
  req.body?.fechaNacimiento ? (updateProperties.fechaNacimiento = req.body.fechaNacimiento) : null;
  req.body?.numeroDni ? (updateProperties.numeroDni = req.body.numeroDni) : null;

  try {
    sociosService.updateSocio(id, updateProperties);
    res.json({ message: "Socio actualizado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el socio: " + error });
  }
});

sociosRouter.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (!id) return res.status(400).json({ error: "El id es obligatorio" });
  try {
    const deletedSocio = await sociosService.deleteSocio(id);
    res.json({ message: "Socio eliminado exitosamente", deletedSocio});
  } catch (error) {
   console.error(error);
    res.status(500).json({ error: "Error al eliminar el socio: " + error });
  }
});

module.exports = sociosRouter;
