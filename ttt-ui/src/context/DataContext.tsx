import { createContext, useEffect, useState } from "react";

interface Socio {
  id: number;
  nombre: string;
  apellido: string;
  fechaNacimiento: Date;
  numeroDni: number;
}

interface Barrio {
  id: number;
  nombre: string;
  comuna: number;
}

interface DataContextType {
  socios: Socio[];
  barrios: Barrio[];
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: React.PropsWithChildren) {
  const [socios, setSocios] = useState([] as Socio[]);
  const [barrios, setBarrios] = useState([] as Barrio[]);

  const fetchSocios = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/v1/socios");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = (await response.json()) as Socio[];
      setSocios(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchBarrios = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/v1/ubicacion/barrios");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = (await response.json()) as Barrio[];
      setBarrios(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSocios();
    fetchBarrios();
  }, []);

  return <DataContext.Provider value={{ socios, barrios }}>{children}</DataContext.Provider>;
}
