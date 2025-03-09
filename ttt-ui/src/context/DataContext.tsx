import { createContext, useEffect, useState } from "react";

interface Socio {
  id: number;
  nombre: string;
  apellido: string;
  fechaNacimiento: Date;
  numeroDni: number;
}

interface DataContextType {
  socios: Socio[];
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: React.PropsWithChildren) {
  const [socios, setSocios] = useState([] as Socio[]);

  const fetchSocios = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/v1/socios");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = (await response.json()) as Socio[];
      console.log(data);
      setSocios(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSocios();
    console.log("socios");
  }, []);

  return <DataContext.Provider value={{ socios }}>{children}</DataContext.Provider>;
}
