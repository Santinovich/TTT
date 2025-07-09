import "./SociosList.css";

import { SocioDto } from "ttt-shared/dto/socio.dto";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faArrowLeft, faArrowRight, faClose, faDeleteLeft, faUpload } from "@fortawesome/free-solid-svg-icons";
import { DocumentoDto } from "ttt-shared/dto/documento.dto";
import { Dispatch, JSX, useContext, useEffect, useState } from "react";
import { DataContext } from "../../context/DataContext";
import { EtiquetaDto } from "ttt-shared/dto/etiqueta.dto";
import Etiqueta from "../pure/Etiqueta";
import { ModalContext } from "../../context/ModalContext";

function NewDocumentoPreview({file, setFile, socio}: { file: File, setFile: Dispatch<File | null>, socio: SocioDto }) {
    const dataContext = useContext(DataContext);
    if (!dataContext) return null;

    return (
        <>
            <div className="doc-preview">
                <span>Previsualización</span>
                <img src={URL.createObjectURL(file)} alt={file.name} />
            </div>
            <div className="buttons">
                <button
                    onClick={() => {
                        dataContext.uploadDocumento(socio.id, file);
                        setFile(null);
                    }}
                >
                    <FontAwesomeIcon icon={faUpload} />
                    Subir
                </button>
                <button onClick={() => {
                        setFile(null);
                    }}>
                    <FontAwesomeIcon icon={faDeleteLeft} />
                    Calcelar
                </button>
            </div>
        </>
    );
}

function EmptyDocumentoPreview({ socio }: { socio: SocioDto }) {
    const dataContext = useContext(DataContext);
    if (!dataContext) return null;

    const [file, setFile] = useState<File | null>(null);

    return (
        <>
            {file ? (
                <NewDocumentoPreview file={file} setFile={setFile} socio={socio} />
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

function DocumentoPreview({ socio }: { socio: SocioDto }) {
    const dataContext = useContext(DataContext);
    const modal = useContext(ModalContext);
    if (!dataContext || !modal) return null;

    const [newDoc, setNewDoc] = useState<File | null>(null);

    const [doc, setDoc] = useState(socio.documentos ? socio.documentos[0] : null);
    const [docImg, setDocImg] = useState<string | null>(null);

    const [docsLength, setDocsLength] = useState(socio.documentos ? socio.documentos.length : 0);

    useEffect(() => {
        if (doc) {
            dataContext.getDocumentoImg(doc.nombreArchivo).then((img) => {
                setDocImg(img);
            });
        } else {
            setDocImg(null);
        }
    }, [doc, dataContext]);

    useEffect(() => {
        if (socio.documentos && socio.documentos.length > 0) {
            setDoc(socio.documentos[0]);
            setDocsLength(socio.documentos.length);
        } else {
            setDoc(null);
            setDocsLength(0);
        }
    }, [socio]);

    const getIndex = (doc: DocumentoDto) => {
        return socio.documentos ? socio.documentos.findIndex((d) => d.id === doc.id) : -1;
    };

    if (newDoc) {
        return <NewDocumentoPreview file={newDoc} setFile={setNewDoc} socio={socio} />;
    }
    if (doc) {
        return (
            <>
                <div className="doc-preview">
                    {getIndex(doc) > 0 ? (
                        <button
                            onClick={() => {
                                const index = getIndex(doc);
                                if (index > 0) {
                                    setDoc(socio.documentos![index - 1]);
                                }
                            }}
                        >
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </button>
                    ) : null}
                    <span>
                        Documento {getIndex(doc) + 1} / {docsLength}
                    </span>

                    {docImg ? (
                        <img src={docImg || ""} alt="" />
                    ) : (
                        <span className="info-text">No se pudo cargar la imagen del documento</span>
                    )}
                    {getIndex(doc) < (socio.documentos?.length || 0) - 1 ? (
                        <button
                            onClick={() => {
                                const index = getIndex(doc);
                                if (index < (socio.documentos?.length || 0) - 1) {
                                    setDoc(socio.documentos![index + 1]);
                                }
                            }}
                        >
                            <FontAwesomeIcon icon={faArrowRight} />
                        </button>
                    ) : null}
                </div>
                <div className="buttons">
                    <input
                        type="file"
                        id="documento-upload"
                        style={{ display: "none" }}
                        onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                                setNewDoc(e.target.files[0]);
                            }
                        }}
                    />
                    <label htmlFor="documento-upload" className="documento-upload-label">
                        Añadir
                    </label>
                    <button
                        onClick={() => {
                            if (doc) {
                                modal.confirm({
                                    title: "Eliminar Documento",
                                    message: `Se eliminará el documento seleccionado. Esta acción es irreversible.`,
                                    onConfirm: () => dataContext.deleteDocumento(doc.id),
                                });
                            }
                        }}
                    >
                        Eliminar
                    </button>
                </div>
            </>
        );
    } else {
        return <EmptyDocumentoPreview socio={socio} />;
    }
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

function SocioField({
    label,
    value,
}: {
    label: string;
    value: string | JSX.Element | undefined | null;
}) {
    return (
        <div className="socio-data-field">
            <p>
                <span className="info-text">{label}</span>
                <br />
                <strong>{value || <span className="info-text">No especificado</span>}</strong>
            </p>
        </div>
    );
}

function SocioDetails({ socio }: { socio: SocioDto }) {
    const dataContext = useContext(DataContext);
    if (!dataContext) return null;

    const getBarrioNombre = (barrioId?: number) => {
        const barrio = dataContext.barrios.find((b) => b.id === barrioId);
        return barrio ? barrio.nombre : <span className="info-text">No especificado</span>;
    }

    const getFechaNacimientoString = (fecha?: string | Date) => {
        if (!fecha) return;
        if (typeof fecha === "string") {
            fecha = new Date(fecha);
        }
        return fecha.toLocaleDateString('es-AR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    return (
        <div className="socio-details-container">
            <div className="socio-details-data">
                <div className="col">
                    <h3>Datos generales</h3>
                    <SocioField label="Nombre" value={socio.nombre} />
                    <SocioField label="Apellido" value={socio.apellido} />
                    <SocioField label="DNI" value={socio.numeroDni?.toString()} />
                    <SocioField
                        label="Fecha de Nacimiento"
                        value={getFechaNacimientoString(socio.fechaNacimiento)}
                    />
                    <SocioField label="Género" value={socio.genero} />
                </div>
                <div className="col">
                    <h3>Contacto</h3>
                    <SocioField label="Teléfono" value={socio.contacto?.telefono} />
                    <SocioField label="Email" value={socio.contacto?.correo} />
                    <SocioField label="Domicilio" value={socio.ubicacion?.domicilio} />
                    <SocioField label="Barrio" value={getBarrioNombre(socio.ubicacion?.barrioId)} />
                </div>
            </div>

            <div className="socio-details-misc">
                <div className="col">
                    <h3>Documentos</h3>
                    <div className="documentos">
                        <DocumentoPreview socio={socio} />
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
        </div>
    );
}

export default SocioDetails;
