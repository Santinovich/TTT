import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";
import { AppDataSource } from "../db/data-source";
import { Usuario } from "../db/entity/Usuario";
import { TTTError } from "../utils/ttt-error";
import { GetUsuarioDto } from "@shared/dto/usuario.dto";
import { LoginResponseDto } from "@shared/dto/login.dto";

const signToken = (usuario: Usuario) => {
    const secret = process.env.SECRET_KEY;
    if (!secret) {
        throw new Error("No se encontró secret key en .env");
    }
    const dto: GetUsuarioDto = {
        id: usuario.id,
        username: usuario.username,
        rol: usuario.rol,
    }
    return jsonwebtoken.sign(dto, secret, { expiresIn: "3h" });
};

export default class AuthService {
    constructor(private usuarioRepository = AppDataSource.getRepository(Usuario)) {}

    async register(username: string, password: string) {
      const existingUser = await this.usuarioRepository.findOne({
          where: { username },
      });
      if (existingUser) {
          throw new TTTError("El nombre de usuario ya está en uso", 400);
      }
      const newUser = this.usuarioRepository.create({
          username,
          passwordHash: bcrypt.hashSync(password, 10),
      });
      const savedUsuario = await this.usuarioRepository.save(newUser);

      const dto: LoginResponseDto = {
          token: signToken(savedUsuario),
          usuario: {
              id: savedUsuario.id,
              username: savedUsuario.username,
              rol: savedUsuario.rol,
          },
      }
      return dto;
    }

    async login(username: string, password: string) {
        const usuario = await this.usuarioRepository.findOne({
            where: { username },
        });
        if (!usuario) {
            throw new TTTError("Usuario o contraseña incorrectos");
        }
        const isPasswordValid = bcrypt.compareSync(password, usuario.passwordHash);
        if (!isPasswordValid) {
            throw new TTTError("Usuario o contraseña incorrectos");
        }
        const dto: LoginResponseDto = {
            token: signToken(usuario),
            usuario: {
                id: usuario.id,
                username: usuario.username,
                rol: usuario.rol,
            },
        }
        return dto;
    }
}
