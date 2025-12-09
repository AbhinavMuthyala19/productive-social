import { Button } from "../ui/Button"
import "./PostBody.css"
import notesIcon from "../../assets/icons/notes.svg"
import { Link } from "react-router-dom"

export const PostBody = ({ content, image, notes }) => {
    return (
        <>
            <div className="post-body">
                <h3 className="post-heading">{content.heading}</h3>
                <p className="post-content">{content.post}</p>
                {image && <img className="post-image" src={image} alt="Post media" />}

                <Button variant="notes-button">
                    <img src={notesIcon} alt="Notes" />
                    <Link className="notes-link-text" to={notes}>Notes attached</Link>
                </Button>
            </div>

        </>
    )
}