import { Button } from "../ui/Button";
import { Download } from "lucide-react";

export const NotesCard = ({ file, onDownload }) => {
  const fileUrl = `${import.meta.env.VITE_API_URL}/${file.notesUrl}`;

  return (
    <div className="notes-item">
      <a className="notes-link" href={fileUrl} target="_blank" rel="noopener noreferrer">
        <div className="file-name">{file.originalFileName}</div>

        <div className="file-size">
          ({(file.fileSize / 1024).toFixed(1)} KB)
        </div>
      </a>

      <Button
        onClick={() => onDownload(file.id)}
        className="notes-download-button"
      >
        <Download className="download-icon" size={20} />
      </Button>
    </div>
  );
};