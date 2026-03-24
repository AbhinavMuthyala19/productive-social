import { Modal } from "../ui/Modal";
import closeIcon from "../../assets/icons/cross.svg";
import { Button } from "../ui/Button";
import "./Notes.css";
import { downloadNotes } from "../../lib/api";
import { NotesCard } from "./NotesCard";
import { downloadFile } from "../../lib/downloadFile";

export const NotesViewModal = ({ notes, onClose, isOpen }) => {

  const handleNotesDownload = async (notesId) => {
    const res = await downloadNotes(notesId);
    downloadFile(res.data, "notes.pdf")
  };

  return (
    <Modal
      className="post-notes-modal"
      isOpen={isOpen}
      onClose={onClose}
      closeOnOutsideClick={true}
    >
      <div className="post-notes-header">
        <h3>Notes Attached</h3>

        <Button variant="transparent-button" onClick={onClose}>
          <img src={closeIcon} alt="close" />
        </Button>
      </div>

      <div className="post-notes-list">
        {notes?.map((file) => (
          <NotesCard
            key={file.id}
            file={file}
            onDownload={handleNotesDownload}
          />
        ))}
      </div>
    </Modal>
  );
};