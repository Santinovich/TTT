import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Socio } from "./Socio";
import { Barrio } from "./Barrio";

@Entity()
export class Ubicacion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    domicilio: string;

    @ManyToOne(() => Barrio, (barrio) => barrio.ubicaciones, { eager: true, nullable: true })
    barrio: Barrio | null;

    @OneToOne(() => Socio, (socio) => socio.ubicacion, { onDelete: "CASCADE" })
    @JoinColumn()
    socio: Socio;
}
