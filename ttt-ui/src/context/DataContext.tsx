import { createContext, useContext, useEffect, useState } from "react";
import { ToastContext } from "./ToastContext";
import { useNavigate } from "react-router-dom";

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
  idSocio: number;
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

export type NewSocioData = Partial<
  Omit<Socio, "fechaNacimiento" | "ubicacion" | "contacto" | "jubilacion"> & {
    fechaNacimiento?: string;
    contacto?: Partial<Contacto>;
    ubicacion?: Partial<Ubicacion>;
    jubilacion?: Partial<Jubilacion>;
  }
>;

interface DataContextType {
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  login: (username: string, password: string) => void;
  socios: Socio[];
  barrios: Barrio[];
  getSocio: (id: number) => Socio | undefined;
  createSocio: (newSocioData: NewSocioData) => void;
  updateSocio: (id: number, newSocioData: NewSocioData) => void;
  fetchSocios: () => Promise<void>;
}

export const fetchWithTimeout = async (
  url: string,
  options: RequestInit = {},
  timeoutCallback: () => void = () => {},
  timeout: number = 5000
) => {
  const controller = new AbortController();
  const signal = controller.signal;
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { ...options, signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    timeoutCallback();
    throw new Error("Timeout");
  }
};

export const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: React.PropsWithChildren) {
  const [token, setToken] = useState<string | null>(null);

  const toastContext = useContext(ToastContext);
  const navigate = useNavigate();

  const [socios, setSocios] = useState([] as Socio[]);
  const [barrios, setBarrios] = useState([] as Barrio[]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
    } else {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    if (!token) return;
    fetchSocios();
    fetchBarrios();
  }, [token]);

  const login = async (username: string, password: string) => {
    try {
      const response = await fetchWithTimeout(
        "/api/v1/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        },
        () => {
          toastContext?.addToast({ text: "No hubo respuesta del servidor", type: "error" });
        }
      );

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        setToken(data.token);
        navigate("/");
        toastContext?.addToast({ text: "Inicio de sesión exitoso", type: "info" });
      } else {
        if (response.status === 401) {
          toastContext?.addToast({ text: "Credenciales incorrectas", type: "error" });
        } else {
          toastContext?.addToast({ text: "Error en el servidor", type: "error" });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSocios = async () => {
    try {
      const response = await fetchWithTimeout(
        "/api/v1/socios",
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
        () => {
          toastContext?.addToast({ text: "No hubo respuesta del servidor", type: "error" });
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = (await response.json()) as Socio[];
      data.forEach((socio) => {
        socio.fechaNacimiento = socio.fechaNacimiento ? new Date(socio.fechaNacimiento) : null;
      });
      setSocios(data);
    } catch (error) {
      toastContext?.addToast({
        text: "No se pudo conectar al servidor para obtener los socios.",
        type: "error",
      });
      console.error(error);
    }
  };

  const fetchBarrios = async () => {
    try {
      const response = await fetchWithTimeout(
        "/api/v1/ubicacion/barrios",
        {
          headers: { authorization: `Bearer ${token}` },
        },
        () => {
          toastContext?.addToast({ text: "No hubo respuesta del servidor", type: "error" });
        }
      );
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

  const createSocio = async (newSocioData: NewSocioData) => {
    const response = await fetch("/api/v1/socios", {
      method: "POST",
      headers: { "Content-Type": "application/json", authorization: `Bearer ${token}` },
      body: JSON.stringify(newSocioData),
    });
    if (response.ok) {
      const {message} = await response.json();
      toastContext?.addToast({text: message});
      fetchSocios();
    } else {
      const {error} = await response.json();
      toastContext?.addToast({text: error || "Error desconocido al crear socio.", type: "error"});
    }
  }

  const updateSocio = async (id: number, newSocioData: NewSocioData) => {
    const response = await fetch("/api/v1/socios/" + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json", authorization: `Bearer ${token}` },
      body: JSON.stringify(newSocioData),
    });
    if (response.ok) {
      const {message} = await response.json();
      toastContext?.addToast({text: message});
      fetchSocios();
    } else {
      const {error} = await response.json();
      toastContext?.addToast({text: error || "Error desconocido al actualizar socio.", type: "error"});
    }
  }

  return (
    <DataContext.Provider value={{ token, setToken, login, socios, barrios, fetchSocios, getSocio, createSocio, updateSocio }}>
      {children}
    </DataContext.Provider>
  );
}
