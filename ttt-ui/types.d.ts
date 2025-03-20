export interface Barrio {
    id: number;
    nombre: string;
    comuna: number;
  }

  export interface Ubicacion {
    id: number;
    nombre: string;
    domicilio: string;
    barrio: Barrio | null;
  }