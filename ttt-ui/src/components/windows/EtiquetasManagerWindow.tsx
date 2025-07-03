import "./EtiquetasManagerWindow.css";
import { Dispatch, useContext, useState } from "react";
import { DataContext } from "../../context/DataContext";
import { defaultEtiquetaColor, EtiquetaDto } from "ttt-shared/dto/etiqueta.dto";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faDatabase, faPencil, faSave } from "@fortawesome/free-solid-svg-icons";
import { ToastContext } from "../../context/ToastContext";

function EtiquetaItem({ etiqueta }: { etiqueta: EtiquetaDto }) {
    const dataContext = useContext(DataContext);
    if (!dataContext) return null;

    const [color, setColor] = useState(
        etiqueta.color ? `#${etiqueta.color}` : defaultEtiquetaColor
    );
    const [nombre, setNombre] = useState(etiqueta.nombre);

    return (
        <div className="etiqueta-item">
            <span>{etiqueta.id}</span>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            <input
                className="etiqueta-color"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
            />
            <button
                disabled={
                    nombre === etiqueta.nombre &&
                    color === (etiqueta.color ? `#${etiqueta.color}` : defaultEtiquetaColor)
                }
                onClick={() => {
                    dataContext.updateEtiqueta(
                        etiqueta.id,
                        nombre,
                        undefined,
                        color.replace("#", "")
                    );
                }}
            >
                <FontAwesomeIcon icon={faSave} />
            </button>
        </div>
    );
}

function EtiquetasManagerWindow({
    hidden,
    setHidden,
}: {
    hidden: boolean;
    setHidden: Dispatch<boolean>;
}) {
    const dataContext = useContext(DataContext);
    const toastContext = useContext(ToastContext)
    if (!dataContext || !toastContext) return null;

    const [newEtiquetaNombre, setNewEtiquetaNombre] = useState("");
    const [newEtiquetaDescripcion, setNewEtiquetaDescripcion] = useState("");
    const [newEtiquetaColor, setNewEtiquetaColor] = useState(defaultEtiquetaColor);

    const handleCreateEtiqueta = () => {
        if (!newEtiquetaNombre) {
            toastContext.addToast({ text: "El nombre de la etiqueta es obligatorio", type: "error" });
            return;
        }
        dataContext.createEtiqueta(
            newEtiquetaNombre,
            newEtiquetaDescripcion,
            newEtiquetaColor.replace("#", "")
        );
        setNewEtiquetaNombre("");
        setNewEtiquetaDescripcion("");
        setNewEtiquetaColor(defaultEtiquetaColor);
    }

    return hidden ? null : (
        <div className="window-layer" onClick={() => setHidden(true)}>
            <div className="window etiquetas-manager" onClick={(e) => e.stopPropagation()}>
                <h1>Etiquetas</h1>
                <h3>Listado actual</h3>
                <div className="current-etiquetas-list">
                    {dataContext.etiquetas.map((etiqueta) => (
                        <EtiquetaItem etiqueta={etiqueta} />
                    ))}
                </div>
                <h3>Crear nueva etiqueta</h3>
                <div className="form-row create-etiqueta">
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre</label>
                        <input type="text" name="nombre" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="descripcion">Descripción</label>
                        <input type="text" name="descripcion" />
                    </div>
                    <div className="form-group etiqueta-color">
                        <label htmlFor="color">Color</label>
                        <input
                            type="color"
                            name="color"
                            value={newEtiquetaColor}
                            onChange={(e) => setNewEtiquetaColor(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <button>
                            <FontAwesomeIcon icon={faAdd} />
                        </button>
                    </div>
                </div>
                <div className="form-row buttons">
                    <button type="button" onClick={() => setHidden(true)}>
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EtiquetasManagerWindow;
