import { CloseButton } from "./CloseButton";
import "./ModalHeader.css"

// ui/ModalHeader.jsx
export const ModalHeader = ({ title, onClose }) => (
  <div className="modal-header">
    <h3>{title}</h3>
    <CloseButton onClick={onClose} />
  </div>
);