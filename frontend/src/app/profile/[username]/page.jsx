import { PageContainer } from "../../../components/layout/PageContainer";
import { Navbar } from "../../../components/layout/Navbar";
import "../Profile.css";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  getUserCommunities,
  getUserCommunitiesByUserName,
  getUserProfile,
  getUserProfileByUserName,
} from "../../../lib/api";
import { PostContext } from "../../../context/PostContext";
import { useParams, useSearchParams } from "react-router-dom";
import { useLeaveCommunity } from "../../../hooks/useLeaveCommunity";
import { CommunityContext } from "../../../context/CommunityContext";
import { CommunityLeaveModal } from "../../../components/community/actions/CommunityLeaveModal";
import { AuthContext } from "../../../context/AuthContext";
import { ProfileHeaderSection } from "./components/ProfileHeaderSection";
import { ProfileFeed } from "./components/ProfileFeed";
import { ProfileCommunities } from "./components/ProfileCommunities";

export const Profile = () => {
  const { toggleJoinCommunity } = useContext(CommunityContext);
  const {
    posts,
    fetchUserPosts,
    loading: postLoading,
    handleCommentAdded,
    toggleLike
  } = useContext(PostContext);
  const { user: loggedInUser } = useContext(AuthContext);
  const leaveModal = useLeaveCommunity(toggleJoinCommunity);
  const [userProfile, setUserProfile] = useState(null);
  const [userCommunities, setUserCommunities] = useState([]);
  const [profileLoading, setProfileLoading] = useState(false);
  const [communitiesLoading, setCommunitiesLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab") || "Feed";
  const [active, setActive] = useState(tabFromUrl);
  const tabs = ["Feed", "Communities"];
  const { username } = useParams();

  const profilePosts = useMemo(
    () => posts.filter((post) => post.user.username === userProfile?.username),
    [posts, userProfile?.username],
  );

  const isOwnProfile = !username || loggedInUser?.username === username;

  const fetchUserProfile = useCallback(async () => {
    try {
      setProfileLoading(true);
      const res = username
        ? await getUserProfileByUserName(username)
        : await getUserProfile();

      setUserProfile(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setProfileLoading(false);
    }
  }, [username]);

  const fetchUserCommunities = useCallback(async () => {
    try {
      setCommunitiesLoading(true);
      const res = username
        ? await getUserCommunitiesByUserName(username)
        : await getUserCommunities();

      setUserCommunities(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setCommunitiesLoading(false);
    }
  }, [username]);
  useEffect(() => {
    fetchUserProfile();
  }, [username, fetchUserProfile]);

  useEffect(() => {
    if (active === "Feed" && profilePosts.length === 0) {
      fetchUserPosts(username);
    }
  }, [active, username, fetchUserPosts, profilePosts.length]);

  useEffect(() => {
    if (active === "Communities" && userProfile?.id) {
      fetchUserCommunities();
    }
  }, [active, userProfile?.id]);

  const handleLeaveClick = (community) => {
    leaveModal.open(community);
  };

  const confirmLeave = async () => {
    await leaveModal.confirm();

    setUserCommunities((prev) =>
      prev.filter((c) => c.id !== leaveModal.community.id),
    );
  };

  return (
    <PageContainer>
      <Navbar />
      {userProfile && (
        <ProfileHeaderSection
          userProfile={userProfile}
          activeTab={active}
          setActive={setActive}
          tabs={tabs}
          setSearchParams={setSearchParams}
        />
      )}
      <div className="main">
        {active === "Feed" && (
          <ProfileFeed
            posts={profilePosts}
            loading={postLoading.user}
            onCommentAdded={handleCommentAdded}
            onToggleLike={toggleLike}
          />
        )}

        {active === "Communities" && (
          <ProfileCommunities
            communities={userCommunities}
            loading={communitiesLoading}
            isOwnProfile={isOwnProfile}
            onLeave={handleLeaveClick}
            onJoin={toggleJoinCommunity}
          />
        )}
      </div>
      {/* ✅ Leave modal */}
      <CommunityLeaveModal
        isOpen={leaveModal.isOpen}
        onClose={leaveModal.close}
        onConfirm={confirmLeave}
      />
    </PageContainer>
  );
};
