import { Database } from "sqlite3";

export default class JubilacionService {
  database: Database;
  constructor(database: Database) {
    this.database = database;
  }

  getJubilacion(idSocio: number) {
    return new Promise<Jubilacion | null>((resolve, reject) => {
      this.database.get<DbJubilacion>(
        "SELECT * FROM jubilacion WHERE id_socio=?",
        [idSocio],
        (error, row) => {
          if (error) return reject(error);
          if (!row) return resolve(null);
          const jubilacion: Jubilacion = {
            id: row.id,
            idSocio: row.id_socio,
            imgPami: row.img_pami,
          };
          resolve(jubilacion);
        }
      );
    });
  }

  createJubilacion(idSocio: number, imgPami: string | null = null) {
    return new Promise<void>((resolve, reject) => {
      if (!idSocio) return reject("Se necesita un id de socio");
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

  updateJubilacion(
    idJubilacion: number,
    idSocio: number | null = null,
    imgPami: string | null = null
  ) {
    return new Promise<void>((resolve, reject) => {
      if (!idJubilacion) return reject("Se necesita un id de jubilación");
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

  deleteJubilacion(idJubilacion: number) {
    return new Promise<void>((resolve, reject) => {
      this.database.run("DELETE FROM jubilacion WHERE id=?", [idJubilacion], (error) => {
        if (error) return reject(error);
        resolve();
      });
    });
  }
}
