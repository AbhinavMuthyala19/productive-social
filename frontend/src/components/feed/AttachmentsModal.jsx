import { useEffect, useState } from "react";
import { Modal } from "../ui/Modal";
import closeIcon from "../../assets/icons/cross.svg";
import plusIcon from "../../assets/icons/plus.svg";
import "./AttachmentsModal.css";
import { Tabs } from "../ui/Tabs";
import { Button } from "../ui/Button";

export const AttachmentsModal = ({
  isOpen,
  onClose,
  images,
  setImages,
  notes,
  setNotes,
}) => {
  const [active, setActive] = useState("Images");
  const [previews, setPreviews] = useState([]);
  const attachmentTabs = ["Images", "Notes"];
  const isImagesTab = active === "Images";
  const files = isImagesTab ? images : notes;
  const setFiles = isImagesTab ? setImages : setNotes;

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const inputId = `attachment-upload-${active.toLowerCase()}`;

  useEffect(() => {
    if (isOpen) setActive("Images");
  }, [isOpen]);

  useEffect(() => {
    if (!isImagesTab) return;

    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviews(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files, isImagesTab]);

  return (
    <Modal
      className="attachment-modal"
      isOpen={isOpen}
      onClose={onClose}
      closeOnOutsideClick={false}
    >
      <div className="create-post-header">
        <h3>Attachments</h3>
        <Button variant={"transparent-button"} onClick={onClose}>
          <img src={closeIcon} alt="close" />
        </Button>
      </div>
      <div className="attachment-tabs">
        <Tabs tabs={attachmentTabs} active={active} onChange={setActive} />
      </div>
      <div className="upload-box">
        <img
          className={`upload-btn ${files.length > 0 ? "hidden" : ""}`}
          src={plusIcon}
          alt="upload"
          onClick={() => document.getElementById(inputId).click()}
        />

        <input
          type="file"
          accept={active === "Images" ? "image/*" : ".pdf,.doc,.docx"}
          multiple
          hidden
          id={inputId}
          onChange={(e) => {
            const files = Array.from(e.target.files);
            setFiles((prev) => [...prev, ...files]);
          }}
        />
        <div className="image-preview">
          {files.map((file, idx) => (
            <div key={idx} className="preview-wrapper">
              <button
                type="button"
                className="preview-remove"
                onClick={() => removeFile(idx)}
              >
                ✕
              </button>

              {isImagesTab ? (
                <img src={previews[idx]} className="preview-img" />
              ) : (
                <div className="file-preview">📄 {file.name}</div>
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
