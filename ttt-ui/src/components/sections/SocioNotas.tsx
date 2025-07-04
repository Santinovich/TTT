import { SocioDto } from "ttt-shared/dto/socio.dto";
import { DataContext } from "../../context/DataContext";
import { useContext, useEffect, useState } from "react";
import { NotaDto } from "ttt-shared/dto/nota.dto";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";

function Nota({ nota, index, onDelete }: { nota: NotaDto; index: number, onDelete?: () => void }) {
    const dataContext = useContext(DataContext);
    if (!dataContext) return null;

    const [hovered, setHovered] = useState<boolean>(false);

    return (
        <div
            key={nota.id}
            className="socio-nota"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <p>
                <strong>{index}. </strong>
                {nota.texto.split("\n").map((line, i) => (
                    <span key={i}>
                        {line}
                        {i < nota.texto.split("\n").length - 1 ? <br /> : null}
                    </span>
                ))}
            </p>
            {hovered ? (
                <>
                    <button>
                        <FontAwesomeIcon icon={faPencil} />
                    </button>
                    <button onClick={() => onDelete ? onDelete() : null}>
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </>
            ) : null}
        </div>
    );
}

function SocioNotas({ socio }: { socio: SocioDto }) {
    const dataContext = useContext(DataContext);
    if (!dataContext) return null;



    const [notas, setNotas] = useState<NotaDto[]>([]);
    const [newNotaText, setNewNotaText] = useState<string>("");

    const fetchNotas = async () => {
        const fetchedNotas = await dataContext.getNotasFromSocio(socio.id);
        setNotas(fetchedNotas);
    };

    const handleAddNota = async () => {
        if (newNotaText.trim() === "") return;
        await dataContext.addNotaToSocio(socio.id, newNotaText);
        setNewNotaText("");
        fetchNotas();
    }

    useEffect(() => {
        fetchNotas();
    }, []);

    return (
        <div className="socio-notas-container">
            <div className="notas">
                {notas.length ? (
                    notas.map((n) => (
                        <Nota
                            nota={n}
                            index={notas.indexOf(n)}
                            onDelete={async () => {
                                await dataContext.deleteNota(n.id);
                                fetchNotas();
                            }}
                        />
                    ))
                ) : (
                    <div className="socio-nota empty"><p>No hay notas</p></div>
                )}
            </div>
            <div className="socio-nota-input">
                <textarea
                    value={newNotaText}
                    onChange={(e) => {
                        setNewNotaText(e.target.value);
                    }}
                    placeholder="Nueva nota"
                ></textarea>
                <button onClick={handleAddNota}>
                    <FontAwesomeIcon icon={faAdd} />
                </button>
            </div>
        </div>
    );
}

export default SocioNotas;
