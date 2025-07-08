import { createContext, useState } from "react";
import { ConfirmModal } from "../components/windows/Modal";

export interface ConfirmModalProps {
    title?: string;
    message: string;
    onConfirm?: () => void;
    onCancel?: () => void;
}

interface ModalContextType {
    confirm: (confirmModalProps: ConfirmModalProps) => void;
}

export const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: React.PropsWithChildren) {
    const [confirmState, setConfirmState] = useState<ConfirmModalProps | null>(null);

    const confirm = ({ title, message, onConfirm, onCancel }: ConfirmModalProps) => {
        setConfirmState({
            title,
            message,
            onConfirm,
            onCancel,
        });
    };

    return (
        <ModalContext.Provider value={{ confirm }}>
            {children}
            {confirmState && (
                <ConfirmModal
                    title={confirmState.title}
                    message={confirmState.message}
                    onConfirm={() => {
                        confirmState.onConfirm?.();
                        setConfirmState(null);
                    }}
                    onCancel={() => {
                        confirmState.onCancel?.();
                        setConfirmState(null);
                    }}
                />
            )}
        </ModalContext.Provider>
    );
}
