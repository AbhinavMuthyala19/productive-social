import { Modal } from "../ui/Modal";
import closeIcon from "../../assets/icons/cross.svg";
import { Button } from "../ui/Button";
import "./NotesViewModal.css";

export const NotesViewModal = ({ notes, onClose, isOpen }) => {
  return (
    <Modal
      className="post-notes-modal"
      isOpen={isOpen}
      onClose={onClose}
      closeOnOutsideClick={true}
    >
      <div className="post-notes-header">
        <h3>Notes Attached</h3>
        <Button variant={"transparent-button"} onClick={onClose}>
          <img src={closeIcon} alt="close" />
        </Button>
      </div>

      <div className="post-notes-list">
        {notes.map((file) => {
          const fileUrl = `${import.meta.env.VITE_API_URL}/${file.notesUrl}`;
          const googleViewUrl = `https://docs.google.com/gview?url=${encodeURIComponent(
            fileUrl,
          )}&embedded=true`;
          return (
            <a
              className="notes-item"
              key={file.id}
              href={fileUrl}
              target="_blank"
            >
              <div className="file-name">{file.originalFileName}</div>

              <div className="file-size">
                ({(file.fileSize / 1024).toFixed(1)} KB)
              </div>
            </a>
          );
        })}
      </div>
    </Modal>
  );
};
