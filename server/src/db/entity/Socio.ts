import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { numberToBooleanTransformer, stringDateTransformer } from "../transformers";
import { Documento } from "./Documento";
import { Ubicacion } from "./Ubicacion";

@Entity()
export class Socio {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column({ nullable: true })
    apellido: string | null;

    @Column({ type: "text", transformer: stringDateTransformer, nullable: true })
    fechaNacimiento: Date | null;

    @Column({ type: "integer", nullable: true })
    numeroDni: number | null;

    @Column({ type: "integer", default: 0, transformer: numberToBooleanTransformer })
    isAfiliadoPJ: boolean;

    @OneToOne(() => Ubicacion, (ubicacion) => ubicacion.socio, { eager: true })
    ubicacion: Ubicacion;

    @OneToMany(() => Documento, (documento) => documento.socio, { eager: true })
    documentos: Documento[];
}
