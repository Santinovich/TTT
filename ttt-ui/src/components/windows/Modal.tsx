import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ConfirmModalProps } from "../../context/ModalContext";
import "./Modal.css";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

export function ConfirmModal({
    title = "Confirmación",
    message,
    onConfirm = () => {},
    onCancel = () => {},
}: ConfirmModalProps) {
    return (
        <div className="window-layer" onClick={onCancel}>
            <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
                <h3><FontAwesomeIcon icon={faExclamationCircle}/> {title}</h3>
                <p>{message}</p>
                <div className="buttons">
                    <button onClick={onConfirm}>Confirmar</button>
                    <button className="cancel" onClick={onCancel}>Cancelar</button>
                </div>
            </div>
        </div>
    );
}
