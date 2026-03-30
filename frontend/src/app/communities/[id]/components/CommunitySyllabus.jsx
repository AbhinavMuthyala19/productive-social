import { useContext, useEffect } from "react";
import { TaskList } from "../../../../components/community/syllabus/TaskList";
import "../../Communities.css";
import { CommunityContext } from "../../../../context/CommunityContext";

export const CommunitySyllabus = ({ communityId, joined, onViewNotes }) => {
  const { syllabusMap, syllabusLoading, fetchSyllabus, toggleTask } =
    useContext(CommunityContext);

  const syllabus = syllabusMap[communityId] || [];
  const hasSyllabus = communityId in syllabusMap;

  useEffect(() => {
    if (!communityId || hasSyllabus) return;

    fetchSyllabus(communityId);
  }, [communityId, hasSyllabus]);

  return (
    <>
      {!joined && (
        <p className="syllabus-join-message">
          Join community to track progress
        </p>
      )}

      {!syllabusLoading && syllabus.length === 0 && (
        <p className="empty-syllabus">No tasks available for this community</p>
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
