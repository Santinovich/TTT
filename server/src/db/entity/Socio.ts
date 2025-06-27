import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { nullableStringDateTransformer } from "../transformers";
import { Documento } from "./Documento";
import { Ubicacion } from "./Ubicacion";
import { Etiqueta } from "./Etiqueta";
import { Contacto } from "./Contacto";
import { Nota } from "./Nota";

@Entity()
export class Socio {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column({ type: "text", nullable: true })
    apellido: string | null;

    @Column({ type: "text", transformer: nullableStringDateTransformer, nullable: true })
    fechaNacimiento: Date | null;

    @Column({ type: "integer", nullable: true })
    numeroDni: number | null;

    @OneToOne(() => Ubicacion, (ubicacion) => ubicacion.socio, {
        eager: true,
        cascade: true,
        nullable: true,
    })
    ubicacion: Ubicacion | null;

    @OneToOne(() => Contacto, (contacto) => contacto.socio, {
        eager: true,
        cascade: true,
        nullable: true,
    })
    contacto: Contacto | null;

    @OneToMany(() => Documento, (documento) => documento.socio, {
        eager: true,
        cascade: true,
    })
    documentos: Documento[];

    @OneToMany(() => Nota, (nota) => nota.socio, {
        eager: true,
        cascade: true,
    })
    notas: Nota[];

    @ManyToMany(() => Etiqueta, (etiqueta) => etiqueta.socios, {
        eager: true,
        cascade: true,
        onDelete: "CASCADE",
    })
    @JoinTable()
    etiquetas: Etiqueta[];
}
