import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Socio } from "./Socio";
import { DocumentoTipo } from "ttt-shared/enum/documento-tipo.enum";


@Entity()
export class Documento {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "text",
        enum: DocumentoTipo,
        default: DocumentoTipo.DNI,
    })
    tipo: DocumentoTipo;

    @Column({ type: "text" })
    nombreArchivo: string;

    @ManyToOne(() => Socio, (socio) => socio.documentos, { onDelete: "CASCADE" })
    @JoinColumn()
    socio: Socio;
}
