import { useEffect, useState } from "react";
import { Modal } from "../ui/Modal";
import plusIcon from "../../assets/icons/plus.svg";
import "./AttachmentsModal.css";
import { Tabs } from "../ui/Tabs";
import { Button } from "../ui/Button";
import { ModalHeader } from "../ui/ModalHeader";

export const AttachmentsModal = ({
  isOpen,
  onClose,
  images = [],
  setImages,
  notes = [],
  existingNotes = [],
  setNotes,
  allowedTabs = ["Images", "Notes", "Existing Notes"],
}) => {
  const [active, setActive] = useState(allowedTabs[0]);
  const [previews, setPreviews] = useState([]);
  const attachmentTabs = allowedTabs;
  const isImagesTab = active === "Images";
  const files = active === "Images" ? images : active === "Notes" ? notes : [];
  const setFiles =
    active === "Images" ? setImages : active === "Notes" ? setNotes : null;
  const isExistingNotesTab = active === "Existing Notes";

  const removeFile = (index) => {
    if (!setFiles) return;
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const inputId = `attachment-upload-${active.toLowerCase()}`;

  useEffect(() => {
    if (isOpen) setActive(attachmentTabs[0]);
  }, [isOpen]);

  useEffect(() => {
    if (!isImagesTab) return;

    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviews(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files, isImagesTab]);
  console.log(notes)
  return (
    <Modal
      className="attachment-modal"
      isOpen={isOpen}
      onClose={onClose}
      closeOnOutsideClick={false}
    >
      <ModalHeader title={"Attachments"} onClose={onClose} />
      <div className="attachment-tabs">
        <Tabs tabs={attachmentTabs} active={active} onChange={setActive} />
      </div>
      <div className="upload-box">
        {!isExistingNotesTab && files.length === 0 && (
          <div className="upload-center">
            <img
              className="upload-btn"
              src={plusIcon}
              alt="upload"
              onClick={() => document.getElementById(inputId).click()}
            />
          </div>
        )}

        {!isExistingNotesTab && (
          <input
            type="file"
            accept={isImagesTab ? "image/*" : ".pdf,.doc,.docx"}
            multiple
            hidden
            id={inputId}
            onChange={(e) => {
              const files = Array.from(e.target.files);
              setFiles((prev) => [...prev, ...files]);
            }}
          />
        )}
        <div className="attachment-preview">
          {isExistingNotesTab
            ? existingNotes.map((note) => {
                const isAlreadyAdded = notes.some((n) => n.id === note.id);

                return (
                  <div key={note.id} className="preview-wrapper">
                    <div className="file-preview">
                      <p>📄 {note.originalFileName}</p>

                      <Button
                        type="button"
                        onClick={() =>
                          setNotes((prev) => {
                            const exists = prev.some((p) => p.id === note.id);

                            if (exists) {
                              return prev.filter((p) => p.id !== note.id);
                            }

                            return [...prev, { ...note, existing: true }];
                          })
                        }
                      >
                        {isAlreadyAdded ? "Remove" : "Add"}
                      </Button>
                    </div>
                  </div>
                );
              })
            : files.map((file, idx) => (
                <div
                  key={file.id || file.name || idx}
                  className={
                    active === "Images"
                      ? "image-preview"
                      : active === "Notes"
                        ? "file-preview"
                        : ""
                  }
                >
                  <Button
                    type="button"
                    className="preview-remove"
                    onClick={() => removeFile(idx)}
                  >
                    ✕
                  </Button>

                  {isImagesTab ? (
                    <img src={previews[idx] || ""} className="preview-img" />
                  ) : (
                    <div>📄 {file.name || file.originalFileName}</div>
                  )}
                </div>
              ))}
        </div>
      </div>
      <Button className={"attachment-button"} onClick={onClose}>
        Done
      </Button>
    </Modal>
  );
};
