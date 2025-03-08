const { Database } = require("sqlite3");
const { Contacto } = require("../model");

class ContactoService {
  /**
   * @param {Database} database
   */
  constructor(database) {
    this.database = database;
  }

  /**
   * @param {number} idSocio 
   * @returns {Promise<Contacto>}
   */
  getContacto(idSocio) {
    return new Promise((resolve, reject) => {
      this.database.get(
        "SELECT * FROM contacto WHERE id_socio=?",
        [idSocio],
        (error, row) => {
          if (error) reject(error);
          let contacto = null;
          if (row) {
            contacto = new Contacto(
              row.id,
              row.telefono,
              row.correo,
              row.idSocio
            );
          }
          resolve(contacto);
        }
      );
    });
  }
}

module.exports = ContactoService;
