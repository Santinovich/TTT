import { SocioDto } from "ttt-shared/dto/socio.dto";
import "./SociosList.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faClose, faDeleteLeft, faEdit, faEye, faNoteSticky, faTrash, faUpload } from "@fortawesome/free-solid-svg-icons";
import { DocumentoDto } from "ttt-shared/dto/documento.dto";
import { useContext, useEffect, useState } from "react";
import { DataContext } from "../../context/DataContext";
import { EtiquetaDto } from "ttt-shared/dto/etiqueta.dto";

interface SocioDetailsProps {
    socio: SocioDto;
}

function EmptyDocumentPreview() {
    return (
        <div className="doc-preview empty">
            <FontAwesomeIcon icon={faUpload} size={"2x"} />
            <span>Añadir documento</span>
        </div>
    );
}

function DocumentPreview({ doc }: { doc: DocumentoDto }) {
    return (
        <div className="doc-preview">
            <img src={"api/v1/static/documentos/" + doc.nombreArchivo} alt="" />
        </div>
    );
}

function Etiqueta({ children, etiqueta, onClick }: { children?: React.ReactNode; etiqueta: EtiquetaDto; onClick?: () => void }) {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            onMouseEnter={() => {
                setHovered(true);
            }}
            onMouseLeave={() => {
                setHovered(false);
            }}
            key={etiqueta.id}
            className="etiqueta"
            style={etiqueta.color ? { backgroundColor: `#${etiqueta.color}` } : {}}
            onClick={onClick ? onClick : undefined}
        >
            <span>{etiqueta.nombre}</span> {children ? children : null}
        </div>
    );
}

function EtiquetaAdder({ socio }: { socio: SocioDto }) {
    const dataContext = useContext(DataContext);
    if (!dataContext) return null;

    const [isSearching, setIsSearching] = useState(false);
    const [etiquetas, setEtiquetas] = useState([] as EtiquetaDto[]);

    useEffect(() => {
        setEtiquetas(dataContext.etiquetas.filter((e) => !socio.etiquetas?.some((se) => se.id === e.id)));
    }, [dataContext.etiquetas]);

    return (
        <>
            {isSearching ? (
                <div className="add-etiqueta">
                    <button onClick={() => setIsSearching(false)}>
                        <FontAwesomeIcon icon={faClose} />
                    </button>
                    <div className="etiquetas-list">
                        {etiquetas.map((etiqueta) => (
                            <Etiqueta
                                etiqueta={etiqueta}
                                onClick={() => {
                                    dataContext.addEtiqueta(socio.id, etiqueta.id);
                                    setIsSearching(false);
                                }}
                            >
                                <FontAwesomeIcon icon={faAdd} />
                            </Etiqueta>
                        ))}
                        {etiquetas.length === 0 ? <span>No hay etiquetas</span> : null}
                    </div>
                </div>
            ) : (
                <button onClick={() => setIsSearching(true)}>
                    <FontAwesomeIcon icon={faAdd} />
                </button>
            )}
        </>
    );
}

function SocioDetails({ socio }: SocioDetailsProps) {
    const dataContext = useContext(DataContext);
    if (!dataContext) return null;
    return (
        <div className="socio-details">
            <div className="socio-details-data-container">
                <div className="socio-details-data">
                    <h2>Detalles del Socio</h2>
                    <p>
                        <strong>Nombre:</strong> {socio.nombre}
                    </p>
                    <p>
                        <strong>Apellido:</strong> {socio.apellido || <span className="info-text">No especificado</span>}
                    </p>
                    <p>
                        <strong>DNI:</strong> {socio.numeroDni || <span className="info-text">No especificado</span>}
                    </p>
                    <p>
                        <strong>Fecha de Nacimiento:</strong>{" "}
                        {socio.fechaNacimiento ? (
                            new Date(socio.fechaNacimiento).toLocaleDateString()
                        ) : (
                            <span className="info-text">No especificado</span>
                        )}
                    </p>
                    <p>
                        <strong>Domicilio:</strong> {socio.ubicacion?.domicilio || <span className="info-text">No especificado</span>}
                    </p>
                    <p>
                        <strong>Barrio:</strong> {socio.ubicacion?.barrioId || <span className="info-text">No especificado</span>}
                    </p>
                    <p>
                        <strong>Teléfono:</strong> {socio.contacto?.telefono || <span className="info-text">No especificado</span>}
                    </p>
                    <p>
                        <strong>Email:</strong> {socio.contacto?.correo || <span className="info-text">No especificado</span>}
                    </p>
                </div>
                <div className="socio-details-misc">
                    <h3>Documentos</h3>
                    <div className="documentos">
                        {socio.documentos && socio.documentos.length > 0 ? (
                            <>
                                <DocumentPreview key={socio.documentos[0].id} doc={socio.documentos[0]} />
                                <div className="buttons">
                                    <button>
                                        <FontAwesomeIcon icon={faUpload} /> Agregar
                                    </button>
                                    <button disabled={socio.documentos.length <= 1}>
                                        <FontAwesomeIcon icon={faEye} /> Ver todos
                                    </button>
                                </div>
                            </>
                        ) : (
                            <EmptyDocumentPreview />
                        )}
                    </div>
                    <h3>Etiquetas</h3>
                    <div className="etiquetas">
                        {socio.etiquetas && socio.etiquetas.length > 0 ? (
                            socio.etiquetas.map((etiqueta) => {
                                return (
                                    <Etiqueta
                                        etiqueta={etiqueta}
                                        onClick={() => {
                                            dataContext.removeEtiqueta(socio.id, etiqueta.id);
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faDeleteLeft} />
                                    </Etiqueta>
                                );
                            })
                        ) : (
                            <>
                                <span>No hay etiquetas</span>
                            </>
                        )}
                        <EtiquetaAdder socio={socio} />
                    </div>
                </div>
            </div>
            <div className="socio-details-actions-container">
                <button>
                    <FontAwesomeIcon icon={faTrash} />
                </button>
                <button>
                    <FontAwesomeIcon icon={faNoteSticky} />
                </button>
                <button>
                    <FontAwesomeIcon icon={faEdit} />
                </button>
            </div>
        </div>
    );
}

export default SocioDetails;
