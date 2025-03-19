import { Database, RunResult } from "sqlite3";

export default class ContactoService {
  database;
  constructor(database: Database) {
    this.database = database;
  }

  getContacto(idSocio: number) {
    return new Promise<Contacto | null>((resolve, reject) => {
      this.database.get<DbContacto>(
        "SELECT * FROM contacto WHERE id_socio=?",
        [idSocio],
        (error, row) => {
          if (error) return reject(error);
          if (!row) return resolve(null);
          const contacto: Contacto = {
            id: row.id,
            telefono: row.telefono,
            correo: row.correo,
            idSocio: row.id_socio,
          };
          resolve(contacto);
        }
      );
    });
  }

  createContacto(idSocio: number, telefono: number, correo: string) {
    return new Promise<void>((resolve, reject) => {
      this.database.run(
        "INSERT INTO contacto (telefono, correo, id_socio) VALUES (?, ?, ?)",
        [telefono, correo, idSocio],
        (error) => {
          if (error) return reject(error);
          resolve();
        }
      );
    });
  }

  updateContacto(
    idContacto: number,
    telefono: number | null = null,
    correo = null,
    idSocio = null
  ) {
    return new Promise<void>((resolve, reject) => {
      const data: any = {};
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
        resolve();
      });
    });
  }
}