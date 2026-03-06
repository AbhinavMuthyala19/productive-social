import { useContext, useEffect, useState } from "react";
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
import { CommunityContext } from "../../context/CommunityContext";

export const CreatePostModal = ({
  isOpen,
  onClose,
  joinedCommunities = [],
  onPostCreated,
  defaultCommunityId,
}) => {
  const { syllabusMap, fetchSyllabus } = useContext(CommunityContext);
  const [communityId, setCommunityId] = useState(defaultCommunityId || "");
  const [taskId, setTaskId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [notes, setNotes] = useState([]);
  const [posting, setPosting] = useState(false);
  const [showAttachmentsModal, setShowAttachmentsModal] = useState(false);
  const syllabusOptions = syllabusMap[communityId] || [];

  useEffect(() => {
    if (defaultCommunityId) {
      setCommunityId(defaultCommunityId);
    }
  }, [defaultCommunityId, isOpen]);

  useEffect(() => {
    if (communityId) {
      fetchSyllabus(communityId);
    }
  }, [communityId, fetchSyllabus]);

  const resetForm = () => {
    setCommunityId(defaultCommunityId || "");
    setTaskId("")
    setTitle("");
    setContent("");
    setImages([]);
    setNotes([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (posting) return;

    const formData = new FormData();

    const postData = {
      communityId: Number(communityId),
      taskId: Number(taskId),
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

    notes.forEach((file) => {
      formData.append("notes", file);
    });

    try {
      setPosting(true);
      const res = await createPost(formData);
      onPostCreated(res.data);
      console.log(res.data);
      toast.success("Post created!");
      handleClose();
    } catch (err) {
      console.error("Create post failed:", err);
      toast.error(err.response?.data?.message || "Failed to create post");
    } finally {
      setPosting(false);
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
        <Button variant={"transparent-button"} onClick={handleClose}>
          <img src={closeIcon} alt="close" />
        </Button>
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
          <div className="create-post-syllabus-input">
            <label htmlFor="topic">
              Syllabus
            </label>
            <Select
              id={"topic"}
              className="create-post-select"
              placeholder="Select a Topic"
              options={syllabusOptions}
              value={taskId}
              onChange={(e) => setTaskId(e.target.value)}
              getOptionLabel={(task) => task.title}
              getOptionValue={(task) => task.taskId}
              disabled={!communityId}
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

          <Button
            type="submit"
            className={"create-post-submit-button"}
            disabled={posting}
          >
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
