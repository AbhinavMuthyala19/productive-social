import { Button } from "../ui/Button";
import "./PostBody.css";
import notesIcon from "../../assets/icons/notes.svg";

export const PostBody = ({
  title,
  content,
  images = [],
  notes,
  onOpenNotes,
}) => {
  return (
    <div className="post-body">
      <h3 className="post-heading">{title}</h3>

      {content && <p className="post-content">{content}</p>}

      <div className="post-images">
        {images.length > 0 &&
          images.map((image) => {
            const url = `${import.meta.env.VITE_API_URL}/${image.imageUrl}`;

            return (
              <a
                key={image.id || image.imageUrl} // ✅ FIX
                href={url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img className="post-image" src={url} alt="Post media" />
              </a>
            );
          })}
      </div>

      {notes && notes.length >= 1 && (
        <Button
          variant="notes-button"
          onClick={() => onOpenNotes(notes)} // ✅ NEW
        >
          <img src={notesIcon} alt="Notes" />
          {`Notes attached (${notes.length})`}
        </Button>
      )}
    </div>
  );
};
