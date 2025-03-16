import { createContext, useContext, useEffect, useState } from "react";
import { ToastContext } from "./ToastContext";

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

export interface Jubilacion {
  id: number;
  imgPami: string;
}

export interface Socio {
  id: number;
  nombre: string;
  apellido: string;
  fechaNacimiento: Date | null;
  numeroDni: number | null;
  isAfiliadoPj: boolean;
  ubicacion: Ubicacion | null;
  contacto: Contacto | null;
  jubilacion: Jubilacion | null;
}

interface DataContextType {
  socios: Socio[];
  barrios: Barrio[];
  getSocio: (id: number) => Socio | undefined;
  fetchSocios: () => Promise<void>;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: React.PropsWithChildren) {
  const toastContext = useContext(ToastContext);

  const [socios, setSocios] = useState([] as Socio[]);
  const [barrios, setBarrios] = useState([] as Barrio[]);

  const fetchSocios = async () => {
    const controller = new AbortController();
    const signal = controller.signal;
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch("/api/v1/socios", { signal });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = (await response.json()) as Socio[];
      data.forEach((socio) => {
        socio.fechaNacimiento = socio.fechaNacimiento
          ? new Date(socio.fechaNacimiento)
          : null;
      });
      setSocios(data);
    } catch (error) {
      if (error instanceof Error) {
        toastContext?.addToast({ text: "No se pudo conectar al servidor para obtener los socios.", type: "error" });
        console.error(error);
      }
    } finally {
      clearTimeout(timeoutId);
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
