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

  createContacto(idSocio, telefono, correo) {
    return new Promise((resolve, reject) => {
      this.database.run(
        "INSERT INTO contacto (telefono, correo, id_socio) VALUES (?, ?, ?)",
        [telefono, correo, idSocio],
        function (error) {
          if (error) reject(error);
          resolve(this.lastID);
        }
      );
    });
  }

  updateContacto(idContacto, telefono = null, correo = null, idSocio = null,) {
    return new Promise((resolve, reject) => {
      const data = {};
      if (telefono !== null) data.telefono = telefono;
      if (correo !== null) data.correo = correo;
      if (idSocio !== null) data.id_socio = idSocio;

      let sql = `UPDATE contacto SET `;
      sql += Object.keys(data)
        .map((key) => `${key} = ?`)
        .join(", ");
      sql += " WHERE id = ?";

      this.database.run(sql, [...Object.values(data), idContacto], (error) => {
        if (error) return reject(error);
        resolve(this.lastID);
      });
    });
  }
}

module.exports = ContactoService;
