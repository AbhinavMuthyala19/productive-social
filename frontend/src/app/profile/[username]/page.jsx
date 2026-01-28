import { PageContainer } from "../../../components/layout/PageContainer";
import { Navbar } from "../../../components/layout/Navbar";
import { PageHeader } from "../../../components/layout/PageHeader";
import { ProfileHeader } from "../../../components/profile/ProfileHeader";
import "../Profile.css";
import { ProfileTabs } from "../../../components/profile/ProfileTabs";
import { useContext, useEffect, useState } from "react";
import {
  getUserCommunities,
  getUserCommunitiesByUserName,
  getUserProfile,
  getUserProfileByUserName,
} from "../../../lib/api";
import { PostContext } from "../../../context/PostContext";
import { PostCardSkeleton } from "../../../components/feed/PotCardSkeleton";
import { PostCard } from "../../../components/feed/PostCard";
import { useParams, useSearchParams } from "react-router-dom";
import { CommunityList } from "../../../components/community/list/CommunityList";
import { useLeaveCommunity } from "../../../hooks/useLeaveCommunity";
import { CommunityContext } from "../../../context/CommunityContext";
import { CommunityLeaveModal } from "../../../components/community/actions/CommunityLeaveModal";
import { AuthContext } from "../../../context/AuthContext";

export const Profile = () => {
  const { toggleJoinCommunity } = useContext(CommunityContext);
  const {
    posts,
    fetchUserPosts,
    loading: postLoading,
    handleCommentAdded,
  } = useContext(PostContext);
  const { user: loggedInUser } = useContext(AuthContext);
  const leaveModal = useLeaveCommunity(toggleJoinCommunity);
  const [userProfile, setUserProfile] = useState(null);

  const [userCommunities, setUserCommunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab") || "Feed";
  const [active, setActive] = useState(tabFromUrl);
  const tabs = ["Feed", "Communities"];
  const { username } = useParams();

  const communityPosts = posts.filter(
    (post) => post.user.username === userProfile?.username,
  );

  const isOwnProfile = !username || loggedInUser?.username === username;

  useEffect(() => {
    fetchUserProfile();
  }, [username]);

  useEffect(() => {
    if (active === "Feed") {
      fetchUserPosts(username);
    }
  }, [active, username]);

  useEffect(() => {
    if (active === "Communities" && userProfile?.id) {
      fetchUserCommunities();
    }
  }, [active, userProfile?.id]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const res = username
        ? await getUserProfileByUserName(username)
        : await getUserProfile();

      setUserProfile(res.data);
      console.log(res.data)
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserCommunities = async () => {
    try {
      setLoading(true);
      const res = username
        ? await getUserCommunitiesByUserName(username)
        : await getUserCommunities();

      setUserCommunities(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

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
      <PageHeader className={"profile-page-header"}>
        <ProfileHeader
          name={userProfile?.name}
          username={userProfile?.username}
          bio={userProfile?.bio}
          streak={userProfile?.stats?.streak}
          longestStreak={userProfile?.stats?.longestStreak}
          posts={userProfile?.stats?.posts}
          communities={userProfile?.stats?.communities}
        />

        <ProfileTabs
          active={active}
          setActive={setActive}
          tabs={tabs}
          setSearchParams={setSearchParams}
        />
      </PageHeader>
      <div className="main">
        {active === "Feed" &&
          (postLoading.user
            ? Array.from({ length: 3 }).map((_, i) => (
                <PostCardSkeleton key={i} />
              ))
            : communityPosts.map((post) => (
                <PostCard
                  key={post.postId}
                  post={post}
                  onCommentAdded={() => handleCommentAdded(post.postId)}
                  displayCommunityBadge
                  userNameClickable={false}
                />
              )))}

        {active === "Communities" && (
          <CommunityList
            communities={userCommunities}
            view={"list"}
            loading={loading}
            onLeave={isOwnProfile ? handleLeaveClick : undefined}
            onJoin={isOwnProfile ? toggleJoinCommunity : undefined}
          />
        )}
      </div>
      {/* ✅ Leave modal */}
      <CommunityLeaveModal
        isOpen={leaveModal.isOpen}
        onClose={leaveModal.close}
        onClick={confirmLeave}
      />
    </PageContainer>
  );
};
