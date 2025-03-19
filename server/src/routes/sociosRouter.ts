import express from "express";
import SociosService from "../service/SociosService";
import UbicacionService from "../service/UbicacionService";
import ContactoService from "../service/ContactoService";
import JubilacionService from "../service/JubilacionService";
import db from "../db/db";

const sociosRouter = express.Router();

const sociosService = new SociosService(db);
const ubicacionService = new UbicacionService(db);
const contactoService = new ContactoService(db);
const jubilacionService = new JubilacionService(db);

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
      res.json(await sociosService.getSocioById(parseInt(id)));
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
  try {
    if (nombre) {
      await sociosService.createSocio({ nombre, apellido, fechaNacimiento, numeroDni });
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
  const idSocio = parseInt(req.params.id);
  if (!idSocio) {
    res.status(400).json({ error: "El id es obligatorio" });
    return;
  }

  const newSocioData: any = {};
  req.body?.nombre ? (newSocioData.nombre = req.body.nombre) : null;
  req.body?.apellido ? (newSocioData.apellido = req.body.apellido) : null;
  req.body?.fechaNacimiento ? (newSocioData.fechaNacimiento = req.body.fechaNacimiento) : null;
  req.body?.numeroDni ? (newSocioData.numeroDni = req.body.numeroDni) : null;
  req.body?.isAfiliadoPj !== undefined ? (newSocioData.isAfiliadoPj = req.body.isAfiliadoPj) : null;

  try {
    db.run("BEGIN TRANSACTION");

    await sociosService.updateSocio(idSocio, newSocioData);

    const newUbicacionData = req.body?.ubicacion || null;
    if (newUbicacionData) {
      const newDomicilio = newUbicacionData.domicilio;
      const newBarrioId = newUbicacionData.barrio?.id;

      const ubicacionSocio = await ubicacionService.getUbicacion(idSocio);
      if (ubicacionSocio) {
        await ubicacionService.updateUbicacion(ubicacionSocio.id, newBarrioId, newDomicilio);
      } else {
        await ubicacionService.createUbicacion(idSocio, newBarrioId, newDomicilio);
      }
    }

    const newContactoData = req.body?.contacto || null;
    if (newContactoData) {
      const newTelefono = newContactoData.telefono;
      const newCorreo = newContactoData.correo;

      const contactoSocio = await contactoService.getContacto(idSocio);
      if (contactoSocio) {
        await contactoService.updateContacto(contactoSocio.id, newTelefono, newCorreo);
      } else {
        await contactoService.createContacto(idSocio, newTelefono, newCorreo);
      }
    }

    const newJubilacionData = req.body?.jubilacion || null;
    const jubilacionSocio = await jubilacionService.getJubilacion(idSocio);
    if (newJubilacionData === null && jubilacionSocio) {
      await jubilacionService.deleteJubilacion(jubilacionSocio.id);
    } else if (newJubilacionData) {
      const newImgPami = newJubilacionData?.imgPami || null;
      if (jubilacionSocio) {
        await jubilacionService.updateJubilacion(jubilacionSocio.id, newImgPami);
      } else {
        await jubilacionService.createJubilacion(idSocio, newImgPami);
      }
    }

    db.run("COMMIT");
    res.json({ message: "Socio actualizado exitosamente" });
  } catch (error) {
    db.run("ROLLBACK");
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el socio: " + error });
  }
});

sociosRouter.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (!id) {
    res.status(400).json({ error: "El id es obligatorio" });
    return;
  }
  try {
    const deletedSocio = await sociosService.deleteSocio(id);
    res.json({ message: "Socio eliminado exitosamente", deletedSocio });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar el socio: " + error });
  }
});

export default sociosRouter;