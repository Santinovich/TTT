export interface BarrioDto {
    id: number;
    nombre: string;
    comuna: number;
}

export interface GetBarriosDto {
    barrios: BarrioDto[];
}