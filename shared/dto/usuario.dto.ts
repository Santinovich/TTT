import { UsuarioRol } from "../enum/usuario-rol.enum";

export interface GetUsuarioDto {
    id: number;
    username: string;
    rol: UsuarioRol;
}