import { SocioDto } from "ttt-shared/dto/socio.dto";
import { DataContext } from "../../context/DataContext";
import { useContext, useEffect, useState } from "react";
import { NotaDto } from "ttt-shared/dto/nota.dto";

function SocioNotas({ socio }: { socio: SocioDto }) {
    const dataContext = useContext(DataContext);
    if (!dataContext) return null;

    const [notas, setNotas] = useState<NotaDto[]>([]);

    const fetchNotas = async () => {
        const fetchedNotas = await dataContext.getNotasFromSocio(socio.id);
        setNotas(fetchedNotas);
    };

    useEffect(() => {
        fetchNotas();
    }, []);

    return (
        <div className="socio-notas-container">
            {notas.map((n) => {
                return (
                    <div key={n.id} className="socio-nota">
                        <p>
                            <strong>{n.id}. </strong>
                            {n.texto}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}

export default SocioNotas;
