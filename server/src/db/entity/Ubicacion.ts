import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Socio } from "./Socio";
import { Barrio } from "./Barrio";

@Entity()
export class Ubicacion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    domicilio: string;

    @ManyToOne(() => Barrio, (barrio) => barrio.ubicaciones, { eager: true })
    barrio: Barrio;

    @OneToOne(() => Socio, (socio) => socio.ubicacion)
    socio: Socio

}