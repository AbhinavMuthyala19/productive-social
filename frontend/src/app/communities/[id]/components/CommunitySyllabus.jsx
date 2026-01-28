import { useEffect, useState } from "react";
import { getCommunitySyllabus, updateCommunityTask } from "../../../../lib/api";
import { TaskList } from "../../../../components/community/syllabus/TaskList";
import "../../Communities.css";

export const CommunitySyllabus = ({ communityId, joined }) => {
  const [syllabus, setSyllabus] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (syllabus.length === 0) {
      fetchSyllabus();
    }
  }, [communityId]);

  const fetchSyllabus = async () => {
    try {
      setLoading(true);
      const res = await getCommunitySyllabus(communityId);
      setSyllabus(res.data);
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (taskId, nextCompleted) => {
    setSyllabus((prev) =>
      prev.map((task) =>
        task.taskId === taskId ? { ...task, completed: nextCompleted } : task,
      ),
    );

    try {
      await updateCommunityTask(communityId, taskId, nextCompleted);
    } catch {
      setSyllabus((prev) =>
        prev.map((task) =>
          task.taskId === taskId
            ? { ...task, completed: !nextCompleted }
            : task,
        ),
      );
    }
  };

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
        loading={loading}
      />
    </>
  );
};
