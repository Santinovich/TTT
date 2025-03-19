import { Database } from "sqlite3";
import UbicacionService from "./UbicacionService";
import ContactoService from "./ContactoService";
import JubilacionService from "./JubilacionService";

export default class SociosService {
  database: Database;
  ubicacionService: UbicacionService;
  contactoService: ContactoService;
  jubilacionService: JubilacionService;
  constructor(database: Database) {
    this.database = database;
    this.ubicacionService = new UbicacionService(database);
    this.contactoService = new ContactoService(database);
    this.jubilacionService = new JubilacionService(database);
  }

  getSocioById(id: number) {
    return new Promise<Socio | null>((resolve, reject) => {
      this.database.get<DbSocio>("SELECT * FROM socio WHERE id=?", [id], async (error, row) => {
        if (error) return reject(error);
        if (!row) return resolve(null);
        const ubicacion = await this.ubicacionService.getUbicacion(row.id);
        const contacto = await this.contactoService.getContacto(row.id);
        const jubilacion = await this.jubilacionService.getJubilacion(row.id);
        const socio: Socio = {
          id: row.id,
          nombre: row.nombre,
          apellido: row.apellido,
          numeroDni: row.num_dni,
          fechaNacimiento: row.nacimiento ? new Date(row.nacimiento) : null,
          isAfiliadoPj: row.is_afiliado_pj ? true : false,
          ubicacion,
          contacto,
          jubilacion,
        };
        resolve(socio);
      });
    });
  }

  getSocios() {
    return new Promise<Socio[]>((resolve, reject) => {
      this.database.all<DbSocio>("SELECT * FROM socio", async (error, rows) => {
        if (error) return reject(error);
        const socios = [];
        if (rows) {
          for (let row of rows) {
            const ubicacion = await this.ubicacionService.getUbicacion(row.id);
            const contacto = await this.contactoService.getContacto(row.id);
            const jubilacion = await this.jubilacionService.getJubilacion(row.id);
            const socio: Socio = {
              id: row.id,
              nombre: row.nombre,
              apellido: row.apellido,
              numeroDni: row.num_dni,
              fechaNacimiento: row.nacimiento ? new Date(row.nacimiento) : null,
              isAfiliadoPj: row.is_afiliado_pj ? true : false,
              ubicacion,
              contacto,
              jubilacion,
            };
            socios.push(socio);
          }
        }
        resolve(socios);
      });
    });
  }

  getJubilados() {
    return new Promise<Jubilado[]>(async (resolve, reject) => {
      this.database.all<DbSocio>(
        "SELECT * FROM socio WHERE id IN (SELECT id_socio FROM jubilacion)",
        async (error, rows) => {
          if (error) return reject(error);
          const jubilados: Jubilado[] = [];
          if (rows) {
            for (let row of rows) {
              const jubilacion = await this.jubilacionService.getJubilacion(row.id);
              if (!jubilacion) continue;
              const jubilado: Jubilado = {
                id: row.id,
                nombre: row.nombre,
                apellido: row.apellido,
                numeroDni: row.num_dni,
                fechaNacimiento: new Date(row.nacimiento),
                isAfiliadoPj: row.is_afiliado_pj ? true : false,
                jubilacion,
              };
              jubilados.push(jubilado);
            }
          }
          resolve(jubilados);
        }
      );
    });
  }

  createSocio({
    nombre,
    apellido,
    fechaNacimiento,
    numeroDni,
  }: {
    nombre: string;
    apellido: string;
    fechaNacimiento: string;
    numeroDni: number;
  }) {
    return new Promise<void>(async (resolve, reject) => {
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

  updateSocio(
    idSocio: number,
    newSocioData: {
      nombre: string | null | undefined;
      apellido: string | null | undefined;
      fechaNacimiento: Date | null | undefined;
      numeroDni: number | null | undefined;
    }
  ) {
    return new Promise<Socio | null>(async (resolve, reject) => {
      if (Object.keys(newSocioData).length === 0) {
        resolve(null);
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

  deleteSocio(id: number) {
    return new Promise<Socio>(async (resolve, reject) => {
      const socio = await this.getSocioById(id);
      if (!socio) return reject("Socio no encontrado");

      this.database.run("DELETE FROM socio WHERE id = ?", [id], (error) => {
        if (error) return reject(error);
        resolve(socio);
      });
    });
  }

  renameKey(str: string) {
    if (str === "fechaNacimiento") return "nacimiento";
    if (str === "numeroDni") return "num_dni";
    if (str === "isAfiliadoPj") return "is_afiliado_pj";
    return str;
  }
}
