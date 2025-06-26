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

interface DefaultBarrio {
    nombre: string;
    numeroComuna: number;
}

const barrios: DefaultBarrio[] = [
    {
        nombre: "Otro",
        numeroComuna: 0
    },
    {
        nombre: 'Chacarita',
        numeroComuna: 15
    },
    {
        nombre: 'La Paternal',
        numeroComuna: 15
    },
    {
        nombre: 'Villa Crespo',
        numeroComuna: 15
    },
    {
        nombre: 'Palermo',
        numeroComuna: 14
    },
    {
        nombre: 'Villa del Parque',
        numeroComuna: 11
    },
    {
        nombre: 'Almagro',
        numeroComuna: 5
    },
    {
        nombre: 'La Boca',
        numeroComuna: 4
    },
    {
        nombre: 'Belgrano',
        numeroComuna: 13
    },
    {
        nombre: 'Villa Pueyrredon',
        numeroComuna: 12
    },
    {
        nombre: 'Agronomía',
        numeroComuna: 15
    },
    {
        nombre: 'Balvanera',
        numeroComuna: 3
    },
    {
        nombre: 'Barracas',
        numeroComuna: 4
    },
    {
        nombre: 'Boedo',
        numeroComuna: 5
    },
    {
        nombre: 'Constitución',
        numeroComuna: 1
    },
    {
        nombre: 'Retiro',
        numeroComuna: 1
    },
    {
        nombre: 'San Nicolás',
        numeroComuna: 1
    },
    {
        nombre: 'Puerto Madero',
        numeroComuna: 1
    },
    {
        nombre: 'San Telmo',
        numeroComuna: 1
    },
    {
        nombre: 'Montserrat',
        numeroComuna: 1
    },
    {
        nombre: 'Recoleta',
        numeroComuna: 2
    },
    {        nombre: 'San Cristóbal',
        numeroComuna: 3
    },
    {
        nombre: 'Nueva Popeya',
        numeroComuna: 4
    },
    {
        nombre: 'Parque Patricios',
        numeroComuna: 4
    },
    {
        nombre: 'Caballito',
        numeroComuna: 6
    },
    {
        nombre: 'Flores',
        numeroComuna: 7
    },
    {
        nombre: 'Parque Chacabuco',
        numeroComuna: 7
    },
    {
        nombre: 'Villa Soldati',
        numeroComuna: 8
    },
    {
        nombre: 'Villa Riachuelo',
        numeroComuna: 8
    },
    {
        nombre: 'Villa Lugano',
        numeroComuna: 8
    },
    {
        nombre: 'Liniers',
        numeroComuna: 9
    },
    {
        nombre: 'Mataderos',
        numeroComuna: 9
    },
    {
        nombre: 'Parque Avellaneda',
        numeroComuna: 9
    },
    {
        nombre: 'Villa Real',
        numeroComuna: 10
    },
    {
        nombre: 'Monte Castro',
        numeroComuna: 10
    },
    {
        nombre: 'Versalles',
        numeroComuna: 10
    },
    {
        nombre: 'Floresta',
        numeroComuna: 10
    },
    {
        nombre: 'Vélez Sarsfield',
        numeroComuna: 10
    },
    {
        nombre: 'Villa Luro',
        numeroComuna: 10
    },
    {
        nombre: 'Villa General Mitre',
        numeroComuna: 11
    },
    {
        nombre: 'Villa Devoto',
        numeroComuna: 11
    },
    {
        nombre: 'Villa Santa Rita',
        numeroComuna: 11
    },
    {
        nombre: 'Coghlan',
        numeroComuna: 12
    },
    {
        nombre: 'Villa Urquiza',
        numeroComuna: 12
    },
    {
        nombre: 'Saavedra',
        numeroComuna: 12
    },
    {
        nombre: 'Núñez',
        numeroComuna: 13
    },
    {
        nombre: 'Colegiales',
        numeroComuna: 13
    },
    {
        nombre: 'Villa Ortúzar',
        numeroComuna: 15
    },
    {
        nombre: 'Parque Chas',
        numeroComuna: 15
    }
] 