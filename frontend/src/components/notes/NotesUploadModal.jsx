import { Loader, X } from "lucide-react";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import "./Notes.css";
import { Select } from "../ui/Select";
import { useContext, useEffect, useMemo, useState } from "react";
import { CommunityContext } from "../../context/CommunityContext";
import { AttachmentsModal } from "../feed/AttachmentsModal";
import { uploadNotes } from "../../lib/api";
import { toast } from "sonner";

export const NotesUploadModal = ({ isOpen, onClose, onUploadSuccess }) => {
  const { communities, syllabusMap, fetchSyllabus } =
    useContext(CommunityContext);
  const [communityId, setCommunityId] = useState("");
  const [taskId, setTaskId] = useState("");
  const [notes, setNotes] = useState([]);
  const [posting, setPosting] = useState(false);
  const [showAttachmentsModal, setShowAttachmentsModal] = useState(false);
  const syllabusOptions = syllabusMap[communityId] || [];
  const joinedCommunitiesMap = useMemo(() => {
    return new Map(
      (communities || []).filter((c) => c.joined).map((c) => [c.id, c]),
    );
  }, [communities]);
  const joinedCommunityOptions = useMemo(
    () => Array.from(joinedCommunitiesMap.values()),
    [joinedCommunitiesMap],
  );

  useEffect(() => {
    if (communityId && !syllabusMap[communityId]) {
      fetchSyllabus(communityId);
    }
  }, [communityId]);

  useEffect(() => {
    if (!isOpen) {
      setCommunityId("");
      setTaskId("");
      setNotes([]);
    }
  }, [isOpen]);


  const handleSubmit = async (e) => {
  e.preventDefault();

  if (notes.length === 0) return;

  try {
    setPosting(true);

    const formData = new FormData();

    formData.append("file", notes[0]);

    formData.append(
      "data",
      new Blob(
        [
          JSON.stringify({
            communityId,
            taskId,
          }),
        ],
        { type: "application/json" }
      )
    );

    const res = await uploadNotes(formData); // ✅ capture response

    // ✅ send new note back to parent
    onUploadSuccess?.(res.data);
    toast.success("Notes uploaded...")
    // reset
    setCommunityId("");
    setTaskId("");
    setNotes([]);
    onClose();
  } catch (error) {
    console.error(error);
    toast.error("Notes upload failed")
  } finally {
    setPosting(false);
  }
};


  return (
    <Modal className="notes-upload-modal" isOpen={isOpen} onClose={onClose}>
      <div className="notes-upload-header">
        <h3>Upload Notes</h3>
        <Button variant={"transparent-button"} onClick={onClose}>
          <X className="close-icon" size={20} />
        </Button>
      </div>
      <div className="create-post-form">
        <form onSubmit={handleSubmit}>
          <div className="community-input">
            <label htmlFor="community">Community</label>
            <Select
              className={"create-post-select"}
              id={"community"}
              placeholder="Select a Community"
              options={joinedCommunityOptions}
              value={communityId}
              onChange={(e) => {
                setCommunityId(e.target.value);
                setTaskId("");
              }}
              getOptionLabel={(c) => c.name}
              getOptionValue={(c) => c.id}
            />
          </div>
          <div className="create-post-syllabus-input">
            <label htmlFor="topic">Syllabus</label>
            <Select
              className={"create-post-select"}
              id={"topic"}
              placeholder="Select a Topic"
              options={syllabusOptions}
              value={taskId}
              onChange={(e) => setTaskId(e.target.value)}
              getOptionLabel={(task) => task.title}
              getOptionValue={(task) => task.taskId}
              disabled={!communityId}
            />
          </div>

          <div className="create-post-upload">
            <Button
              className={"create-post-upload-button"}
              onClick={() => setShowAttachmentsModal(true)}
            >
              {notes.length > 0
                ? `${notes.length} Notes Selected`
                : "Select Notes"}
            </Button>
          </div>

          <Button
            type="submit"
            className={"create-post-submit-button"}
            disabled={posting || notes.length === 0}
          >
            {posting ? <Loader className="spinner-icon" size={24} /> : "Upload"}
          </Button>
        </form>
        <AttachmentsModal
          isOpen={showAttachmentsModal}
          onClose={() => setShowAttachmentsModal(false)}
          notes={notes}
          setNotes={setNotes}
          allowedTabs={["Notes"]}
        />
      </div>
    </Modal>
  );
};
