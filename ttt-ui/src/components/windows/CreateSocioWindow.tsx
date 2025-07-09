import "./CreateSocioWindow.css";
import { Dispatch, useContext } from "react";
import { DataContext } from "../../context/DataContext";
import { Genero } from "ttt-shared/enum/genero.enum";
import { CreateSocioDto, SocioDto } from "ttt-shared/dto/socio.dto";
import { ToastContext } from "../../context/ToastContext";

function CreateSocioWindow({
    hidden,
    setHidden,
    setSelectedSocio
}: {
    hidden: boolean;
    setHidden: Dispatch<React.SetStateAction<boolean>>;
    setSelectedSocio: Dispatch<SocioDto | null>;
}) {
    const dataContext = useContext(DataContext);
    const toastContext = useContext(ToastContext);
    if (!dataContext || !toastContext) return null;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const formData = new FormData(e.currentTarget);
        const newSocioData: CreateSocioDto = {
            nombre: formData.get("nombre") as string,
        }
        if (!newSocioData.nombre) {
            toastContext.addToast({
                type: "error",
                text: "El nombre es obligatorio.",
            });
            return;
        }

        const apellido = formData.get("apellido") as string;
        if (apellido !== "") {
            newSocioData.apellido = apellido;
        }

        const numeroDni = parseInt(formData.get("numeroDni") as string);
        if (numeroDni) {
            newSocioData.numeroDni = numeroDni;
        }

        const fechaNacimiento = formData.get("fechaNacimiento") as string;
        if (fechaNacimiento !== "") {
            if (isNaN(Date.parse(fechaNacimiento))) {
                toastContext.addToast({
                    type: "error",
                    text: "Fecha de nacimiento inválida",
                });
                return;
            }
            const [year, month, day] = fechaNacimiento.split("-");

            // TODO: No debería sumarse un día
                newSocioData.fechaNacimiento = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day) + 1)).toISOString();
        }

        const genero = formData.get("genero") as string;
        if (genero !== "") {
            if (!Object.values(Genero).includes(genero as Genero)) {
                toastContext.addToast({
                    type: "error",
                    text: "Género inválido",
                });
                return;
            }
            newSocioData.genero = genero as Genero;
        }

        const telefono = formData.get("telefono") as string;
        const email = formData.get("email") as string;
        if (telefono !== "" || email !== "") {
            newSocioData.contacto = {};
            if (telefono !== "") {
                newSocioData.contacto.telefono = telefono;
            }
            if (email !== "") {
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    toastContext.addToast({
                        type: "error",
                        text: "Email inválido",
                    });
                    return;
                }
                newSocioData.contacto.correo = email;
            }
        }

        const direccion = formData.get("direccion") as string;
        const barrioId = parseInt(formData.get("barrio") as string);
        if (direccion !== "" && barrioId) {
            const barrio = dataContext.barrios.find((b) => b.id === barrioId);
            if (!barrio && barrioId) {
                toastContext.addToast({
                    type: "error",
                    text: "Barrio inválido",
                });
                return;
            }
            newSocioData.ubicacion = {
                domicilio: direccion,
                barrioId
            };
        }

        // Ojo con esto, funciona pero estoy seteando al socio desde la respuesta de creación
        // y no desde el estado del contexto. En caso de haber un bug se debería revisar
        const newSocio = await dataContext.createSocio(newSocioData);
        if (newSocio) {
            setHidden(true);
            setSelectedSocio(newSocio);
        }
    }

    return hidden ? null : (
        <div className="window-layer" onClick={() => setHidden(true)}>
            <div className="window create-socio-window" onClick={(e) => e.stopPropagation()}>
                <h1>Alta de socio</h1>
                <form onSubmit={handleSubmit}>
                    <h3>General</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="nombre">Nombre *</label>
                            <input type="text" name="nombre" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="apellido">Apellido</label>
                            <input type="text" name="apellido" />
                        </div>
                    </div>

                    <div className="form-row wrap">
                        <div className="form-group">
                            <label htmlFor="genero">Género</label>
                            <select name="genero">
                                {Object.values(Genero).map((g) => {
                                    return (
                                        <option key={g} value={g}>
                                            {g}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="numeroDni">Número de DNI</label>
                            <input type="number" name="numeroDni" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="fechaNacimiento">Fecha de nacimiento</label>
                            <input type="date" name="fechaNacimiento" />
                        </div>
                    </div>
                    <h3>Contacto</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="telefono">Teléfono</label>
                            <input type="tel" name="telefono" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" name="email" />
                        </div>
                    </div>
                    <h3>Ubicación</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="direccion">Dirección</label>
                            <input type="text" name="direccion" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="barrio">Barrio</label>
                            <select name="barrio">
                                {dataContext.barrios.map((b) => {
                                    return (
                                        <option key={b.id} value={b.id}>
                                            {b.nombre}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    </div>

                    <div className="form-row buttons">
                        <button type="submit">Crear Socio</button>
                        <button onClick={() => setHidden(true)}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateSocioWindow;
