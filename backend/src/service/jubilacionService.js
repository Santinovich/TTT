const { Database } = require("sqlite3");
const { Jubilacion } = require("../model");

class JubilacionService {
  /**
   * @param {Database} database
   */
  constructor(database) {
    this.database = database;
  }

  /**
   * @param {number} idSocio
   * @returns {Promise<Jubilacion | null>}
   */
  getJubilacion(idSocio) {
    return new Promise((resolve, reject) => {
      let jubilacion = null;
      this.database.get("SELECT * FROM jubilacion WHERE id_socio=?", [idSocio], (error, row) => {
        if (error) reject(error);
        if (row) {
          console.log(row);
          jubilacion = new Jubilacion(row.id, row.id_socio, row.img_pami);
        }
        resolve(jubilacion);
      });
    });
  }

  createJubilacion(idSocio, imgPami = null) {
    return new Promise((resolve, reject) => {
      if (!idSocio) reject("Se necesita un id de socio");
      this.database.run(
        "INSERT INTO jubilacion (id_socio, img_pami) VALUES (?, ?)",
        [idSocio, imgPami],
        (error) => {
          if (error) return reject(error);
          resolve();
        }
      );
    });
  }

  updateJubilacion(idJubilacion, idSocio = null, imgPami = null) {
    return new Promise((resolve, reject) => {
      if (!idJubilacion) reject("Se necesita un id de jubilación");
      this.database.run(
        "UPDATE jubilacion SET img_pami=? WHERE id_socio=?",
        [imgPami, idSocio],
        (error) => {
          if (error) return reject(error);
          resolve();
        }
      );
    });
  }

  deleteJubilacion(idJubilacion) {
    return new Promise((resolve, reject) => {
      if (!idJubilacion) reject("Se necesita un id de jubilación");
      this.database.run("DELETE FROM jubilacion WHERE id=?", [idJubilacion], (error) => {
        if (error) return reject(error);
        resolve();
      });
    });
  }
}

module.exports = JubilacionService;
