import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Socio } from "./Socio";

export enum DocumentoTipo {
    DNI = "DNI",
    Pasaporte = "Pasaporte",
    Otro = "Otro"
}

@Entity()
export class Documento {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "enum",
        enum: DocumentoTipo,
        default: DocumentoTipo.DNI,
    })
    tipo: DocumentoTipo;

    @Column({ type: "text" })
    ruta: string;

    @ManyToOne(() => Socio, (socio) => socio.documentos)
    socio: number;
}
