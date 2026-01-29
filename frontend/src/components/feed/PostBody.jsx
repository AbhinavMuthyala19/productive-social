import { Button } from "../ui/Button";
import "./PostBody.css";
import notesIcon from "../../assets/icons/notes.svg";

export const PostBody = ({ title, content, images = [], notes }) => {
  return (
    <>
      <div className="post-body">
        <h3 className="post-heading">{title}</h3>
        {content && <p className="post-content">{content}</p>}
        <div className="post-images">
          {images.length > 0 &&
            images.map((image) => (
              <img
                key={image.id || image.imageUrl}
                className="post-image"
                src={`${import.meta.env.VITE_API_URL}${image.imageUrl}`}
                alt="Post media"
              />
            ))}
        </div>
        {notes && (
          <Button variant="notes-button">
            <img src={notesIcon} alt="Notes" />
              Notes attached
          </Button>
        )}
      </div>
    </>
  );
};
