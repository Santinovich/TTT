const { Database } = require("sqlite3");
const { Socio, Jubilacion, Ubicacion, Jubilado } = require("../model");
const UbicacionService = require("./UbicacionService");
const ContactoService = require("./contactoService");

class SociosService {
  /**
   * @param {Database} database
   */
  constructor(database) {
    this.database = database;
    this.ubicacionService = new UbicacionService(database);
    this.contactoService = new ContactoService(database);
  }

  /**
   * @param {number} id
   * @returns {Promise<Socio>}
   */
  getSocioById(id) {
    return new Promise((resolve, reject) => {
      this.database.get("SELECT * FROM socio WHERE id=?", [id], async (error, row) => {
        if (error) return reject(error);
        if (!row) return resolve(null);
        const ubicacion = await this.ubicacionService.getUbicacion(row.id);
        const contacto = await this.contactoService.getContacto(row.id);
        const socio = new Socio(
          row.id,
          row.nombre,
          row.apellido,
          new Date(row.nacimiento),
          row.num_dni,
          row.url_dni,
          row.is_afiliado_pj ? true : false,
          ubicacion,
          contacto
        );
        resolve(socio);
      });
    });
  }
  /**
   * @returns {Promise<Socio[]>}
   */
  getSocios() {
    return new Promise((resolve, reject) => {
      this.database.all("SELECT * FROM socio", async (error, rows) => {
        if (error) return reject(error);
        const socios = [];
        if (rows) {
          for (let row of rows) {
            const ubicacion = await this.ubicacionService.getUbicacion(row.id);
            const contacto = await this.contactoService.getContacto(row.id);
            socios.push(
              new Socio(
                row.id,
                row.nombre,
                row.apellido,
                row.nacimiento,
                row.num_dni,
                row.url_dni,
                row.is_afiliado_pj ? true : false,
                ubicacion,
                contacto
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
          if (error) return reject(error);
          const socios = [];
          if (rows) {
            for (let row of rows) {
              socios.push(
                new Jubilado(
                  row.id,
                  row.nombre,
                  row.apellido,
                  new Date(row.nacimiento),
                  row.is_afiliado_pj ? true : false,
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
   * @param {SocioData} socioData
   * @returns
   */
  createSocio({ nombre, apellido, fechaNacimiento, numeroDni }) {
    return new Promise(async (resolve, reject) => {
      this.database.run(
        "INSERT INTO socio (nombre, apellido, nacimiento, num_dni) VALUES (?, ?, ?, ?)",
        [nombre, apellido, fechaNacimiento, numeroDni],
        (error) => {
          if (error) return reject(error);
          resolve();
        }
      );
    });
  }

  /**
   * @param {number} id
   * @param {{nombre: string | null | undefined, apellido: string | null | undefined, fechaNacimiento: Date | null | undefined, numeroDni: number | null  | undefined, ubicacion: Ubicacion}} newSocioData
   */
  updateSocio(idSocio, newSocioData) {
    return new Promise(async (resolve, reject) => {
      if (Object.keys(newSocioData).length === 0) {
        resolve()
      }
      const socio = await this.getSocioById(idSocio);
      if (!socio) return reject("Socio no encontrado");

      let sql = "UPDATE socio SET ";
      const keys = Object.keys(newSocioData).map((k) => this.renameKey(k));
      if (keys.length === 0) return;  
      sql += keys.map((key) => `${key} = ?`).join(", ");
      sql += " WHERE id = ?";

      this.database.run(sql, [...Object.values(newSocioData), idSocio], async (error) => {
        if (error) {
          return reject(error);
        }
      });
      
      resolve(await this.getSocioById(idSocio));
    });
  }

  /**
   *
   * @param {number} id
   * @returns {Socio} deletedSocio
   */
  deleteSocio(id) {
    return new Promise(async (resolve, reject) => {
      const socio = await this.getSocioById(id);
      if (!socio) return reject("Socio no encontrado");

      this.database.run("DELETE FROM socio WHERE id = ?", [id], (error) => {
        if (error) return reject(error);
        resolve(socio);
      });
    });
  }

  renameKey(str) {
    if (str === "fechaNacimiento") return "nacimiento";
    if (str === "numeroDni") return "num_dni";
    if (str === "isAfiliadoPj") return "is_afiliado_pj";
    return str;
  }
}

module.exports = SociosService;
