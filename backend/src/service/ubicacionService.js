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
      this.database.get(
        "SELECT * FROM barrio WHERE id = ?",
        [id],
        (error, row) => {
          if (error) reject(error);
          let barrio = null;
          if (row) {
            barrio = new Barrio(row.id, row.nombre, row.comuna);
          }
          resolve(barrio);
        }
      );
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
            ubicacion = new Ubicacion(
              row.id,
              row.domicilio,
              row.id_socio,
              barrio
            );
          }
          resolve(ubicacion);
        }
      );
    });
  }
}

module.exports = UbicacionService;
