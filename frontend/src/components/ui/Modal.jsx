import { useEffect } from "react";
import "./Modal.css"

export const Modal = ({
    isOpen,
    onClose,
    closeOnOutsideClick = true,
    variant = "default-modal",
    children
}) => {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        }
        if (isOpen) {
            document.addEventListener("keydown", handleEscape)
        }
        return () => {
            document.removeEventListener("keydown", handleEscape)
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleOverlayClick = () => {
        if (closeOnOutsideClick) {
            onClose();
        }
    }

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div
                className={`modal ${variant}`}
                onClick={(e) => e.stopPropagation()}
            >


                {children}

            </div>
        </div>
    )
}