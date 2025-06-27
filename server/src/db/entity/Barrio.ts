import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Ubicacion } from "./Ubicacion";

@Entity()
export class Barrio {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "text" })
    nombre: string;

    @Column({ type: "integer" })
    numeroComuna: number;

    @OneToMany(() => Ubicacion, (ubicacion) => ubicacion.barrio)
    ubicaciones: Ubicacion[]
}