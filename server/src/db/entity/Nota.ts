import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Socio } from "./Socio";
import { stringDateTransformer } from "../transformers";

@Entity()
export class Nota {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "text" })
    texto: string;

    @Column({
        type: "text",
        default: () => "CURRENT_TIMESTAMP",
        transformer: stringDateTransformer,
    })
    fechaCreacion: Date;

    @ManyToOne(() => Socio, (socio) => socio.notas, { onDelete: "CASCADE", nullable: false })
    @JoinColumn()
    socio: Socio;
}
