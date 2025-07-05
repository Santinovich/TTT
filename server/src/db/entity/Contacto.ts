import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Socio } from "./Socio";

@Entity()
export class Contacto {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "text", nullable: true })
    telefono: string | null;

    @Column({ type: "text", nullable: true })
    correo: string | null;

    @OneToOne(() => Socio, (socio) => socio.contacto, { onDelete: "CASCADE" })
    @JoinColumn()
    socio: Socio;
}
