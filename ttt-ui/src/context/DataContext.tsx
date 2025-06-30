import { createContext, useContext, useEffect, useState } from "react";
import { ToastContext } from "./ToastContext";
import { useNavigate } from "react-router-dom";
import { CreateSocioDto, GetSociosDto, SocioDto } from "ttt-shared/dto/socio.dto";
import { BarrioDto, GetBarriosDto } from "ttt-shared/dto/ubicacion.dto";
import { fetchWithTimeout } from "../utils/fetchWithTimeout";
import { EtiquetaDto } from "ttt-shared/dto/etiqueta.dto";
import { NotaDto } from "ttt-shared/dto/nota.dto";
import { DocumentoTipo } from "ttt-shared/enum/documento-tipo.enum";

interface DataContextType {
    token: string | null;
    setToken: React.Dispatch<React.SetStateAction<string | null>>;
    login: (username: string, password: string) => void;
    socios: SocioDto[];
    barrios: BarrioDto[];
    etiquetas: EtiquetaDto[];
    getSocio: (id: number) => SocioDto | undefined;
    createSocio: (newSocioData: CreateSocioDto) => void;
    updateSocio: (id: number, newSocioData: CreateSocioDto) => void;
    deleteSocio: (id: number) => void;
    uploadDocumento: (socioId: number, file: File) => void;
    addEtiqueta: (socioId: number, etiquetaId: number) => void;
    removeEtiqueta: (socioId: number, etiquetaId: number) => void;
    getNotasFromSocio: (socioId: number) => Promise<NotaDto[]>;
    fetchSocios: () => Promise<void>;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: React.PropsWithChildren) {
    const [token, setToken] = useState<string | null>(null);

    const toastContext = useContext(ToastContext);
    const navigate = useNavigate();

    const [socios, setSocios] = useState([] as SocioDto[]);
    const [barrios, setBarrios] = useState([] as BarrioDto[]);
    const [etiquetas, setEtiquetas] = useState([] as EtiquetaDto[]);

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
        fetchEtiquetas();
    }, [token]);

    const handleErrorResponse = async (errorResponse: Response, defaultMessage: string = "Error en el servidor") => {
        const errorData = await errorResponse.json();
        const errorMessage = errorData.error || defaultMessage;
        toastContext?.addToast({ text: errorMessage, type: "error" });
    };

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
                    toastContext?.addToast({
                        text: "No hubo respuesta del servidor",
                        type: "error",
                    });
                }
            );
            if (!response.ok) {
                return handleErrorResponse(response);
            }
            const data = await response.json();
            localStorage.setItem("token", data.token);
            setToken(data.token);
            navigate("/");
            toastContext?.addToast({ text: "Inicio de sesión exitoso", type: "info" });
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
                    toastContext?.addToast({
                        text: "No hubo respuesta del servidor",
                        type: "error",
                    });
                }
            );
            if (!response.ok) {
                return handleErrorResponse(response, "No se pudieron obtener los socios");
            }
            const { socios } = (await response.json()) as GetSociosDto;
            socios.forEach((socio) => {
                socio.fechaNacimiento = socio.fechaNacimiento ? new Date(socio.fechaNacimiento) : undefined;
            });
            setSocios(socios);
        } catch (error) {
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
                    toastContext?.addToast({
                        text: "No hubo respuesta del servidor",
                        type: "error",
                    });
                }
            );
            if (!response.ok) {
                return handleErrorResponse(response, "No se pudieron obtener los barrios");
            }
            const { barrios } = (await response.json()) as GetBarriosDto;
            setBarrios(barrios);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchEtiquetas = async () => {
        try {
            const response = await fetchWithTimeout(
                "/api/v1/etiquetas",
                {
                    headers: { authorization: `Bearer ${token}` },
                },
                () => {
                    toastContext?.addToast({
                        text: "No hubo respuesta del servidor",
                        type: "error",
                    });
                }
            );
            if (!response.ok) {
                return handleErrorResponse(response, "No se pudieron obtener las etiquetas");
            }
            const data = await response.json();
            setEtiquetas(data.etiquetas);
        } catch (error) {
            console.error(error);
        }
    };

    const getSocio = (id: number) => {
        return socios.find((socio) => socio.id === id);
    };

    const createSocio = async (newSocioData: CreateSocioDto) => {
        const response = await fetch("/api/v1/socios", {
            method: "POST",
            headers: { "Content-Type": "application/json", authorization: `Bearer ${token}` },
            body: JSON.stringify(newSocioData),
        });
        if (!response.ok) {
            handleErrorResponse(response, "Error al crear socio");
        }
        const body = await response.json();
        console.log(body);
        toastContext?.addToast({ text: "Socio creado" });
        fetchSocios();
    };

    const updateSocio = async (id: number, newSocioData: CreateSocioDto) => {
        const response = await fetch("/api/v1/socios/" + id, {
            method: "PATCH",
            headers: { "Content-Type": "application/json", authorization: `Bearer ${token}` },
            body: JSON.stringify(newSocioData),
        });
        if (!response.ok) {
            return handleErrorResponse(response, "Error al actualizar socio");
        }
        const { message } = await response.json();
        toastContext?.addToast({ text: message });
        fetchSocios();
    };

    const deleteSocio = async (id: number) => {
        const response = await fetch(`/api/v1/socios/${id}`, {
            method: "DELETE",
            headers: { authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
            return handleErrorResponse(response, "Error al eliminar socio");
        }
        const { message } = await response.json();
        toastContext?.addToast({ text: message });
        fetchSocios();
    };

    const uploadDocumento = async (socioId: number, file: File) => {
        const tipo = DocumentoTipo.DNI;
        const formData = new FormData();
        formData.append("documento", file);
        formData.append("tipo", tipo);
        const response = await fetch(`/api/v1/documentos?idSocio=${socioId}`, {
            method: "POST",
            headers: { authorization: `Bearer ${token}` },
            body: formData,
        });
        if (!response.ok) {
            return handleErrorResponse(response, "Error al crear documento");
        }
        const { message } = await response.json();
        toastContext?.addToast({ text: message });
        fetchSocios();
    };

    const addEtiqueta = async (socioId: number, etiquetaId: number) => {
        const response = await fetch(`/api/v1/etiquetas/socio/${socioId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ etiquetasIds: [etiquetaId] }),
        });
        if (!response.ok) {
            return handleErrorResponse(response, "Error al agregar etiqueta al socio");
        }
        const { message } = await response.json();
        toastContext?.addToast({ text: message });
        fetchSocios();
    };

    const removeEtiqueta = async (socioId: number, etiquetaId: number) => {
        const response = await fetch(`/api/v1/etiquetas/socio/${socioId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ etiquetasIds: [etiquetaId] }),
        });
        if (!response.ok) {
            return handleErrorResponse(response, "Error al eliminar etiqueta del socio");
        }
        const { message } = await response.json();
        toastContext?.addToast({ text: message });
        fetchSocios();
    };

    /*
        Este fetch no setea estado sino que devuelve las notas del socio.
    */
    const getNotasFromSocio = async (socioId: number) => {
        const response = await fetch(`/api/v1/notas?idSocio=${socioId}`, {
            headers: { authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
            handleErrorResponse(response, "Error al obtener notas del socio");
            return [];
        }
        const data = await response.json();
        return data.notas as NotaDto[];
    };

    return (
        <DataContext.Provider
            value={{
                token,
                setToken,
                login,
                socios,
                barrios,
                etiquetas,
                fetchSocios,
                getSocio,
                createSocio,
                updateSocio,
                deleteSocio,
                addEtiqueta,
                removeEtiqueta,
                uploadDocumento,
                getNotasFromSocio,
            }}
        >
            {children}
        </DataContext.Provider>
    );
}
