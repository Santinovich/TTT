import { Database } from "sqlite3";

export default class UbicacionService {
  database: Database;
  constructor(database: Database) {
    this.database = database;
  }

  getBarrio(id: number) {
    return new Promise<Barrio | null>((resolve, reject) => {
      this.database.get<DbBarrio>("SELECT * FROM barrio WHERE id = ?", [id], async (error, row) => {
        if (error) return reject(error);
        if (!row) return resolve(null);
        const barrio: Barrio = {
          id: row.id,
          nombre: row.nombre,
          comuna: row.comuna,
        };
        resolve(barrio);
      });
    });
  }

  getBarrios() {
    return new Promise<Barrio[]>((resolve, reject) => {
      this.database.all<DbBarrio>("SELECT * FROM barrio", (error, rows) => {
        if (error) return reject(error);
        let barrios: Barrio[] = [];
        rows.forEach((row) => {
          const barrio: Barrio = {
            id: row.id,
            nombre: row.nombre,
            comuna: row.comuna,
          };
        });
        resolve(barrios);
      });
    });
  }

  getUbicacion(idSocio: number) {
    return new Promise<Ubicacion | null>((resolve, reject) => {
      this.database.get<DbUbicacion>(
        "SELECT * FROM ubicacion WHERE id_socio = ?",
        [idSocio],
        async (error, row) => {
          if (error) return reject(error);
          if (!row) return resolve(null);

          const barrio = await this.getBarrio(row.id_barrio);
          const ubicacion: Ubicacion = {
            id: row.id,
            domicilio: row.domicilio,
            idSocio: row.id_socio,
            barrio: barrio || undefined,
          };
          resolve(ubicacion);
        }
      );
    });
  }

  createUbicacion(idSocio: number, idBarrio: number, domicilio: string) {
    return new Promise<void>((resolve, reject) => {
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

  updateUbicacion(
    idUbicacion: number,
    idBarrio: number | null = null,
    domicilio: string | null = null,
    idSocio: number | null = null
  ) {
    return new Promise<void>((resolve, reject) => {
      const data: any = {};
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
