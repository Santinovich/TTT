import "./SociosList.css";

import { SocioDto } from "ttt-shared/dto/socio.dto";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faClose, faDeleteLeft, faEye, faUpload } from "@fortawesome/free-solid-svg-icons";
import { DocumentoDto } from "ttt-shared/dto/documento.dto";
import { useContext, useEffect, useState } from "react";
import { DataContext } from "../../context/DataContext";
import { EtiquetaDto } from "ttt-shared/dto/etiqueta.dto";
import Etiqueta from "../pure/Etiqueta";

function EmptyDocumentPreview({ socio }: { socio: SocioDto }) {
    const dataContext = useContext(DataContext);
    if (!dataContext) return null;

    const [file, setFile] = useState<File | null>(null);

    return (
        <>
            {file ? (
                <>
                    <div className="doc-preview">
                        <img src={URL.createObjectURL(file)} alt={file.name} />
                    </div>
                    <div className="buttons">
                        <button
                            onClick={() => {
                                if (file) {
                                    dataContext.uploadDocumento(socio.id, file);
                                }
                            }}
                        >
                            <FontAwesomeIcon icon={faUpload} />
                            Subir
                        </button>
                        <button
                            onClick={() => {
                                setFile(null);
                            }}
                        >
                            <FontAwesomeIcon icon={faClose} />
                            Cancelar
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <label htmlFor="documento-upload" className="doc-preview empty">
                        <FontAwesomeIcon icon={faUpload} size={"2x"} />
                        <span>Añadir documento</span>
                    </label>
                    <input
                        type="file"
                        id="documento-upload"
                        style={{ display: "none" }}
                        onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                    />
                </>
            )}
        </>
    );
}

function DocumentPreview({ doc }: { doc: DocumentoDto }) {
    return (
        <div className="doc-preview">
            <img src={"api/v1/static/documentos/" + doc.nombreArchivo} alt="" />
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

function SocioDetails({ socio }: { socio: SocioDto }) {
    const dataContext = useContext(DataContext);
    if (!dataContext) return null;

    const getBarrioNombre = (barrioId?: number) => {
        const barrio = dataContext.barrios.find((b) => b.id === barrioId);
        return barrio ? barrio.nombre : <span className="info-text">No especificado</span>;
    }

    return (
        <div className="socio-details-container">
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
                    <strong>Barrio:</strong> {getBarrioNombre(socio.ubicacion?.barrioId)}
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
                        <EmptyDocumentPreview socio={socio} />
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
    );
}

export default SocioDetails;
