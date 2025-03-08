const { Database } = require("sqlite3");
const { Socio, Jubilacion, Jubilado } = require("../model/model");
const UbicacionService = require("./ubicacionService");

class SociosService {
  /**
   * @param {Database} database
   */
  constructor(database) {
    this.database = database;
    this.ubicacionService = new UbicacionService(database);
  }

  /**
   * @param {number} id
   * @returns {Promise<Socio>}
   */
  getSocioById(id) {
    return new Promise((resolve, reject) => {
      this.database.get(
        "SELECT * FROM socio WHERE id=?",
        [id],
        (error, row) => {
          if (error) reject(error);
          const socio = new Socio(
            row.id,
            row.nombre,
            row.apellido,
            row.num_dni,
            row.url_dni
          );
          resolve(socio);
        }
      );
    });
  }
  /**
   * @returns {Promise<Socio[]>}
   */
  getSocios() { 
    return new Promise((resolve, reject) => {
      this.database.all("SELECT * FROM socio", async (error, rows) => {
        if (error) reject(error);
        const socios = [];
        if (rows) {
          for (let row of rows) {
            const ubicacion = await this.ubicacionService.getUbicacion(row.id);
            socios.push(
              new Socio(
                row.id,
                row.nombre,
                row.apellido,
                row.num_dni,
                row.url_dni,
                ubicacion
              )
            );
          }
        }
        resolve(socios);
      });
    });
  }

  /**
   * @returns {Promise<[Jubilado]>}
   */
  getJubilados() {
    return new Promise(async (resolve, reject) => {
      this.database.all(
        "SELECT * FROM socio WHERE id IN (SELECT id_socio FROM jubilacion)",
        (error, rows) => {
          if (error) reject(error);
          const socios = [];
          if (rows) {
            for (let row of rows) {
              socios.push(
                new Jubilado(
                  row.id,
                  row.nombre,
                  row.apellido,
                  row.num_dni,
                  row.url_dni
                )
              );
            }
          }
          resolve(socios);
        }
      );
    });
  }
  /**
   * @returns {Promise<[Jubilacion]>}
   */
  getJubilaciones() {
    return new Promise((resolve, reject) => {
      this.database.all("SELECT * from jubilacion", (error, rows) => {
        if (error) reject(error);
        const jubilaciones = [];
        if (rows) {
          for (let row of rows) {
            jubilaciones.push(
              new Jubilacion(
                row.id,
                row.nombre,
                row.apellido,
                row.num_dni,
                row.url_dni
              )
            );
          }
        }
        resolve(jubilaciones);
      });
    });
  }
}

module.exports = SociosService;
