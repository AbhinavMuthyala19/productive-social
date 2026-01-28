import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getCommunities } from "../lib/api";
import { AuthContext } from "./AuthContext";
import { joinCommunity, leaveCommunity } from "../lib/api";

export const CommunityContext = createContext();

export const CommunityProvider = ({ children }) => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setCommunities([]);
      return;
    }
    fetchCommunities();
  }, [user, authLoading]);

  const fetchCommunities = useCallback(async () => {
    if (communities.length > 0) return;
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
  }, [communities.length]);

  const toggleJoinCommunity = useCallback(
    async (communityId) => {
      setCommunities((prev) => {
        const community = prev.find((c) => c.id === communityId);
        if (!community) return prev;

        const nextJoined = !community.joined;

        return prev.map((c) =>
          c.id === communityId
            ? {
                ...c,
                joined: nextJoined,
                memberCount: c.memberCount + (nextJoined ? 1 : -1),
              }
            : c,
        );
      });

      try {
        const community = communities.find((c) => c.id === communityId);
        if (!community) return;

        community.joined
          ? await leaveCommunity(communityId)
          : await joinCommunity(communityId);
      } catch (error) {
        console.error(error);
        fetchCommunities(); // fallback resync
      }
    },
    [communities, fetchCommunities],
  );

  return (
    <CommunityContext.Provider
      value={{
        communities,
        loading,
        error,
        fetchCommunities,
        toggleJoinCommunity,
      }}
    >
      {children}
    </CommunityContext.Provider>
  );
};
