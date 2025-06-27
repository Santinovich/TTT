import { GetUsuarioDto } from "./usuario.dto";

export interface LoginRequestDto {
    username: string;
    password: string;
}

export interface LoginResponseDto {
    token: string;
    usuario: GetUsuarioDto;
}