import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { UsuarioRol } from "ttt-shared/enum/usuario-rol.enum";

@Entity()
export class Usuario {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "text", unique: true })
    username: string;

    @Column({ type: "text" })
    passwordHash: string;

    @Column({ type: "text", enum: UsuarioRol, default: UsuarioRol.Socio })
    rol: UsuarioRol;
}
