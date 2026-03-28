import { useContext, useEffect, useState } from "react";
import { Modal } from "../ui/Modal";
import { Select } from "../ui/Select";
import "./CreatePostModal.css";
import { Input } from "../ui/Input";
import { TextArea } from "../ui/TextArea";
import { Button } from "../ui/Button";
import attachmentIcon from "../../assets/icons/attachment.svg";
import { createPost, getUserNotes } from "../../lib/api";
import { AttachmentsModal } from "./AttachmentsModal";
import { toast } from "sonner";
import { CommunityContext } from "../../context/CommunityContext";
import { Loader } from "lucide-react";
import { ModalHeader } from "../ui/ModalHeader";

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
  const [existingNotes, setExistingNotes] = useState([]);
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

  useEffect(() => {
    if (showAttachmentsModal) {
      fetchExistingNotes();
    }
  }, [showAttachmentsModal]);

  const resetForm = () => {
    setCommunityId(defaultCommunityId || "");
    setTaskId("");
    setTitle("");
    setContent("");
    setImages([]);
    setNotes([]);
    setExistingNotes([]);
  };

  const fetchExistingNotes = async () => {
    try {
      const res = await getUserNotes();

      // expected format: [{ id, fileName, url }]
      setExistingNotes(res.data);
    } catch (err) {
      console.error("Failed to fetch notes", err);
    }
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
      taskId: taskId ? Number(taskId) : null,
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

    const newNotes = notes.filter((n) => !n.existing);
    const existingNoteIds = notes.filter((n) => n.existing).map((n) => n.id);

    newNotes.forEach((file) => {
      formData.append("notes", file);
    });

    if (existingNoteIds.length > 0) {
      formData.append(
        "existingNoteIds",
        new Blob([JSON.stringify(existingNoteIds)], {
          type: "application/json",
        }),
      );
    }

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

  const imageCount = images.length;
  const noteCount = notes.length;
  const totalAttachments = imageCount + noteCount;

  return (
    <Modal
      className="create-post-modal"
      isOpen={isOpen}
      onClose={handleClose}
      closeOnOutsideClick={false}
    >
      <ModalHeader title={"Create Post"} onClose={handleClose} />

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
            <label htmlFor="topic">Syllabus</label>
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
              Attachments {totalAttachments > 0 && `(${totalAttachments})`}
            </Button>
          </div>

          <Button
            type="submit"
            className={"create-post-submit-button"}
            disabled={posting}
          >
            {posting ? (
              <Loader className="spinner-icon" size={24} />
            ) : (
              "Publish"
            )}
          </Button>
        </form>

        <AttachmentsModal
          isOpen={showAttachmentsModal}
          onClose={() => {
            setShowAttachmentsModal(false);
          }}
          onDone={() => setShowAttachmentsModal(false)}
          images={images}
          setImages={setImages}
          notes={notes}
          setNotes={setNotes}
          existingNotes={existingNotes}
        />
      </div>
    </Modal>
  );
};
