import { Database } from "sqlite3";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";
import SociosService from "./SociosService";

const encryptPassword = (password: string) => {
  const salt = bcrypt.genSaltSync(10);
  return { hash: bcrypt.hashSync(password, salt), salt };
};

const signToken = (
  userId: number,
  username: string,
  authLevel: number,
  socio: Socio | null = null
) => {
  const secret = process.env.SECRET_KEY;
  if (!secret) {
    throw new Error("No se encontró secret key en .env");
  }
  return jsonwebtoken.sign({ userId, username, authLevel, socio }, secret, { expiresIn: "1h" });
};

export default class AuthService {
  database: Database;
  sociosService: SociosService;
  constructor(database: Database) {
    this.database = database;
    this.sociosService = new SociosService(this.database);
  }

  register(username: string, password: string) {
    return new Promise<{ token: string | undefined, error: string | undefined }>((resolve, reject) => {
      this.database.get<DbUser>(
        "SELECT * FROM users WHERE username = ?",
        [username],
        (error, row) => {
          console.error(error)
          if (error) return reject(new Error("Error en la base de datos"));
          if (row) {
            return resolve({ token: undefined, error: "El usuario ya existe" });
          } else {
            const { hash, salt } = encryptPassword(password);
            console.log(username, hash, salt)
            this.database.run(
              "INSERT INTO users (username, password_hash) VALUES (?, ?)",
              [username, hash],
              function (err: Error | null) {
                if (err) {
                  console.error(err.message);
                  return reject(new Error("Error al registrar el usuario"));
                } else {
                  if (this.lastID) {
                    const token = signToken(this.lastID, username, 0);
                    return resolve({ token, error: undefined });
                  } else {
                    return reject(new Error("Error al registrar el usuario"));
                  }
                }
              }
            );
          }
        }
      );
    });
  }

  login(username: string, password: string) {
    return new Promise<{ token: string }>((resolve, reject) => {
      this.database.get<DbUser>(
        "SELECT * FROM users WHERE username = ?",
        [username],
        async (error, row) => {
          if (error) return reject(new Error("Error en la base de datos"));
          if (row) {
            const isValid = bcrypt.compareSync(password, row.password_hash);
            if (isValid) {
              const socio = row.id_socio
                ? await this.sociosService.getSocioById(row.id_socio)
                : null;
              const token = signToken(row.id, username, row.auth_level, socio);
              return resolve({ token });
            }
          }
          return reject(new Error("Usuario o contraseña incorrectos"));
        }
      );
    });
  }
}
