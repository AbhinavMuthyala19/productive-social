import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getCommunities, getCommunitySyllabus } from "../lib/api";
import { AuthContext } from "./AuthContext";
import { joinCommunity, leaveCommunity } from "../lib/api";

export const CommunityContext = createContext();

export const CommunityProvider = ({ children }) => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [syllabusMap, setSyllabusMap] = useState({});
  const [syllabusLoading, setSyllabusLoading] = useState(false);

  const fetchCommunities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getCommunities();

      const sorted = [...res.data].sort((a, b) => {
        if (a.joined !== b.joined) {
          return Number(b.joined) - Number(a.joined);
        }
        return b.memberCount - a.memberCount;
      });

      setCommunities(sorted);
    } catch (error) {
      console.error(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleJoinCommunity = useCallback(
    async (communityId) => {
      const community = communities.find((c) => c.id === communityId);
      if (!community) return;

      const nextJoined = !community.joined;

      // 1️⃣ Optimistic UI update
      setCommunities((prev) =>
        prev.map((c) =>
          c.id === communityId
            ? {
                ...c,
                joined: nextJoined,
                memberCount: c.memberCount + (nextJoined ? 1 : -1),
              }
            : c,
        ),
      );

      // 2️⃣ Correct API call
      try {
        if (nextJoined) {
          await joinCommunity(communityId);
        } else {
          await leaveCommunity(communityId);
        }
      } catch {
        // rollback
        setCommunities((prev) =>
          prev.map((c) =>
            c.id === communityId
              ? {
                  ...c,
                  joined: !nextJoined,
                  memberCount: c.memberCount + (nextJoined ? -1 : 1),
                }
              : c,
          ),
        );
      }
    },
    [communities],
  );

  const fetchSyllabus = useCallback(async (communityId) => {
    try {
      setSyllabusLoading(true);

      const res = await getCommunitySyllabus(communityId);

      setSyllabusMap((prev) => ({
        ...prev,
        [communityId]: res.data,
      }));
    } finally {
      setSyllabusLoading(false);
    }
  }, []);

  const toggleTask = useCallback(async (communityId, taskId, nextCompleted) => {
    // optimistic update
    setSyllabusMap((prev) => ({
      ...prev,
      [communityId]: prev[communityId]?.map((task) =>
        task.taskId === taskId ? { ...task, completed: nextCompleted } : task,
      ),
    }));

    try {
      await updateCommunityTask(communityId, taskId, nextCompleted);
    } catch {
      // rollback
      setSyllabusMap((prev) => ({
        ...prev,
        [communityId]: prev[communityId]?.map((task) =>
          task.taskId === taskId
            ? { ...task, completed: !nextCompleted }
            : task,
        ),
      }));
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setCommunities([]);
      return;
    }
    fetchCommunities();
  }, [user, authLoading, fetchCommunities]);

  const value = useMemo(
    () => ({
      communities,
      loading,
      error,
      fetchCommunities,
      toggleJoinCommunity,
      syllabusMap,
      syllabusLoading,
      fetchSyllabus,
      toggleTask,
    }),
    [
      communities,
      loading,
      error,
      fetchCommunities,
      toggleJoinCommunity,
      syllabusMap,
      syllabusLoading,
      fetchSyllabus,
      toggleTask,
    ],
  );

  return (
    <CommunityContext.Provider value={value}>
      {children}
    </CommunityContext.Provider>
  );
};
