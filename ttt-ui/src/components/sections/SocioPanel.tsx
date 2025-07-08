import { SocioDto } from "ttt-shared/dto/socio.dto";
import SocioDetails from "./SocioDetails";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser, faEdit, faNoteSticky, faTrash } from "@fortawesome/free-solid-svg-icons";
import { DataContext } from "../../context/DataContext";
import { useContext, useState } from "react";
import SocioNotas from "./SocioNotas";
import SocioEditor from "./SocioEditor";
import { ModalContext } from "../../context/ModalContext";

enum SocioPanelSections {
    Details,
    Edit,
    Delete,
    AddNote,
}

function SocioPanel({ socio }: { socio: SocioDto }) {
    const dataContext = useContext(DataContext);
    const modal = useContext(ModalContext);
    if (!dataContext || !modal) return null;

    const [selectedSection, setSelectedSection] = useState<SocioPanelSections | null>(SocioPanelSections.Details);

    return (
        <div className="socio-panel">
            <div className="socio-panel-section-container">
                {selectedSection === SocioPanelSections.Details ? <SocioDetails socio={socio} /> : null}
                {selectedSection === SocioPanelSections.AddNote ? <SocioNotas socio={socio} /> : null}
                {selectedSection === SocioPanelSections.Edit ? <SocioEditor socio={socio} /> : null}
            </div>
            <div className="socio-panel-actions-container">
                <button onClick={() => setSelectedSection(SocioPanelSections.Details)}>
                    <FontAwesomeIcon icon={faCircleUser} />
                </button>
                <button onClick={() => setSelectedSection(SocioPanelSections.AddNote)}>
                    <FontAwesomeIcon icon={faNoteSticky} />
                </button>
                <button onClick={() => setSelectedSection(SocioPanelSections.Edit)}>
                    <FontAwesomeIcon icon={faEdit} />
                </button>
                <button onClick={() => modal.confirm({
                    title: "Eliminar Socio",
                    message: `Se va a eliminar al socio ${socio.nombre} ${socio.apellido} (ID ${socio.id}) y todos sus datos asociados. La acción es irreversible.`,
                    onConfirm: () => dataContext.deleteSocio(socio.id)
                })}>
                    <FontAwesomeIcon icon={faTrash} />
                </button>
            </div>
        </div>
    );
}

export default SocioPanel;
