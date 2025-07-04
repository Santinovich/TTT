import { SocioDto, UpdateSocioDto } from "ttt-shared/dto/socio.dto";
import { Genero } from "ttt-shared/enum/genero.enum";
import { DataContext } from "../../context/DataContext";
import { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";

function SocioEditor({ socio }: { socio: SocioDto }) {
    const dataContext = useContext(DataContext);
    if (!dataContext) return null;

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget as HTMLFormElement);
        const data: UpdateSocioDto = {}
        if (formData.get("nombre") !== "" && socio.nombre !== formData.get("nombre")) {
            data.nombre = formData.get("nombre") as string;
        }
        if (formData.get("apellido") !== socio.apellido) {
            data.apellido = formData.get("apellido") as string || null;
        }
        if (parseInt(formData.get("numeroDni") as string) !== socio.numeroDni) {
            data.numeroDni = parseInt(formData.get("numeroDni") as string) || null;
        }
        if (formData.get("fechaNacimiento")) {
            const newFechaNacimiento = new Date(formData.get("fechaNacimiento") as string);
            const currentFechaNacimiento = socio.fechaNacimiento ? new Date(socio.fechaNacimiento) : null;
            if (!currentFechaNacimiento || currentFechaNacimiento.getTime() !== newFechaNacimiento.getTime()) {
                data.fechaNacimiento = newFechaNacimiento.toISOString();
            }            
        }
        if (formData.get("genero") && formData.get("genero") !== socio.genero) {
            data.genero = formData.get("genero") as Genero;
        }
        if (formData.get("telefono") || formData.get("correo")) {
            data.contacto = {
                telefono: formData.get("telefono") as string || null,
                correo: formData.get("correo") as string || null,
            };
        }
        if (formData.get("domicilio") || formData.get("barrio")) {
            data.ubicacion = {
                domicilio: formData.get("domicilio") as string || "",
                barrioId: parseInt(formData.get("barrio") as string) || undefined,
            };
        }

        console.log("Datos a actualizar:", data);

        dataContext.updateSocio(socio.id, data);
    };

    return (
        <div className="socio-editor">
            <form onSubmit={handleSubmit}>
                <h2>Editar socio</h2>

                <div className="row">
                    <div className="form-col">
                        <div className="form-group">
                            <label htmlFor="nombre">Nombre</label>
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                defaultValue={socio.nombre}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="apellido">Apellido</label>
                            <input
                                type="text"
                                id="apellido"
                                name="apellido"
                                defaultValue={socio.apellido}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="numeroDni">Número de DNI</label>
                            <input
                                type="text"
                                id="numeroDni"
                                name="numeroDni"
                                defaultValue={socio.numeroDni}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="fechaNacimiento">Nacimiento</label>
                            <input
                                type="date"
                                id="fechaNacimiento"
                                name="fechaNacimiento"
                                defaultValue={
                                    socio.fechaNacimiento
                                        ? new Date(socio.fechaNacimiento)
                                              .toISOString()
                                              .split("T")[0]
                                        : ""
                                }
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="genero">Género</label>
                            <select id="genero" name="genero" defaultValue={socio.genero}>
                                {Object.values(Genero).map((gen) => (
                                    <option key={gen} value={gen}>
                                        {gen}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="form-col">
                        <div className="form-group">
                            <label htmlFor="telefono">Teléfono</label>
                            <input
                                type="tel"
                                id="telefono"
                                name="telefono"
                                defaultValue={socio.contacto?.telefono || ""}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="correo">Email</label>
                            <input
                                type="email"
                                id="correo"
                                name="correo"
                                defaultValue={socio.contacto?.correo || ""}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="domicilio">Domicilio</label>
                            <input
                                type="text"
                                id="domicilio"
                                name="domicilio"
                                defaultValue={socio.ubicacion?.domicilio || ""}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="barrio">Barrio</label>
                            <select
                                id="barrio"
                                name="barrio"
                                defaultValue={socio.ubicacion?.barrioId || ""}
                            >
                                {dataContext.barrios.map((barrio) => (
                                    <option key={barrio.id} value={barrio.id}>
                                        {barrio.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <div className="buttons">
                                <button type="submit">
                                    <FontAwesomeIcon icon={faSave} />
                                    Guardar cambios
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default SocioEditor;
