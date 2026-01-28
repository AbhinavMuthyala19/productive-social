import { useEffect, useState } from "react";
import { Modal } from "../ui/Modal";
import { Select } from "../ui/Select";
import closeIcon from "../../assets/icons/cross.svg";
import "./CreatePostModal.css";
import { Input } from "../ui/Input";
import { TextArea } from "../ui/TextArea";
import { Button } from "../ui/Button";
import attachmentIcon from "../../assets/icons/attachment.svg";
import { createPost } from "../../lib/api";
import { AttachmentsModal } from "./AttachmentsModal";
import { toast } from "sonner";

export const CreatePostModal = ({
  isOpen,
  onClose,
  joinedCommunities = [],
  onPostCreated,
  defaultCommunityId,
}) => {
  const [communityId, setCommunityId] = useState(defaultCommunityId || "");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [notes, setNotes] = useState([]);
  const [showAttachmentsModal, setShowAttachmentsModal] = useState(false);

  useEffect(() => {
    if (defaultCommunityId) {
      setCommunityId(defaultCommunityId);
    }
  }, [defaultCommunityId, isOpen]);

  const resetForm = () => {
    setCommunityId(defaultCommunityId || "");
    setTitle("");
    setContent("");
    setImages([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    const postData = {
      communityId: Number(communityId),
      title,
      content,
    };

    formData.append(
      "data",
      new Blob([JSON.stringify(postData)], {
        type: "application/json",
      }),
    );

    images.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const res = await createPost(formData);
      onPostCreated(res.data);
      toast.success("Post created!")
      handleClose();
    } catch (err) {
      console.error("Create post failed:", err);
      toast.error(err.response?.data?.message || "Failed to create post")
    }
  };

  return (
    <Modal
      className="create-post-modal"
      isOpen={isOpen}
      onClose={handleClose}
      closeOnOutsideClick={false}
    >
      <div className="create-post-header">
        <h3>Create Post</h3>
        <img onClick={handleClose} src={closeIcon} alt="close" />
      </div>

      <div className="create-post-form">
        <form onSubmit={handleSubmit}>
          <div className="community-input">
            <label htmlFor="community">
              Community<span style={{ color: "red" }}>*</span>
            </label>
            <Select
              id={"community"}
              required
              className="create-post-select"
              placeholder="Select a Community"
              options={joinedCommunities}
              value={communityId}
              onChange={(e) => setCommunityId(e.target.value)}
              getOptionLabel={(c) => c.name}
              getOptionValue={(c) => c.id}
              disabled={!!defaultCommunityId}
            />
          </div>

          <div className="create-post-title-input">
            <label htmlFor="title">
              Title<span style={{ color: "red" }}>*</span>
            </label>
            <Input
              id={"title"}
              className={"create-post-input"}
              type={"text"}
              required
              placeholder={"What did you accomplish today?"}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="create-post-title-input">
            <label htmlFor="description">Description</label>
            <TextArea
              id={"description"}
              className={"create-post-textarea"}
              type={"text"}
              placeholder={
                "Share details about your progress, learnings or challenges..."
              }
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <div className="create-post-upload">
            <Button
              className={"create-post-upload-button"}
              onClick={() => setShowAttachmentsModal(true)}
            >
              <img src={attachmentIcon} alt="notes" />
              Attachments
            </Button>
            {images.length > 0 && (
              <div className="images-add-msg">{images.length} Images Added</div>
            )}
          </div>

          <Button type="submit" className={"create-post-submit-button"}>
            Publish
          </Button>
        </form>

        <AttachmentsModal
          isOpen={showAttachmentsModal}
          onClose={() => setShowAttachmentsModal(false)}
          images={images}
          setImages={setImages}
          notes={notes}
          setNotes={setNotes}
        />
      </div>
    </Modal>
  );
};
