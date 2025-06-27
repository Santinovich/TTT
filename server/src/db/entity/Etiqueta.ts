import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Socio } from "./Socio";

@Entity()
export class Etiqueta {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "text" })
    nombre: string;

    @Column({ type: "text", nullable: true })
    descripcion: string | null;

    @Column({ type: "text", nullable: true })
    color: string | null;

    @ManyToMany(() => Socio, (socio) => socio.etiquetas)
    socios: Socio[]
}