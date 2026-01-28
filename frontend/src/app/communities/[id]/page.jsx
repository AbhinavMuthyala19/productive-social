import { useContext, useEffect, useMemo, useState } from "react";
import { PostContext } from "../../../context/PostContext";
import { CommunityContext } from "../../../context/CommunityContext";
import { useParams, useSearchParams } from "react-router-dom";
import { PageContainer } from "../../../components/layout/PageContainer";
import { Navbar } from "../../../components/layout/Navbar";
import { CreatePostModal } from "../../../components/feed/CreatePostModal";
import "../Communities.css";
import { CommunityLeaveModal } from "../../../components/community/actions/CommunityLeaveModal";
import { useLeaveCommunity } from "../../../hooks/useLeaveCommunity";
import { CommunityHeaderSection } from "./components/CommunityHeaderSection";
import { CommunityFeed } from "./components/CommunityFeed";
import { CommunitySyllabus } from "./components/CommunitySyllabus";

export const CommunityPage = () => {
  const { communities, loading, toggleJoinCommunity } =
    useContext(CommunityContext);
  const {
    posts,
    loading: postsLoading,
    fetchCommunityPosts,
    handleCommentAdded,
    addPost,
  } = useContext(PostContext);
  const leaveModal = useLeaveCommunity(toggleJoinCommunity);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab") || "Feed";
  const [active, setActive] = useState(tabFromUrl);

  const tabs = ["Feed", "Syllabus", "Notes"];
  const community = communities.find((c) => c.id === Number(id));
  const communityJoined = community?.joined;

  const communityPosts = useMemo(
    () => posts.filter((post) => post.community.id === Number(id)),
    [posts, id],
  );

  useEffect(() => {
    if (active === "Feed" && communityPosts.length === 0) {
      fetchCommunityPosts(id);
    }
  }, [active, id, fetchCommunityPosts, communityPosts.length]);

  const handleTabChange = (tab) => {
    setActive(tab);
    setSearchParams({ tab }, { replace: true });
  };

  if (loading || !community) {
    return (
      <PageContainer>
        <Navbar />
        <div style={{ padding: "16px" }}>Loading community...</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Navbar />

      <CommunityHeaderSection
        community={community}
        communityJoined={communityJoined}
        onLeave={() => leaveModal.open(community)}
        onNewPost={() => setShowCreatePost(true)}
        onJoin={() => toggleJoinCommunity(community.id)}
        tabs={tabs}
        activeTab={active}
        onTabChange={handleTabChange}
      />

      <div className="main">
        {active === "Feed" && (
          <CommunityFeed
            posts={communityPosts}
            loading={postsLoading.community}
            onCommentAdded={handleCommentAdded}
          />
        )}

        {active === "Syllabus" && (
          <CommunitySyllabus
            communityId={Number(id)}
            joined={communityJoined}
          />
        )}
      </div>

      <CreatePostModal
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        joinedCommunities={[community]}
        defaultCommunityId={community.id}
        onPostCreated={addPost}
      />

      <CommunityLeaveModal
        isOpen={leaveModal.isOpen}
        onClose={leaveModal.close}
        onClick={leaveModal.confirm}
      />
    </PageContainer>
  );
};
