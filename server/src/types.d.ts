import { UsuarioRol } from "@shared/enum/usuario-rol.enum";

export interface UsuarioProfile {
    id: number;
    username: string;
    rol: UsuarioRol
}