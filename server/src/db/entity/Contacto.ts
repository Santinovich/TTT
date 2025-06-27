import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Socio } from "./Socio";

@Entity()
export class Contacto {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "text", nullable: true })
    telefono: string;

    @Column({ type: "text", nullable: true })
    correo: string;

    @OneToOne(() => Socio, (socio) => socio.contacto, { onDelete: "CASCADE" })
    @JoinColumn()
    socio: Socio;
}
