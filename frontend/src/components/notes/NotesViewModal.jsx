import { Modal } from "../ui/Modal";
import "./Notes.css";
import { downloadNotes } from "../../lib/api";
import { NotesCard } from "./NotesCard";
import { downloadFile } from "../../lib/downloadFile";
import { ModalHeader } from "../ui/ModalHeader";

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
      <ModalHeader title={"Notes attached"} onClose={onClose}/>

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