const { Database } = require("sqlite3");
const { Socio } = require("./model/model");
const express = require("express");
const SociosService = require("./service/sociosService");

const db = new Database("TTT.db");

const app = express();
const port = 3000;

const sociosService = new SociosService(db);

app.get("/socios", async (req, res) => {
  try {
    if (req.query.jubilado === "true") {
      res.json(await sociosService.getJubilados());
    } else {
      res.json(await sociosService.getSocios());
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los socios" });
  }
});

app.listen(port, () => {
  console.log(`Servidor de TTT corriendo en http://localhost:${port}/`);
});
