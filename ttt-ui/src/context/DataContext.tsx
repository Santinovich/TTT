import { createContext, useEffect, useState } from "react";

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

export interface Contacto {
  id: number;
  correo: string;
  telefono: number;
}

export interface Socio {
  id: number;
  nombre: string;
  apellido: string;
  fechaNacimiento: Date | null;
  numeroDni: number | null;
  ubicacion: Ubicacion | null;
  contacto: Contacto | null;
  isAfiliadoPj: boolean;
}

interface DataContextType {
  socios: Socio[];
  barrios: Barrio[];
  getSocio: (id: number) => Socio | undefined;
  fetchSocios: () => Promise<void>;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: React.PropsWithChildren) {
  const [socios, setSocios] = useState([] as Socio[]);
  const [barrios, setBarrios] = useState([] as Barrio[]);

  const fetchSocios = async () => {
    try {
      const response = await fetch("/api/v1/socios");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = (await response.json()) as Socio[];
      data.forEach(
        (socio) =>
          (socio.fechaNacimiento = socio.fechaNacimiento ? new Date(socio.fechaNacimiento) : null)
      );
      setSocios(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchBarrios = async () => {
    try {
      const response = await fetch("/api/v1/ubicacion/barrios");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = (await response.json()) as Barrio[];
      setBarrios(data);
    } catch (error) {
      console.error(error);
    }
  };

  const getSocio = (id: number) => {
    return socios.find((socio) => socio.id === id);
  };


  useEffect(() => {
    fetchSocios();
    fetchBarrios();
  }, []);

  return <DataContext.Provider value={{ socios, barrios, fetchSocios, getSocio }}>{children}</DataContext.Provider>;
}
