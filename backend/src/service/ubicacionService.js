const { Database } = require("sqlite3");
const { Ubicacion, Barrio } = require("../model");

class UbicacionService {
  /**
   * @param {Database} database
   */
  constructor(database) {
    this.database = database;
  }

  /**
   * @param {number} id
   * @returns {Promise<Barrio>}
   */
  getBarrio(id) {
    return new Promise((resolve, reject) => {
      this.database.get("SELECT * FROM barrio WHERE id = ?", [id], (error, row) => {
        if (error) reject(error);
        let barrio = null;
        if (row) {
          barrio = new Barrio(row.id, row.nombre, row.comuna);
        }
        resolve(barrio);
      });
    });
  }

  /**
   * @returns {Promise<Barrio[]>}
   */
  getBarrios() {
    return new Promise((resolve, reject) => {
      this.database.all("SELECT * FROM barrio", (error, rows) => {
        if (error) reject(error);
        let barrios = [];
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          const barrio = new Barrio(row.id, row.nombre, row.comuna);
          barrios.push(barrio);
        }
        resolve(barrios);
      });
    });
  }

  /**
   *
   * @param {number} idSocio
   * @returns {Promise<Ubicacion>}
   */
  getUbicacion(idSocio) {
    return new Promise((resolve, reject) => {
      this.database.get(
        "SELECT * FROM ubicacion WHERE id_socio = ?",
        [idSocio],
        async (error, row) => {
          if (error) reject(error);
          let ubicacion = null;
          if (row) {
            const barrio = await this.getBarrio(row.id_barrio);
            ubicacion = new Ubicacion(row.id, row.domicilio, row.id_socio, barrio);
          }
          resolve(ubicacion);
        }
      );
    });
  }

  createUbicacion(idSocio, idBarrio, domicilio) {
    return new Promise((resolve, reject) => {
      this.database.run(
        "INSERT INTO ubicacion (id_socio, id_barrio, domicilio) VALUES (?, ?, ?)",
        [idSocio, idBarrio, domicilio],
        (error) => {
          if (error) reject(error);
          resolve();
        }
      );
    });
  }

  updateUbicacion(idUbicacion, idBarrio = null, domicilio = null, idSocio = null) {
    return new Promise((resolve, reject) => {
      const data = {};
      if (idSocio !== null) data.id_socio = idSocio;
      if (idBarrio !== null) data.id_barrio = idBarrio;
      if (domicilio !== null) data.domicilio = domicilio;

      let sql = `UPDATE ubicacion SET `;
      sql += Object.keys(data)
        .map((key) => `${key} = ?`)
        .join(", ");
      sql += " WHERE id = ?";

      this.database.run(sql, [...Object.values(data), idUbicacion], (error) => {
        if (error) return reject(error);
        resolve();
      });
    });
  }
}


module.exports = UbicacionService;
