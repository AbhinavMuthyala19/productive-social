import { Button } from "../ui/Button";
import { Download } from "lucide-react";

export const NotesCard = ({ file, onDownload }) => {
  const rawUrl = `${import.meta.env.VITE_API_URL}/${file.notesUrl}`;

  const fileName = file.originalFileName || "";
  const ext = fileName.includes(".")
    ? fileName.split(".").pop().toLowerCase()
    : "";

  let previewUrl = rawUrl;

  if (ext === "pdf") {
    previewUrl = rawUrl;
  } else if (["doc", "docx", "ppt", "pptx", "xls", "xlsx"].includes(ext)) {
    previewUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(rawUrl)}`;
  }

  const formatSize = (size) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="notes-item">
      <a
        className="notes-link"
        href={previewUrl || "#"}
        target="_blank"
        rel="noopener noreferrer"
        title="Preview file"
      >
        <div className="file-name">{fileName}</div>

        <div className="file-size">
          ({formatSize(file.fileSize || 0)})
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