import { useContext, useEffect } from "react";
import { TaskList } from "../../../../components/community/syllabus/TaskList";
import "../../Communities.css";
import { CommunityContext } from "../../../../context/CommunityContext";

export const CommunitySyllabus = ({ communityId, joined }) => {
  const { syllabusMap, syllabusLoading, fetchSyllabus, toggleTask } =
    useContext(CommunityContext);

  const syllabus = syllabusMap[communityId] || [];

  console.log(syllabus)

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
        onToggle={toggleTask}
        disabled={!joined}
        loading={syllabusLoading}
      />
    </>
  );
};
