import { Database } from "sqlite3";
import jsonwebtoken from "jsonwebtoken";
import SociosService from "./SociosService";

export default class AuthService {
  database: Database;
  sociosService: SociosService;
  constructor(database: Database) {
    this.database = database;
    this.sociosService = new SociosService(this.database);
  }

  login(username: string, password: string) {
    return new Promise<{ token: string }>((resolve, reject) => {
      this.database.get<DbUser>(
        "SELECT * FROM users WHERE username = ? AND password = ?",
        [username, password],
        async (error, row) => {
          if (error) {
            console.error(error);
            return reject("Error en la base de datos");
          }
          if (!row) return reject(new Error("Usuario o contraseña incorrectos"));
          const secret = process.env.SECRET_KEY;
          if (!secret || typeof secret !== "string") throw new Error("Secret key not found");
          const socio = row.id_socio ? await this.sociosService.getSocioById(row.id_socio) : null;
          const token = jsonwebtoken.sign(
            {
              userId: row.id,
              username: row.username,
              authLevel: row.auth_level,
              socio,
            } as LoginProfile,
            secret,
            { expiresIn: "1h" }
          );
          resolve({ token });
        }
      );
    });
  }
}
