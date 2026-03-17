import { useContext, useEffect } from "react";
import { TaskList } from "../../../../components/community/syllabus/TaskList";
import "../../Communities.css";
import { CommunityContext } from "../../../../context/CommunityContext";

export const CommunitySyllabus = ({ communityId, joined, onViewNotes }) => {
  const { syllabusMap, syllabusLoading, fetchSyllabus, toggleTask } =
    useContext(CommunityContext);

  const syllabus = syllabusMap[communityId] || [];

  useEffect(() => {
    fetchSyllabus(communityId);
  }, [communityId]);

  return (
    <>
      {!joined && (
        <p className="syllabus-join-message">
          Join community to track progress
        </p>
      )}

      <TaskList
        syllabus={syllabus}
        onToggle={(taskId, next) => toggleTask(communityId, taskId, next)}
        disabled={!joined}
        loading={syllabusLoading}
        onViewNotes={onViewNotes}
      />
    </>
  );
};
